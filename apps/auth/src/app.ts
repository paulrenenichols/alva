/**
 * @fileoverview Fastify application builder for authentication service
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { adminRoutes } from './routes/admin';
import { createDbPool } from '@alva/database';

const DEFAULT_WEB_URL = 'http://localhost:4200';
const DEFAULT_COOKIE_SECRET = 'your-secret-key';
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RATE_LIMIT_WINDOW = '1 minute';

const fastify = Fastify({
  logger: true,
});

/**
 * @description Builds and configures the Fastify application for authentication service
 * @returns Configured Fastify instance
 */
export async function buildApp() {
  await registerPlugins();
  await registerDatabase();
  await registerRoutes();
  await registerHealthCheck();

  // After registering routes, ensure Fastify is ready and print all routes for diagnostics
  await fastify.ready();
  fastify.printRoutes();

  return fastify;
}

/**
 * @description Normalizes a URL for CORS origin matching (removes trailing slashes, normalizes protocol)
 * @param url - URL string to normalize
 * @returns Normalized URL string
 */
function normalizeOrigin(url: string): string {
  if (!url) return '';
  // Remove trailing slashes
  let normalized = url.trim().replace(/\/+$/, '');
  // Ensure protocol is present
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `http://${normalized}`;
  }
  // Normalize http://localhost:80 -> http://localhost, https://localhost:443 -> https://localhost
  normalized = normalized.replace(/:80$/, '');
  normalized = normalized.replace(/:443$/, '');
  return normalized;
}

/**
 * @description Checks if an origin is allowed by comparing against normalized allowed origins
 * @param origin - Origin to check
 * @param allowedOrigins - Array of allowed origin strings
 * @returns True if origin is allowed, false otherwise
 */
function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (!origin || allowedOrigins.length === 0) return false;

  const normalizedOrigin = normalizeOrigin(origin);

  // Check exact match
  if (
    allowedOrigins.some(
      (allowed) => normalizeOrigin(allowed) === normalizedOrigin
    )
  ) {
    return true;
  }

  // Check without protocol (for flexibility)
  const originWithoutProtocol = normalizedOrigin.replace(/^https?:\/\//, '');
  return allowedOrigins.some((allowed) => {
    const normalizedAllowed = normalizeOrigin(allowed);
    return (
      normalizedAllowed.replace(/^https?:\/\//, '') === originWithoutProtocol
    );
  });
}

/**
 * @description Registers all required plugins for the application
 */
async function registerPlugins(): Promise<void> {
  const corsOriginsEnv = process.env['CORS_ORIGINS'];
  const allowAll = corsOriginsEnv === '*';
  const allowedOrigins = !allowAll
    ? corsOriginsEnv
      ? corsOriginsEnv
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean)
          .map(normalizeOrigin)
      : [normalizeOrigin(process.env['WEB_URL'] || DEFAULT_WEB_URL)]
    : [];

  // Development diagnostics for CORS
  if (process.env['NODE_ENV'] === 'development') {
    fastify.log.info(
      { allowAll, allowedOrigins, corsOriginsEnv },
      'CORS configuration (auth)'
    );
  }

  await fastify.register(cors, {
    origin: allowAll
      ? true
      : (origin, cb) => {
          // Allow requests with no origin (same-origin requests, mobile apps, etc.)
          if (!origin) {
            if (process.env['NODE_ENV'] === 'development') {
              fastify.log.info(
                { origin: 'null', allowed: true },
                'CORS origin check (auth) - no origin'
              );
            }
            return cb(null, true);
          }

          const isAllowed = isOriginAllowed(origin, allowedOrigins);

          if (process.env['NODE_ENV'] === 'development') {
            fastify.log.info(
              {
                origin,
                normalizedOrigin: normalizeOrigin(origin),
                isAllowed,
                allowedOrigins,
              },
              'CORS origin check (auth)'
            );
          }

          if (!isAllowed) {
            fastify.log.warn(
              { origin, allowedOrigins },
              'CORS blocked origin (auth)'
            );
          }

          cb(null, isAllowed);
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  await fastify.register(cookie, {
    secret: process.env['COOKIE_SECRET'] || DEFAULT_COOKIE_SECRET,
  });

  await fastify.register(rateLimit, {
    max: DEFAULT_RATE_LIMIT_MAX,
    timeWindow: DEFAULT_RATE_LIMIT_WINDOW,
  });
}

/**
 * @description Registers database connection
 */
async function registerDatabase(): Promise<void> {
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const db = createDbPool(databaseUrl);
  fastify.decorate('db', db);
}

/**
 * @description Registers all application routes
 */
async function registerRoutes(): Promise<void> {
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(adminRoutes);
}

/**
 * @description Registers health check endpoint
 */
async function registerHealthCheck(): Promise<void> {
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'auth' };
  });
}
