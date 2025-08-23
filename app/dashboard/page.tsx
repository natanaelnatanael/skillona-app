// app/dashboard/page.tsx
import { db } from "@lib/db";

export default async function DashboardPage() {
  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </main>
  );
}


