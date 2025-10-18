import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as authSchema from '../schemas/auth';
import * as appSchema from '../schemas/app';

export const createDbPool = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return drizzle(pool, { 
    schema: { ...authSchema, ...appSchema } 
  });
};

export type Database = ReturnType<typeof createDbPool>;
export * from '../schemas/auth';
export * from '../schemas/app';
