import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse("Bad sig", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    // @ts-ignore types import at runtime
    event = (await (stripe as any).webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )) as Stripe.Event;
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // store event
  await prisma.webhookEvent.create({
    data: { type: event.type, payload: event as any },
  });

  // handle subscription events
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as any;
    const customerId = sub.customer as string;

    const sc = await prisma.stripeCustomer.findFirst({ where: { stripeId: customerId } });
    if (sc) {
      await prisma.subscription.upsert({
        where: { stripeSubId: sub.id },
        update: {
          status: sub.status,
          plan: sub.items?.data?.[0]?.price?.id || "unknown",
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
        create: {
          userId: sc.userId,
          stripeSubId: sub.id,
          status: sub.status,
          plan: sub.items?.data?.[0]?.price?.id || "unknown",
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });

      // optional: set User.plan by mapping price to plan
      if (process.env.STRIPE_PRICE_PRO && sub.items?.data?.[0]?.price?.id === process.env.STRIPE_PRICE_PRO) {
        await prisma.user.update({ where: { id: sc.userId }, data: { plan: "pro" } });
      } else if (process.env.STRIPE_PRICE_BASIC && sub.items?.data?.[0]?.price?.id === process.env.STRIPE_PRICE_BASIC) {
        await prisma.user.update({ where: { id: sc.userId }, data: { plan: "basic" } });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as any;
    const existing = await prisma.subscription.findUnique({ where: { stripeSubId: sub.id } });
    if (existing) {
      await prisma.subscription.update({ where: { stripeSubId: sub.id }, data: { status: "canceled" } });
      await prisma.user.update({ where: { id: existing.userId }, data: { plan: "free" } });
    }
  }

  return NextResponse.json({ received: true });
}
