import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();
// ✅ alias da radi i stari import: `import { prisma } from "@lib/db"`
export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;






