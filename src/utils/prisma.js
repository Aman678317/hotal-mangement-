import { PrismaClient } from "@prisma/client";

let _prismaInstance = null;

export function getPrismaClient() {
  if (!_prismaInstance) {
    try {
      _prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    } catch (err) {
      console.warn("[prisma] Could not initialize PrismaClient:", err.message);
      // Fallback dummy object so property lookups do not crash module loading
      return new Proxy({}, {
        get() {
          return () => Promise.reject(new Error("Database not connected."));
        }
      });
    }
  }
  return _prismaInstance;
}

// Lazy proxy so importing prisma never crashes during deployment/cold-start
export const prisma = new Proxy({}, {
  get(target, prop) {
    const client = getPrismaClient();
    const val = client[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  }
});

/** Fail fast at startup if the database is unreachable. */
export async function assertDatabaseReachable() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
  } catch (err) {
    console.error("\n[database] Cannot reach PostgreSQL at the configured DATABASE_URL.");
    console.error(`[database] Reason: ${err.message}`);
    console.error("[database] Start PostgreSQL, check DATABASE_URL in .env, and retry.");
    console.error("[database] The app will NOT fall back to fake in-memory data.\n");
    throw err;
  }
}
