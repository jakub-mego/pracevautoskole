import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

export default {
  schema: "./drizzle/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
} satisfies Config;
