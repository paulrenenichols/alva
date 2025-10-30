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
      : [process.env['WEB_URL'] || DEFAULT_WEB_URL]
    : [];

  console.log('node env', process.env['NODE_ENV']);
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
          if (!origin) return cb(null, true);
          const isAllowed = allowedOrigins.includes(origin);
          if (process.env['NODE_ENV'] === 'development') {
            fastify.log.info({ origin, isAllowed }, 'CORS origin check (auth)');
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
