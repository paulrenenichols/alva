import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { createDbPool } from '@alva/database';

const fastify = Fastify({
  logger: true
});

export async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin: process.env['WEB_URL'] || 'http://localhost:4200',
    credentials: true
  });

  await fastify.register(cookie, {
    secret: process.env['COOKIE_SECRET'] || 'your-secret-key'
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // Register database
  const db = createDbPool(process.env['DATABASE_URL']!);
  fastify.decorate('db', db);

  // Register routes
  await fastify.register(authRoutes, { prefix: '/auth' });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'auth' };
  });

  return fastify;
}
