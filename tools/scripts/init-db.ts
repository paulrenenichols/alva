import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/alva'
});

async function initDatabase() {
  try {
    await client.connect();
    
    // Create schemas
    await client.query('CREATE SCHEMA IF NOT EXISTS auth;');
    await client.query('CREATE SCHEMA IF NOT EXISTS app;');
    
    console.log('Database schemas created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
