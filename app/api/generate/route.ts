import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  // TODO: ovdje kasnije zovemo OpenAI/ElevenLabs/Runway/Veed
  const jobId = "job_" + Math.random().toString(36).slice(2);
  // fake queue: spremimo u memory (na Vercelu dovoljan je mock)
  globalThis[(jobId as any)] = { state: "processing", url: "" };
  setTimeout(() => { (globalThis as any)[jobId] = { state: "done", url: "https://files.skillona.ai/demo-video.mp4" }; }, 5000);
  return NextResponse.json({ ok: true, jobId, prompt });
}
