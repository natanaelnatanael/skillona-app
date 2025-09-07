// Server Component (default in /app)
import { prisma } from "@lib/db";

export default async function DashboardPage() {
  // Uzmi zadnjih 10 poslova (prilagodi po želji)
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Dashboard
      </h1>

      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12 }}>
          {jobs.map((j) => (
            <li
              key={j.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 600 }}>{j.title ?? j.id}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {j.createdAt?.toISOString?.() ?? ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
