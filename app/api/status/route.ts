import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/db";
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId") || "";
  const job = await prisma.job.findUnique({ where:{ id: jobId }});
  return NextResponse.json(job ?? { state:"processing", url:"" });
}



