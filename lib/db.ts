import { PrismaClient } from "@prisma/client";

declare global {
  // spriječi re-instanciranje u devu
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma =
  // @ts-ignore
  global.prisma || new PrismaClient();

// @ts-ignore
if (process.env.NODE_ENV !== "production") global.prisma = prisma;


