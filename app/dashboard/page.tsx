export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Server Component (default in /app)
import { db } from "@lib/db";

export default async function DashboardPage() {
  // Uzmi zadnjih 10 poslova (prilagodi po želji)
  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </main>
  );
}
