// lib/db.ts
import { PrismaClient } from "@prisma/client";

// Jedna jedina instanca kroz cijeli runtime (bitno za dev i serverless)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

// ✅ Kompatibilni alias — ako negdje postoji `import { prisma } from "@lib/db"`
export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;






