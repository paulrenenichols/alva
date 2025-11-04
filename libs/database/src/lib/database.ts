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
  // Check for SSL mode in connection string
  const sslModeMatch = connectionString.match(/[?&]sslmode=([^&]+)/);
  const sslMode = sslModeMatch ? sslModeMatch[1] : null;
  
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
    // Use URL parsing which properly handles URL-encoded credentials
    try {
      // Replace postgresql:// with https:// for URL parsing (URL constructor doesn't support postgresql://)
      const urlString = connectionString.replace(/^postgresql:\/\//, 'https://');
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
      // Fallback: If URL parsing fails, try to use connectionString with ssl option
      // Note: This may not work if pg Pool ignores ssl when connectionString is provided
      console.error('[Database] Failed to parse connection string for SSL, using fallback:', error);
      poolConfig.connectionString = connectionString.replace(/[?&]sslmode=[^&]*/, '');
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
