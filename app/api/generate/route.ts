import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getLimitByPlan } from "@/lib/limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // provjera limita
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, clerkId: userId, email: `${userId}@placeholder.local` },
  });

  const limit = getLimitByPlan(user.plan);
  const count = await prisma.job.count({ where: { userId } });
  if (count >= limit)
    return NextResponse.json({ error: "Limit reached" }, { status: 403 });

  const job = await prisma.job.create({
    data: { userId, status: "queued" as any },
  });

  // TODO: enqueue background processing
  return NextResponse.json({ jobId: job.id }, { status: 200 });
}




