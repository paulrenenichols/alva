/**
 * @fileoverview Middleware to require admin role for protected routes
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@alva/database';
import { userRoles, roles } from '@alva/database/schemas';
import { eq, and } from 'drizzle-orm';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  }
}

/**
 * @description Middleware to require admin role
 * Assumes user authentication has already been verified
 */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user;

  if (!user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  // Check if user has admin role
  const isAdmin = await checkAdminStatus(user.id);

  if (!isAdmin) {
    return reply.code(403).send({ error: 'Admin access required' });
  }
}

/**
 * @description Checks if a user has admin role
 * @param userId - User ID to check
 * @returns True if user has admin role
 */
async function checkAdminStatus(userId: string): Promise<boolean> {
  try {
    // Get admin role
    const [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin')).limit(1);

    if (!adminRole) {
      return false;
    }

    // Check if user has admin role
    const [userRole] = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, adminRole.id)))
      .limit(1);

    return !!userRole;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

