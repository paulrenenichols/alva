/**
 * @fileoverview Authentication middleware for validating JWT tokens and user sessions
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { adminUsers, webUsers } from '@alva/database';

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
    
    // Validate user in appropriate table based on userType
    if (decoded.userType === 'admin') {
      const user = await request.db.query.adminUsers.findFirst({
        where: eq(adminUsers.id, decoded.userId),
      });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'admin' };
    } else if (decoded.userType === 'web') {
      const user = await request.db.query.webUsers.findFirst({
        where: eq(webUsers.id, decoded.userId),
      });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'web' };
    } else {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    return reply.code(403).send({ error: 'Invalid token' });
  }
}
