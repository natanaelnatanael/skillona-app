import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = await req.text();
  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e:any) {
    return new NextResponse(`Webhook error: ${e.message}`, { status: 400 });
  }

  if (evt.type === "customer.subscription.created" || evt.type === "customer.subscription.updated") {
    const sub = evt.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const priceId = (sub.items.data[0].price.id);
    const plan = priceId === process.env.STRIPE_PRICE_PRO ? "pro" : "basic";
    await prisma.stripeCustomer.update({
      where:{ customer: customerId },
      data:{ priceId, plan, status: sub.status }
    });
  }
  if (evt.type === "customer.subscription.deleted") {
    const sub = evt.data.object as Stripe.Subscription;
    await prisma.stripeCustomer.update({ where:{ customer: sub.customer as string }, data:{ status: "canceled" }});
  }
  return NextResponse.json({ received: true });
}
export const config = { api: { bodyParser: false } } as any;
