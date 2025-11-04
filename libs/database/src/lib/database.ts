/**
 * @fileoverview Database library exports and configuration
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schemas';

/**
 * @description Creates a database connection pool with SSL support
 * Handles both connection strings with sslmode parameter and explicit SSL configuration
 */
export const createDbPool = (connectionString: string) => {
  // Parse connection string to check for SSL mode
  // Convert postgresql:// to https:// temporarily for URL parsing
  const urlString = connectionString.replace(/^postgresql:\/\//, 'https://');
  let sslMode: string | null = null;
  
  try {
    const url = new URL(urlString);
    sslMode = url.searchParams.get('sslmode');
  } catch (error) {
    // Fallback: check for sslmode in connection string manually
    const sslModeMatch = connectionString.match(/[?&]sslmode=([^&]+)/);
    if (sslModeMatch) {
      sslMode = sslModeMatch[1];
    }
  }
  
  // Build pool configuration
  const poolConfig: any = {
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // Explicitly configure SSL if sslmode is require or prefer
  if (sslMode === 'require' || sslMode === 'prefer') {
    poolConfig.ssl = {
      rejectUnauthorized: false, // RDS uses self-signed certificates, so we don't verify the certificate
    };
  }

  const pool = new Pool(poolConfig);

  return drizzle(pool, { schema });
};

export type Database = ReturnType<typeof createDbPool>;
