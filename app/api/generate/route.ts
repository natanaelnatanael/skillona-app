import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { PLAN_LIMITS, sinceMonthStart } from "@/lib/limits";

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();
  if(!userId) return NextResponse.json({ error:"Not signed in" }, { status:401 });
  const email = (sessionClaims as any)?.email_address || (sessionClaims as any)?.email;

  let user = await prisma.user.findFirst({ where:{ clerkId:userId }});
  if(!user) user = await prisma.user.create({ data:{ clerkId:userId, email }});

  const used = await prisma.job.count({ where:{ userId:user.id, createdAt:{ gte: sinceMonthStart() } }});
  const limit = PLAN_LIMITS[(user.plan as keyof typeof PLAN_LIMITS) ?? "free"];
  if(used >= limit) return NextResponse.json({ error:"Quota reached" }, { status:402 });

  const { prompt } = await req.json();
  const job = await prisma.job.create({ data:{ userId:user.id, prompt, state:"processing" } });

  setTimeout(async ()=>{
    await prisma.job.update({ where:{ id:job.id }, data:{ state:"done", url:"https://files.skillona.ai/demo-video.mp4" }});
  }, 5000);

  return NextResponse.json({ ok:true, jobId: job.id });
}



