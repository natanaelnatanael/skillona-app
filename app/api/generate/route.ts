import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const jobId = "job_" + Math.random().toString(36).slice(2);

  (globalThis as any)[jobId] = { state: "processing", url: "" };
  setTimeout(() => {
    (globalThis as any)[jobId] = { state: "done", url: "https://files.skillona.ai/demo-video.mp4" };
  }, 5000);

  return NextResponse.json({ ok: true, jobId, prompt });
}

