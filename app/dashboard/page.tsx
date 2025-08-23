import { auth } from "@clerk/nextjs/server";
import { db } from "@lib/db";
import { PLAN_LIMITS, sinceMonthStart } from "@/lib/limits";

export default async function Dashboard() {
  const { userId } = await auth();
  if(!userId) return <main style={{maxWidth:720,margin:"60px auto"}}>Please sign in.</main>;
  let user = await prisma.user.findFirst({ where:{ clerkId:userId }});
  if(!user) user = await prisma.user.create({ data:{ clerkId:userId }});
  const used = await prisma.job.count({ where:{ userId:user.id, createdAt:{ gte: sinceMonthStart() } }});
  const limit = PLAN_LIMITS[(user.plan as keyof typeof PLAN_LIMITS) ?? "free"];
  const jobs = await prisma.job.findMany({ where:{ userId:user.id }, orderBy:{ createdAt:"desc" }, take:20 });
  return (
    <main style={{maxWidth:720,margin:"60px auto",padding:"0 16px"}}>
      <h2 style={{fontSize:26,marginBottom:8}}>Dashboard</h2>
      <p style={{opacity:.8,marginBottom:12}}>Plan: {user.plan} — Usage: {used}/{limit} this month</p>
      {jobs.length===0 ? <p>No jobs yet.</p> :
        <ul>{jobs.map(j=> <li key={j.id} style={{marginBottom:8}}>
          {j.state==="done"?"✅":"⏳"} {j.prompt} — {j.state} {j.url && (<a href={j.url} target="_blank">Download</a>)}
        </li>)}</ul>}
    </main>
  );
}

