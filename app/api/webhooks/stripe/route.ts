import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;

  try {
    const body = await req.text(); // raw body for Stripe
    event = await stripe.webhooks.constructEventAsync(body, sig, whSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // OPTIONAL: log all events
    await prisma.webhookEvent.create({
      data: { id: event.id, type: event.type, payload: event as any },
    });
  } catch {}

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId as string | undefined;
      const plan = session.metadata?.plan as string | undefined;

      // fetch full session (to get customer/sub id)
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["subscription", "customer"],
      });

      const stripeCustomerId =
        (full.customer as any)?.id ?? (full.customer as string) ?? undefined;
      const stripeSubId =
        (full.subscription as any)?.id ?? (full.subscription as string) ?? undefined;

      if (userId && stripeCustomerId) {
        // ensure StripeCustomer
        await prisma.stripeCustomer.upsert({
          where: { userId },
          update: { stripeId: stripeCustomerId },
          create: { userId, stripeId: stripeCustomerId, id: crypto.randomUUID() },
        });
      }

      if (userId && stripeSubId) {
        // upsert subscription
        await prisma.subscription.upsert({
          where: { stripeSubId },
          update: {
            plan: plan ?? "basic",
            status: "active",
            currentPeriodStart: new Date(
              (full.subscription as any)?.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              (full.subscription as any)?.current_period_end * 1000
            ),
          },
          create: {
            id: crypto.randomUUID(),
            userId,
            stripeSubId,
            plan: plan ?? "basic",
            status: "active",
            currentPeriodStart: new Date(
              (full.subscription as any)?.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(
              (full.subscription as any)?.current_period_end * 1000
            ),
          },
        });

        // set user.plan
        await prisma.user.update({
          where: { id: userId },
          data: { plan: plan ?? "basic" },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      await prisma.subscription
        .update({
          where: { stripeSubId: sub.id },
          data: { status: "canceled" },
        })
        .catch(() => {});
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
