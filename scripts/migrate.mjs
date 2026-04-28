import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL není nastavený.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });
const db = drizzle(pool);

console.log("[migrate] applying migrations…");
try {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("[migrate] done.");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
