/**
 * @fileoverview Database schema definitions for admin invites (for inviting to admin app)
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { adminUsers } from './admin-users';

export const adminInvites = pgTable('admin_invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdBy: uuid('created_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  usedBy: uuid('used_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

