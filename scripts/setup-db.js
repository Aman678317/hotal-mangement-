/**
 * One-click Supabase / PostgreSQL Setup Script
 *
 * Usage:
 *   node scripts/setup-db.js "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
 * Or:
 *   node scripts/setup-db.js (reads DATABASE_URL from .env)
 */

import "dotenv/config";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const envFile = path.join(rootDir, ".env");

let connectionUrl = process.argv[2] || process.env.DATABASE_URL;

if (!connectionUrl) {
  console.error("\n❌ Error: Please provide your Supabase PostgreSQL connection string.");
  console.log("Usage: node scripts/setup-db.js \"postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres\"\n");
  process.exit(1);
}

// Clean quotes if user copied them
connectionUrl = connectionUrl.trim().replace(/^["']|["']$/g, "");

// Ensure proper pooler flag if using Supabase pooler on port 6543
if (connectionUrl.includes(":6543") && !connectionUrl.includes("pgbouncer=true")) {
  connectionUrl += connectionUrl.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true";
}

console.log("\n=======================================================");
console.log("🚀 Setting up Supabase Database for Hostel Management System");
console.log("=======================================================\n");

// Update or create .env with this connection URL
let envContent = "";
if (fs.existsSync(envFile)) {
  envContent = fs.readFileSync(envFile, "utf8");
}

if (/^DATABASE_URL=/m.test(envContent)) {
  envContent = envContent.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${connectionUrl}"`);
} else {
  envContent += `\nDATABASE_URL="${connectionUrl}"\n`;
}

fs.writeFileSync(envFile, envContent);
console.log("✅ Updated .env with your DATABASE_URL");

// Set environment for subcommands
process.env.DATABASE_URL = connectionUrl;
process.env.SEED_DEMO_USERS = "true";

// 1. Generate Prisma Client
console.log("\n[1/3] Generating Prisma Client...");
try {
  execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir });
  console.log("✅ Prisma Client ready.");
} catch (err) {
  console.error("❌ Failed to generate Prisma client:", err.message);
  process.exit(1);
}

// 2. Deploy Migrations
console.log("\n[2/3] Applying database migrations to Supabase...");
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: rootDir });
  console.log("✅ Migrations applied successfully! Tables created.");
} catch (err) {
  console.error("❌ Migration failed. Check connection string & password:", err.message);
  process.exit(1);
}

// 3. Seed Demo Data
console.log("\n[3/3] Seeding demo users, blocks, rooms, and allocations...");
try {
  execSync("node prisma/seed.js", { stdio: "inherit", cwd: rootDir, env: { ...process.env, SEED_DEMO_USERS: "true" } });
  console.log("✅ Database seeded with demo accounts.");
} catch (err) {
  console.error("⚠️ Seeding notice:", err.message);
}

console.log("\n=======================================================");
console.log("🎉 Database setup complete!");
console.log("All tables created and seeded on Supabase.");
console.log("=======================================================\n");
