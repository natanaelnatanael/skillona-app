// app/api/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/db";

export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get("jobId") || "";
    const job = await db.job.findUnique({ where: { id: jobId } });
    return NextResponse.json({ ok: true, job });
  } catch (err: any) {
    return new NextResponse(err?.message ?? "Status error", { status: 500 });
  }
}





