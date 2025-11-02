/**
 * @fileoverview Database schema definitions for admin user roles
 */

import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { adminUsers } from './admin-users';
import { adminRoles } from './admin-roles';

export const adminUserRoles = pgTable('admin_user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => adminRoles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

