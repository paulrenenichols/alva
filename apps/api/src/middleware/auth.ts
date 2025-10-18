import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7);
      const publicKey = process.env['JWT_PUBLIC_KEY']!;

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
        userId: string;
        email: string;
      };

      request.user = decoded;
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });
}
