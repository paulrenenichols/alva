import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function securityPlugin(fastify: FastifyInstance) {
  // Security headers
  fastify.addHook(
    'onSend',
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.header('X-Content-Type-Options', 'nosniff');
      reply.header('X-Frame-Options', 'DENY');
      reply.header('X-XSS-Protection', '1; mode=block');
      reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
      reply.header(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=()'
      );

      if (process.env['NODE_ENV'] === 'production') {
        reply.header(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains'
        );
      }
    }
  );

  // Rate limiting per endpoint
  fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request: any, context: any) => ({
      error: 'Rate limit exceeded',
      statusCode: 429,
      retryAfter: Math.round(context.ttl / 1000),
    }),
  });

  // Input validation middleware
  fastify.addHook(
    'preValidation',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Sanitize input
      if (request.body && typeof request.body === 'object') {
        sanitizeObject(request.body);
      }
    }
  );
}

function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potentially dangerous characters
      obj[key] = obj[key].replace(/[<>]/g, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}
