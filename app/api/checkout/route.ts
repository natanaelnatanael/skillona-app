import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const { userId } = await auth();
  if(!userId) return NextResponse.json({ error:"Not signed in" }, { status:401 });
  const price = plan==="pro" ? process.env.STRIPE_PRICE_PRO! : process.env.STRIPE_PRICE_BASIC!;

  let user = await prisma.user.findFirst({ where:{ clerkId:userId }});
  if(!user) user = await prisma.user.create({ data:{ clerkId:userId }});

  let sc = await prisma.stripeCustomer.findUnique({ where:{ userId:user.id }});
  if(!sc) {
    const customer = await stripe.customers.create({ email: user.email || undefined });
    sc = await prisma.stripeCustomer.create({ data:{ userId:user.id, customer: customer.id }});
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: sc.customer,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
  });

  return NextResponse.json({ url: session.url });
}

