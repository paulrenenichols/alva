/**
 * @fileoverview Database initialization script for Docker
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const maxAttempts = 30;
const delay = 1000; // 1 second

/**
 * @description Wait for PostgreSQL to be ready
 */
async function waitForPostgres(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/alva';
  
  console.log('Waiting for PostgreSQL to be ready...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const pool = new Pool({ connectionString: dbUrl });
      await pool.query('SELECT 1');
      await pool.end();
      console.log('✅ PostgreSQL is ready!');
      return;
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxAttempts}... waiting...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  console.error('❌ PostgreSQL not ready after 30 attempts');
  process.exit(1);
}

/**
 * @description Run database migrations
 */
async function runMigrations(): Promise<void> {
  console.log('Running database migrations...');
  const { execSync } = require('child_process');
  
  try {
    execSync('pnpm db:migrate', { stdio: 'inherit' });
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * @description Seed the database
 */
async function seedDatabase(): Promise<void> {
  console.log('Seeding database...');
  const { execSync } = require('child_process');
  
  try {
    execSync('pnpm seed:all', { stdio: 'inherit' });
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

/**
 * @description Main initialization function
 */
async function main() {
  try {
    await waitForPostgres();
    await runMigrations();
    await seedDatabase();
    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();

