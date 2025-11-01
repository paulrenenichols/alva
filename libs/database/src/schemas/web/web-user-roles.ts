/**
 * @fileoverview Database schema definitions for web user roles
 */

import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { webUsers } from './web-users';
import { webRoles } from './web-roles';

export const webUserRoles = pgTable('web_user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  webUserId: uuid('web_user_id')
    .notNull()
    .references(() => webUsers.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => webRoles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

