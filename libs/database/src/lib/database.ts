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
  // Log connection string info for debugging (mask password)
  const maskedConnectionString = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log('[Database] Creating pool with connection string:', maskedConnectionString);
  
  // Check for SSL mode in connection string
  const sslModeMatch = connectionString.match(/[?&]sslmode=([^&]+)/);
  const sslMode = sslModeMatch ? sslModeMatch[1] : null;
  
  console.log('[Database] SSL mode detected:', {
    sslMode,
    connectionStringPreview: maskedConnectionString.substring(0, 100),
  });
  
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
      // Use URL parsing - convert postgresql:// to https:// temporarily for parsing
      // This handles URL-encoded credentials properly
      const urlString = connectionString.replace(/^postgresql:\/\//, 'https://');
      const url = new URL(urlString);
      
      poolConfig.host = url.hostname;
      poolConfig.port = url.port ? parseInt(url.port, 10) : 5432;
      poolConfig.database = url.pathname.slice(1); // Remove leading slash
      poolConfig.user = url.username ? decodeURIComponent(url.username) : undefined;
      poolConfig.password = url.password ? decodeURIComponent(url.password) : undefined;
      
      // Set SSL configuration for RDS
      // IMPORTANT: Only set individual parameters, NOT connectionString
      // The pg Pool library will ignore ssl if connectionString is also provided
      // RDS uses certificates that may not be in Node.js trust store, so we don't verify
      poolConfig.ssl = {
        rejectUnauthorized: false, // RDS certificates may not be in Node.js trust store
      };
      
      // Log SSL configuration (using console.log for visibility in CloudWatch)
      console.log('[Database] SSL configured for RDS connection', {
        host: poolConfig.host,
        port: poolConfig.port,
        database: poolConfig.database,
        user: poolConfig.user ? poolConfig.user.substring(0, 3) + '***' : 'undefined',
        hasSsl: !!poolConfig.ssl,
        sslMode,
        hasConnectionString: !!poolConfig.connectionString, // Should be false
        sslConfig: {
          rejectUnauthorized: poolConfig.ssl.rejectUnauthorized,
        },
      });
    } catch (error) {
      // If parsing fails, this is a critical error - throw it
      console.error('[Database] CRITICAL: Failed to parse connection string for SSL configuration', {
        error: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        connectionStringPreview: connectionString.substring(0, 50) + '...',
        sslMode,
      });
      throw new Error(`Failed to configure SSL for database connection: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    // No SSL required, use connection string as-is
    poolConfig.connectionString = connectionString;
    console.log('[Database] Using connection string without SSL', {
      hasConnectionString: !!poolConfig.connectionString,
      sslMode,
    });
  }

  const pool = new Pool(poolConfig);

  // Add connection event logging for debugging SSL issues
  pool.on('connect', (client) => {
    console.log('[Database] Client connected', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
  });

  pool.on('error', (err, client) => {
    console.error('[Database] Pool error', {
      error: err.message,
      errorCode: (err as any).code,
      errorStack: err.stack,
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
  });

  console.log('[Database] Pool created successfully', {
    sslMode,
    hasSsl: !!poolConfig.ssl,
    host: poolConfig.host || 'from-connection-string',
  });

  return drizzle(pool, { schema });
};

export type Database = ReturnType<typeof createDbPool>;
