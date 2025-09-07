// app/page.tsx
export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Skillona — AI Viral Video Generator</h1>
      <p style={{ opacity: 0.7 }}>
        Ovo je landing placeholder. Otvori <code>/sign-in</code>, <code>/sign-up</code> ili <code>/dashboard</code>.
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <a href="/sign-in" style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 8, textDecoration: 'none' }}>Sign in</a>
        <a href="/sign-up" style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 8, textDecoration: 'none' }}>Sign up</a>
        <a href="/dashboard" style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 8, textDecoration: 'none' }}>Dashboard</a>
      </div>

      <pre style={{ marginTop: 24, background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
        GET /api/status → provjera backenda
      </pre>
    </main>
  );
}
