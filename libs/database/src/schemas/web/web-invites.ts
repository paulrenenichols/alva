/**
 * @fileoverview Database schema definitions for web invites (for inviting to web app)
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { webUsers } from './web-users';
import { adminUsers } from '../admin/admin-users';

export const webInvites = pgTable('web_invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdBy: uuid('created_by').references(() => adminUsers.id, { onDelete: 'set null' }),
  usedBy: uuid('used_by').references(() => webUsers.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

