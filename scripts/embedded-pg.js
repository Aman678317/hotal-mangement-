import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "prisma", "pgdata");

export async function startEmbeddedPostgres(port = 5432, host = "127.0.0.1") {
  const db = new PGlite(dataDir);
  await db.waitReady;
  
  const server = new PGLiteSocketServer({
    db,
    port,
    host,
    maxConnections: 20,
  });

  try {
    await server.start();
    console.log(`[embedded-pg] PostgreSQL server running on ${host}:${port} (data: ${dataDir})`);
    return { server, db };
  } catch (err) {
    if (err.code === "EADDRINUSE") {
      console.log(`[embedded-pg] Port ${port} is already in use — using existing PostgreSQL instance.`);
      return null;
    }
    throw err;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const instance = await startEmbeddedPostgres();
  console.log("[embedded-pg] Ready for connections.");
}
