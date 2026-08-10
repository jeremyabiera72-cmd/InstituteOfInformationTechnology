import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST || '/run/postgresql';
const sqlDbName = process.env.SQL_DB_NAME || 'cs_student_hub';
const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER || 'postgres';
const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || '';

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: process.env.DATABASE_URL ? {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('supabase') || process.env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  } : {
    host: sqlHost,
    port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
    user: user,
    ...(password ? { password } : {}),
    database: sqlDbName,
    ssl: false,
  },
  verbose: true,
});
