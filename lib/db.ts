// lib/db.ts
import { PrismaClient } from "@prisma/client";

// Uvijek koristi samo jednu instancu u developmentu!
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };




