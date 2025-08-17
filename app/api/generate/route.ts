import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { prompt } = await req.json();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // ensure user row
  let user = await prisma.user.findFirst({ where:{ clerkId: userId }});
  if (!user) user = await prisma.user.create({ data:{ clerkId: userId }});

  const job = await prisma.job.create({ data:{ userId: user.id, prompt, state:"processing" } });

  // mock render
  setTimeout(async () => {
    await prisma.job.update({ where:{ id: job.id }, data:{ state:"done", url:"https://files.skillona.ai/demo-video.mp4" }});
  }, 5000);

  return NextResponse.json({ ok: true, jobId: job.id });
}


