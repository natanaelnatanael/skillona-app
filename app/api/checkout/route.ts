import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { plan } = await req.json();
  const { userId } = await auth();
  const price = plan === "pro" ? process.env.STRIPE_PRICE_PRO! : process.env.STRIPE_PRICE_BASIC!;
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let sc = await prisma.stripeCustomer.findUnique({ where:{ userId } });
  if (!sc) {
    const sessionUser = await fetch("https://api.clerk.com/v1/users/"+userId, { headers:{ Authorization:`Bearer ${process.env.CLERK_SECRET_KEY}` }}).then(r=>r.json()).catch(()=>null);
    const email = sessionUser?.email_addresses?.[0]?.email_address;
    const customer = await stripe.customers.create({ email });
    sc = await prisma.stripeCustomer.create({ data:{ userId, customer: customer.id }});
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
