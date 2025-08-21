import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const users = await prisma.user.count();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-4">Users: {users}</p>
    </main>
  );
}

