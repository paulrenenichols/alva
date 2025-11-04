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
  // When SSL is required, we need to parse the connection string and pass individual options
  // because pg Pool doesn't properly handle sslmode in connectionString when ssl option is also provided
  const poolConfig: any = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // If SSL is required, parse connection string and use individual parameters
  if (sslMode === 'require' || sslMode === 'prefer') {
    try {
      const url = new URL(urlString);
      poolConfig.host = url.hostname;
      poolConfig.port = parseInt(url.port || '5432', 10);
      poolConfig.database = url.pathname.slice(1); // Remove leading slash
      poolConfig.user = decodeURIComponent(url.username);
      poolConfig.password = decodeURIComponent(url.password);
      poolConfig.ssl = {
        rejectUnauthorized: false, // RDS uses self-signed certificates, so we don't verify the certificate
      };
    } catch (error) {
      // Fallback: use connectionString but explicitly set ssl
      // This might not work, but it's better than nothing
      poolConfig.connectionString = connectionString.replace(/[?&]sslmode=[^&]*/, ''); // Remove sslmode from string
      poolConfig.ssl = {
        rejectUnauthorized: false,
      };
    }
  } else {
    // No SSL required, use connection string as-is
    poolConfig.connectionString = connectionString;
  }

  const pool = new Pool(poolConfig);

  return drizzle(pool, { schema });
};

export type Database = ReturnType<typeof createDbPool>;
