import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export default async function Admin() {
  const { userId, sessionClaims } = await auth();
  const email = (sessionClaims as any)?.email || "";
  const allow = (process.env.ADMIN_EMAILS||"").split(",").map(s=>s.trim().toLowerCase());
  if(!userId || !allow.includes(email?.toLowerCase())) return <main style={{maxWidth:720,margin:"60px auto"}}>Not allowed.</main>;
  const users = await prisma.user.findMany({ orderBy:{ createdAt:"desc" }, take:50, include:{ StripeCustomer:true }});
  const jobs = await prisma.job.findMany({ orderBy:{ createdAt:"desc" }, take:50 });
  return (
    <main style={{maxWidth:920,margin:"40px auto",padding:"0 16px"}}>
      <h2>Admin</h2>
      <h3>Users</h3>
      <ul>{users.map(u=><li key={u.id}>{u.email || u.clerkId} — plan: {u.plan} — stripe: {u.StripeCustomer?.status||"-"}</li>)}</ul>
      <h3 style={{marginTop:24}}>Jobs</h3>
      <ul>{jobs.map(j=><li key={j.id}>{j.state} — {j.prompt} {j.url && <a href={j.url} target="_blank">Open</a>}</li>)}</ul>
    </main>
  );
}
