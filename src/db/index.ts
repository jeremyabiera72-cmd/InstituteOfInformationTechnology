import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

export const createPool = () => {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('supabase') || process.env.DATABASE_URL.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      connectionTimeoutMillis: 15000,
    });
  }

  const password = process.env.SQL_PASSWORD;
  return new Pool({
    host: process.env.SQL_HOST || '/run/postgresql',
    port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
    user: process.env.SQL_USER || 'postgres',
    ...(password ? { password } : {}),
    database: process.env.SQL_DB_NAME || 'cs_student_hub',
    connectionTimeoutMillis: 15000,
  });
};

const pool = createPool();

pool.on('error', (err) => {
  console.warn('Unexpected error on idle SQL pool client:', err.message);
});

export const db = drizzle(pool, { schema });
