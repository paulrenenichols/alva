import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authMiddleware } from './middleware/auth';
import { apiRoutes } from './routes/api';
import { onboardingRoutes } from './routes/onboarding';
import { planRoutes } from './routes/plans';
import { createDbPool } from '@alva/database';

const fastify = Fastify({
  logger: true,
});

export async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin: process.env.WEB_URL || 'http://localhost:4200',
    credentials: true,
  });

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Alva API',
        description: 'API for Alva marketing platform',
        version: '1.0.0',
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Register database
  const db = createDbPool(process.env.DATABASE_URL!);
  fastify.decorate('db', db);

  // Register middleware
  fastify.register(authMiddleware);

  // Register routes
  await fastify.register(apiRoutes, { prefix: '/api' });
  await fastify.register(onboardingRoutes, { prefix: '/onboarding' });
  await fastify.register(planRoutes, { prefix: '/plans' });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'api' };
  });

  return fastify;
}
