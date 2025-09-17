export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@lib/db';

export default async function DashboardPage() {
  // provjeri je li korisnik prijavljen
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const jobs = await db.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
      <pre>{JSON.stringify(jobs, null, 2)}</pre>
    </main>
  );
}
