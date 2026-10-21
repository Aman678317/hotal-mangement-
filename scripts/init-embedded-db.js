import { startEmbeddedPostgres } from "./embedded-pg.js";
import { execSync } from "node:child_process";

async function run() {
  console.log("[init-db] Starting embedded PostgreSQL server...");
  const instance = await startEmbeddedPostgres();

  try {
    console.log("[init-db] Pushing Prisma schema to embedded PostgreSQL...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    
    console.log("[init-db] Seeding database...");
    execSync("node prisma/seed.js", { stdio: "inherit" });

    console.log("\n[init-db] SUCCESS: Embedded database initialized and seeded!");
  } catch (err) {
    console.error("[init-db] Error:", err.message);
  } finally {
    if (instance?.server) {
      console.log("[init-db] Stopping temporary database server...");
      await instance.server.stop();
    }
  }
}

run();
