/**
 * @fileoverview Authentication middleware for validating JWT tokens and user sessions
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { adminUsers, webUsers } from '@alva/database';
import { TokenService } from '../services/token.service';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
    startTime?: number;
    db?: any;
  }
}

// Create a singleton token service instance
const tokenService = new TokenService();

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      request.server.log.debug('No token provided in authorization header');
      return reply.code(401).send({ error: 'Access token required' });
    }

    // Use TokenService to verify token
    const decoded = tokenService.verifyAccessToken(token);
    request.server.log.debug(`Token verified, userType: ${decoded.userType}, userId: ${decoded.userId}`);
    
    // Validate user in appropriate table based on userType
    if (decoded.userType === 'admin') {
      const user = await request.db.query.adminUsers.findFirst({
        where: eq(adminUsers.id, decoded.userId),
      });
      if (!user) {
        request.server.log.warn(`Admin user not found for userId: ${decoded.userId}`);
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'admin' };
      request.server.log.debug(`Admin user authenticated: ${user.email}`);
    } else if (decoded.userType === 'web') {
      const user = await request.db.query.webUsers.findFirst({
        where: eq(webUsers.id, decoded.userId),
      });
      if (!user) {
        request.server.log.warn(`Web user not found for userId: ${decoded.userId}`);
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'web' };
      request.server.log.debug(`Web user authenticated: ${user.email}`);
    } else {
      request.server.log.warn(`Invalid userType in token: ${decoded.userType}`);
      return reply.code(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    request.server.log.error(error, 'Token verification failed');
    return reply.code(403).send({ error: 'Invalid token' });
  }
}
