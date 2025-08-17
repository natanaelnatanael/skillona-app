import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId") || "";
  const data = (globalThis as any)[jobId] || { state: "processing", url: "" };
  return NextResponse.json(data);
}
