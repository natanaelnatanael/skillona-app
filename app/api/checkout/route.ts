import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@lib/stripe";

export async function POST(req: NextRequest) {
  const { plan } = await req.json().catch(() => ({}));
  const priceId = plan === "pro" ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_BASIC;
  if (!priceId) return new NextResponse("Missing price", { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    allow_promotion_codes: true
  });

  return NextResponse.json({ url: session.url });
}

