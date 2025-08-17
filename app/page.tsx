"use client";
import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  async function submit() {
    if (!prompt.trim()) { setStatus("Please enter a topic."); return; }
    setStatus("Submitting...");
    const r = await fetch("/api/generate", { method: "POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ prompt }) });
    const { jobId } = await r.json();
    setJobId(jobId);
    setStatus("Processing...");
    const iv = setInterval(async () => {
      const s = await fetch(`/api/status?jobId=${jobId}`).then(r=>r.json());
      if (s.state === "done") { setStatus(`Ready → ${s.url}`); clearInterval(iv); }
      if (s.state === "error") { setStatus("Error. Please try again."); clearInterval(iv); }
    }, 2000);
  }

  return (
    <main style={{maxWidth:720,margin:"60px auto",padding:"0 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:34}}>AI Viral Video Generator</h1>
        <div>{/* auth */}
          <SignedIn><UserButton /></SignedIn>
          <SignedOut><Link href="/sign-in">Sign in</Link></SignedOut>
        </div>
      </div>
      <p style={{opacity:.8,marginBottom:18}}>Enter a topic or niche. You’ll get a demo link while AI services are wiring.</p>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g., Real estate tips" style={{width:"100%",minHeight:120,background:"#12121a",border:"1px solid #2a2a3d",borderRadius:12,padding:12,color:"#fff"}}/>
      <div style={{display:"flex",gap:12,marginTop:12,alignItems:"center"}}>
        <button onClick={submit} style={{padding:"12px 16px",borderRadius:12,border:"1px solid #6ee7b7",background:"#6ee7b7",fontWeight:700}}>Generate</button>
        <span style={{opacity:.8}}>{status}</span>
      </div>
      {jobId && <div style={{marginTop:12,opacity:.8,fontSize:14}}>Job ID: {jobId}</div>}
      <div style={{marginTop:28,display:"flex",gap:16}}>
        <Link href="/pricing">Pricing →</Link>
        <Link href="/dashboard">Dashboard →</Link>
      </div>
    </main>
  );
}


