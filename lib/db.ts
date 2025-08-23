// lib/db.ts
import { PrismaClient } from "@prisma/client";

// držimo jednu instancu u devu (HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

// alias – pa možeš importati i kao "db"
export const db = prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}




