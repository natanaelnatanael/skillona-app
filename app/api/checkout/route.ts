import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json(); // "basic" | "pro"
    const price =
      plan === "pro" ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_BASIC;
    if (!price) return NextResponse.json({ error: "Missing price" }, { status: 400 });

    // base URL
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const success_url = `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${base}/billing/cancel`;

    // try find existing Stripe customer
    const existing = await prisma.stripeCustomer.findFirst({ where: { userId } });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: existing?.stripeId,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      metadata: { userId, plan },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Stripe error" }, { status: 500 });
  }
}
