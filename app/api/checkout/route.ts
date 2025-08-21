import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // fetch user
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId, email: "", plan: "free" },
    });
  }

  // ensure Stripe customer
  let sc = await prisma.stripeCustomer.findUnique({ where: { userId: user.id } });
  if (!sc) {
    const customer = await stripe.customers.create({ metadata: { appUserId: user.id } });
    sc = await prisma.stripeCustomer.create({
      data: { userId: user.id, stripeId: customer.id },
    });
  }

  // pick price from env
  const priceId = process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRICE_BASIC;
  if (!priceId) return new NextResponse("Missing STRIPE_PRICE_*", { status: 500 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: sc.stripeId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    metadata: { appUserId: user.id },
  });

  return NextResponse.json({ url: session.url });
}
