import { PrismaClient } from "@prisma/client";

// Single shared Prisma instance — reuse across the app.
// In development, attach to globalThis to survive hot-reloads.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export all Prisma generated types so consumers only need @repo/database
export * from "@prisma/client";
