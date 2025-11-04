/**
 * @fileoverview Database library exports and configuration
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schemas';

/**
 * @description Creates a database connection pool with SSL support
 * Handles both connection strings with sslmode parameter and explicit SSL configuration
 * 
 * Note: When SSL is required, we must parse the connection string into individual parameters
 * because the pg Pool library ignores the ssl option when connectionString is also provided.
 */
export const createDbPool = (connectionString: string) => {
  // Check for SSL mode in connection string
  const sslModeMatch = connectionString.match(/[?&]sslmode=([^&]+)/);
  const sslMode = sslModeMatch ? sslModeMatch[1] : null;
  
  // Build base pool configuration
  const poolConfig: any = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // If SSL is required, parse connection string and use individual parameters
  // This is necessary because pg Pool ignores ssl option when connectionString is provided
  if (sslMode === 'require' || sslMode === 'prefer') {
    try {
      // Parse PostgreSQL connection string manually (more reliable than URL constructor)
      // Format: postgresql://user:password@host:port/database?params
      const match = connectionString.match(/^postgresql:\/\/(?:([^:@]+)(?::([^@]+))?@)?([^:\/]+)(?::(\d+))?\/([^?]+)(?:\?(.+))?$/);
      
      if (!match) {
        throw new Error('Invalid PostgreSQL connection string format');
      }
      
      const [, username, password, host, port, database, queryString] = match;
      
      // Parse query string to get additional parameters
      const params = new URLSearchParams(queryString || '');
      
      poolConfig.host = host;
      poolConfig.port = port ? parseInt(port, 10) : 5432;
      poolConfig.database = database;
      poolConfig.user = username ? decodeURIComponent(username) : undefined;
      poolConfig.password = password ? decodeURIComponent(password) : undefined;
      
      // Set SSL configuration
      poolConfig.ssl = {
        rejectUnauthorized: false, // RDS uses self-signed certificates, so we don't verify the certificate
      };
      
      // Log SSL configuration (using console.log for visibility in CloudWatch)
      console.log('[Database] SSL configured for RDS connection', {
        host: poolConfig.host,
        port: poolConfig.port,
        database: poolConfig.database,
        user: poolConfig.user ? poolConfig.user.substring(0, 3) + '***' : 'undefined',
        hasSsl: !!poolConfig.ssl,
        sslMode,
      });
    } catch (error) {
      // If parsing fails, this is a critical error - throw it
      console.error('[Database] CRITICAL: Failed to parse connection string for SSL configuration', {
        error: error instanceof Error ? error.message : String(error),
        connectionStringPreview: connectionString.substring(0, 50) + '...',
      });
      throw new Error(`Failed to configure SSL for database connection: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // No SSL required, use connection string as-is
    poolConfig.connectionString = connectionString;
    console.log('[Database] Using connection string without SSL');
  }

  const pool = new Pool(poolConfig);

  return drizzle(pool, { schema });
};

export type Database = ReturnType<typeof createDbPool>;
