import type { Config } from 'drizzle-kit';

export default {
  schema: './libs/database/src/schemas/**/*.ts',
  out: './libs/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/alva'
  }
} satisfies Config;
