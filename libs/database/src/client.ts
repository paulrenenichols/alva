import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const createDbPool = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return drizzle(pool);
};

export type Database = ReturnType<typeof createDbPool>;
