import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export default async function Dashboard() {
  const { userId } = await auth();
  const jobs = userId ? await prisma.job.findMany({ where:{ user:{ clerkId: userId } }, orderBy:{ createdAt:"desc" }, take:10 }) : [];
  return (
    <main style={{maxWidth:720,margin:"60px auto",padding:"0 16px"}}>
      <h2 style={{fontSize:26,marginBottom:8}}>Dashboard</h2>
      {!userId && <p>Please sign in.</p>}
      {userId && (
        <div>
          {jobs.length===0 ? <p>No jobs yet.</p> :
            <ul>{jobs.map(j => <li key={j.id} style={{marginBottom:8}}>{j.state==="done" ? "✅" : "⏳"} {j.prompt} — {j.state} {j.url && (<a href={j.url} target="_blank">Download</a>)}</li>)}</ul>}
        </div>
      )}
    </main>
  );
}
