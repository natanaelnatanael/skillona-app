// lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // spriječi re-instanciranje u devu (Vercel i Next dev hot-reload)
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const db: PrismaClient =
  global.__prisma__ ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = db;
}



