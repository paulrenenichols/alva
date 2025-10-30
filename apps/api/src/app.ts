/**
 * @fileoverview Fastify application builder for API service
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authMiddleware } from './middleware/auth';
import { monitoringPlugin } from './middleware/monitoring';
import { securityPlugin } from './middleware/security';
import { apiRoutes } from './routes/api';
import { onboardingRoutes } from './routes/onboarding';
import { planRoutes } from './routes/plans';
import { healthRoutes } from './routes/health';
import { createDbPool } from '@alva/database';

const DEFAULT_WEB_URL = 'http://localhost:4200';
const DEFAULT_API_HOST = 'localhost:3001';
const DEFAULT_API_SCHEMES = ['http'];

const fastify = Fastify({
  logger: true,
});

/**
 * @description Builds and configures the Fastify application for API service
 * @returns Configured Fastify instance
 */
export async function buildApp() {
  await registerPlugins();
  await registerDatabase();
  await registerMiddleware();
  await registerRoutes();

  return fastify;
}

/**
 * @description Registers all required plugins for the application
 */
async function registerPlugins(): Promise<void> {
  const corsOriginsEnv = process.env['CORS_ORIGINS'];
  const allowedOrigins = corsOriginsEnv
    ? corsOriginsEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : [process.env['WEB_URL'] || DEFAULT_WEB_URL];

  await fastify.register(cors, {
    origin: allowedOrigins,
    credentials: true,
  });

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Alva API',
        description: 'API for Alva marketing platform',
        version: '1.0.0',
      },
      host: DEFAULT_API_HOST,
      schemes: DEFAULT_API_SCHEMES,
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
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
 * @description Registers all middleware
 */
async function registerMiddleware(): Promise<void> {
  await fastify.register(monitoringPlugin);
  await fastify.register(securityPlugin);
  fastify.register(authMiddleware);
}

/**
 * @description Registers all application routes
 */
async function registerRoutes(): Promise<void> {
  await fastify.register(apiRoutes, { prefix: '/api' });
  await fastify.register(onboardingRoutes, { prefix: '/onboarding' });
  await fastify.register(planRoutes, { prefix: '/plans' });
  await fastify.register(healthRoutes);
}
