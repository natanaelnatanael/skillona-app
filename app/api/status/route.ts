import { NextRequest, NextResponse } from "next/server";
import { db } from "@lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const jobId = req.nextUrl.searchParams.get("jobid") ?? "";
    if (!jobId) {
      return new NextResponse("Missing 'jobid' query param", { status: 400 });
    }

    // prilagodi po potrebi: provjeravamo postoji li job s tim ID-em
    const job = await db.job.findUnique({ where: { id: jobId } });

    return NextResponse.json({ exists: !!job });
  } catch (err: any) {
    return new NextResponse(err?.message ?? "Status error", { status: 500 });
  }
}
