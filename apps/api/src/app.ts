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
  if (allowedOrigins.some(allowed => normalizeOrigin(allowed) === normalizedOrigin)) {
    return true;
  }
  
  // Check without protocol (for flexibility)
  const originWithoutProtocol = normalizedOrigin.replace(/^https?:\/\//, '');
  return allowedOrigins.some(allowed => {
    const normalizedAllowed = normalizeOrigin(allowed);
    return normalizedAllowed.replace(/^https?:\/\//, '') === originWithoutProtocol;
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
      'CORS configuration (api)'
    );
  }

  await fastify.register(cors, {
    origin: allowAll
      ? true
      : (origin, cb) => {
          // Allow requests with no origin (same-origin requests, mobile apps, etc.)
          if (!origin) {
            if (process.env['NODE_ENV'] === 'development') {
              fastify.log.info({ origin: 'null', allowed: true }, 'CORS origin check (api) - no origin');
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
                allowedOrigins 
              }, 
              'CORS origin check (api)'
            );
          }
          
          if (!isAllowed) {
            fastify.log.warn({ origin, allowedOrigins }, 'CORS blocked origin (api)');
          }
          
          cb(null, isAllowed);
        },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
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
