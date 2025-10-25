/**
 * @fileoverview Monitoring middleware plugin for API server performance tracking and logging
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { performance } from 'perf_hooks';

// Extend FastifyRequest to include startTime
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}

export async function monitoringPlugin(fastify: FastifyInstance) {
  // Request timing middleware
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.startTime = performance.now();
  });

  fastify.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const duration = performance.now() - (request.startTime || 0);

      // Log request metrics
      fastify.log.info(
        {
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          duration: Math.round(duration),
          userAgent: request.headers['user-agent'],
        },
        'Request completed'
      );

      // Add performance headers
      reply.header('X-Response-Time', `${Math.round(duration)}ms`);
    }
  );

  // Error tracking middleware
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(
      {
        error: error.message,
        stack: error.stack,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
      },
      'Request error'
    );

    reply.code(500).send({
      error: 'Internal server error',
      requestId: request.id,
    });
  });
}
