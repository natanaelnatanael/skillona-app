import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const jobId = new URL(req.url).searchParams.get("jobId") ?? "";

    const job = jobId
      ? await db.job.findUnique({ where: { id: jobId } })
      : null;

    return NextResponse.json({ ok: true, job });
  } catch (err: any) {
    return new NextResponse(err?.message ?? "Status error", { status: 500 });
  }
}
