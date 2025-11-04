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
    // Parse PostgreSQL connection string manually (more reliable than URL parsing)
    // Format: postgresql://user:password@host:port/database?sslmode=require
    const match = connectionString.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    
    if (match) {
      const [, username, password, host, port, database] = match;
      poolConfig.host = host;
      poolConfig.port = parseInt(port, 10);
      poolConfig.database = database;
      poolConfig.user = decodeURIComponent(username);
      poolConfig.password = decodeURIComponent(password);
      poolConfig.ssl = {
        rejectUnauthorized: false, // RDS uses self-signed certificates, so we don't verify the certificate
      };
    } else {
      // Fallback: try URL parsing (for edge cases)
      try {
        const urlString = connectionString.replace(/^postgresql:\/\//, 'https://');
        const url = new URL(urlString);
        poolConfig.host = url.hostname;
        poolConfig.port = parseInt(url.port || '5432', 10);
        poolConfig.database = url.pathname.slice(1); // Remove leading slash
        poolConfig.user = decodeURIComponent(url.username);
        poolConfig.password = decodeURIComponent(url.password);
        poolConfig.ssl = {
          rejectUnauthorized: false,
        };
      } catch (error) {
        // Last resort: use connectionString but remove sslmode and set ssl
        console.error('[Database] Failed to parse connection string for SSL:', error);
        poolConfig.connectionString = connectionString.replace(/[?&]sslmode=[^&]*/, '');
        poolConfig.ssl = {
          rejectUnauthorized: false,
        };
      }
    }
  } else {
    // No SSL required, use connection string as-is
    poolConfig.connectionString = connectionString;
  }

  const pool = new Pool(poolConfig);

  return drizzle(pool, { schema });
};

export type Database = ReturnType<typeof createDbPool>;
