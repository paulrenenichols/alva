/**
 * @fileoverview Authentication middleware for validating JWT tokens and user sessions
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { users } from '@alva/database';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
    startTime?: number;
    db?: any;
  }
}

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return reply.code(401).send({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    const user = await request.db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    if (!user) {
      return reply.code(401).send({ error: 'Invalid token' });
    }

    request.user = user;
  } catch (error) {
    return reply.code(403).send({ error: 'Invalid token' });
  }
}
