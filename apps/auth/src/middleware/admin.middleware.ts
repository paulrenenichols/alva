/**
 * @fileoverview Middleware to require admin role for protected routes
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { adminUserRoles, adminRoles } from '@alva/database';
import { eq, and } from 'drizzle-orm';

// Uses the user property declared in auth.middleware

/**
 * @description Middleware to require admin role
 * Assumes user authentication has already been verified
 */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user;

  if (!user || user.userType !== 'admin') {
    request.server.log.info(`Admin access denied: ${!user ? 'no user' : `wrong userType: ${user.userType}`}`);
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  // Check if user has admin role
  const isAdmin = await checkAdminStatus(request, user.id);

  if (!isAdmin) {
    request.server.log.info(`Admin role check failed for user ${user.id} (${user.email})`);
    return reply.code(403).send({ error: 'Admin access required' });
  }

  request.server.log.info(`Admin access granted for user ${user.id} (${user.email})`);
}

/**
 * @description Checks if a user has admin role
 * @param userId - User ID to check
 * @returns True if user has admin role
 */
async function checkAdminStatus(request: FastifyRequest, userId: string): Promise<boolean> {
  try {
    const db = request.server.db;
    // Get admin role
    const [adminRole] = await db.select().from(adminRoles).where(eq(adminRoles.name, 'admin')).limit(1);

    if (!adminRole) {
      request.server.log.warn('Admin role not found in database');
      return false;
    }

    // Check if user has admin role
    const [userRole] = await db
      .select()
      .from(adminUserRoles)
      .where(and(eq(adminUserRoles.adminUserId, userId), eq(adminUserRoles.roleId, adminRole.id)))
      .limit(1);

    if (!userRole) {
      request.server.log.debug(`No admin role found for user ${userId}`);
    }

    return !!userRole;
  } catch (error) {
    request.server.log.error('Error checking admin status:', error);
    return false;
  }
}

