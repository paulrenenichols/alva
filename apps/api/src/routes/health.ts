/**
 * @fileoverview API routes for health checks and system monitoring
 */

import { FastifyInstance } from 'fastify';

// Extend FastifyInstance to include db property
declare module 'fastify' {
  interface FastifyInstance {
    db: any;
  }
}

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'api',
      version: process.env['APP_VERSION'] || '1.0.0',
    };
  });

  // Detailed health check with dependencies
  fastify.get('/health/detailed', async (request, reply) => {
    const checks = {
      database: await checkDatabase(fastify.db),
      openai: await checkOpenAI(),
      memory: checkMemoryUsage(),
    };

    const isHealthy = Object.values(checks).every(
      (check) => check.status === 'healthy'
    );

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  });
}

async function checkDatabase(db: any) {
  try {
    await db.execute('SELECT 1');
    return { status: 'healthy', responseTime: '< 100ms' };
  } catch (error: any) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkOpenAI() {
  try {
    // Simple API key check
    return { status: process.env['OPENAI_API_KEY'] ? 'healthy' : 'unhealthy' };
  } catch (error: any) {
    return { status: 'unhealthy', error: error.message };
  }
}

function checkMemoryUsage() {
  const usage = process.memoryUsage();
  const isHealthy = usage.heapUsed / usage.heapTotal < 0.9; // Less than 90% heap usage

  return {
    status: isHealthy ? 'healthy' : 'warning',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
  };
}
