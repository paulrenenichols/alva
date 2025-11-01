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
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  // Check if user has admin role
  const isAdmin = await checkAdminStatus(request, user.id);

  if (!isAdmin) {
    return reply.code(403).send({ error: 'Admin access required' });
  }
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
      return false;
    }

    // Check if user has admin role
    const [userRole] = await db
      .select()
      .from(adminUserRoles)
      .where(and(eq(adminUserRoles.adminUserId, userId), eq(adminUserRoles.roleId, adminRole.id)))
      .limit(1);

    return !!userRole;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

