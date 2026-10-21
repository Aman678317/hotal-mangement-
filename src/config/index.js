import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_BASE_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().default("postgresql://hostel:hostel_dev_pw@127.0.0.1:5432/hostel_management?pgbouncer=true"),
  SESSION_SECRET: z.string().default("dev_only_secret_change_me_5f2a9c1e7b4d48a6b0e3f7c9d2a4b6e8"),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(720).default(8),
  ALLOW_SELF_REGISTRATION: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  SEED_DEMO_USERS: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  COMPLAINT_REOPEN_WINDOW_HOURS: z.coerce.number().int().min(0).max(24 * 90).default(48),
  CHAT_PROVIDER: z.enum(["local", "openai-compatible"]).default("local"),
  CHAT_PROVIDER_API_KEY: z.string().default(""),
  CHAT_PROVIDER_BASE_URL: z.string().default(""),
  CHAT_PROVIDER_MODEL: z.string().default(""),
});

const parsed = envSchema.safeParse(process.env);

export const config = parsed.success
  ? parsed.data
  : {
      NODE_ENV: "development",
      PORT: 3000,
      APP_BASE_URL: "http://localhost:3000",
      DATABASE_URL: "postgresql://hostel:hostel_dev_pw@127.0.0.1:5432/hostel_management?pgbouncer=true",
      SESSION_SECRET: "dev_only_secret_change_me_5f2a9c1e7b4d48a6b0e3f7c9d2a4b6e8",
      SESSION_TTL_HOURS: 8,
      ALLOW_SELF_REGISTRATION: true,
      SEED_DEMO_USERS: true,
      COMPLAINT_REOPEN_WINDOW_HOURS: 48,
      CHAT_PROVIDER: "local",
      CHAT_PROVIDER_API_KEY: "",
      CHAT_PROVIDER_BASE_URL: "",
      CHAT_PROVIDER_MODEL: "",
    };

export const isProd = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";
