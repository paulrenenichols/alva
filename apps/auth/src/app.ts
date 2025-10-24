/**
 * @fileoverview Fastify application builder for authentication service
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { createDbPool } from '@alva/database';

const DEFAULT_WEB_URL = 'http://localhost:4200';
const DEFAULT_COOKIE_SECRET = 'your-secret-key';
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RATE_LIMIT_WINDOW = '1 minute';

const fastify = Fastify({
  logger: true
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

  return fastify;
}

/**
 * @description Registers all required plugins for the application
 */
async function registerPlugins(): Promise<void> {
  await fastify.register(cors, {
    origin: process.env['WEB_URL'] || DEFAULT_WEB_URL,
    credentials: true
  });

  await fastify.register(cookie, {
    secret: process.env['COOKIE_SECRET'] || DEFAULT_COOKIE_SECRET
  });

  await fastify.register(rateLimit, {
    max: DEFAULT_RATE_LIMIT_MAX,
    timeWindow: DEFAULT_RATE_LIMIT_WINDOW
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
}

/**
 * @description Registers health check endpoint
 */
async function registerHealthCheck(): Promise<void> {
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'auth' };
  });
}
