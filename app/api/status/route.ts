// app/api/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId") ?? "";
  if (!jobId) {
    return NextResponse.json({ ok: false, error: "jobId required" }, { status: 400 });
  }

  const job = await db.job.findUnique({ where: { id: jobId } });
  return NextResponse.json({ ok: true, job });
}




