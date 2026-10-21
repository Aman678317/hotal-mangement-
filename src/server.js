import { createApp, config } from "./app.js";
import { assertDatabaseReachable, prisma } from "./utils/prisma.js";
import { startEmbeddedPostgres } from "../scripts/embedded-pg.js";

async function main() {
  let embeddedInstance = null;
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
  } catch {
    console.log("[database] PostgreSQL not active on 5432 — booting embedded PostgreSQL engine...");
    embeddedInstance = await startEmbeddedPostgres();
  }

  await assertDatabaseReachable();
  console.log("[database] PostgreSQL connection verified.");

  const app = createApp();
  const server = app.listen(config.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Hostel Management System LIVE at ${config.APP_BASE_URL}`);
    console.log(`👉 Student Dashboard : ${config.APP_BASE_URL}/student/dashboard`);
    console.log(`👉 Warden Dashboard  : ${config.APP_BASE_URL}/warden/dashboard`);
    console.log(`👉 Admin Dashboard   : ${config.APP_BASE_URL}/admin/dashboard`);
    console.log(`👉 Login Page        : ${config.APP_BASE_URL}/login`);
    console.log(`======================================================\n`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      if (embeddedInstance?.server) {
        await embeddedInstance.server.stop();
      }
      process.exit(0);
    });
    // Force-exit if connections hang
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

if (process.env.VERCEL !== "1") {
  main().catch((err) => {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  });
}
