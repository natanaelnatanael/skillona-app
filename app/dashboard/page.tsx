export default function DashboardPage() {
  // Minimalno – bez DB importa (da ne okida opet “prisma is not exported”).
  // Ovdje ćemo kasnije dodati stvarne podatke kad deploy prođe.
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
      <p>Welcome to your dashboard 👋</p>
    </main>
  );
}
