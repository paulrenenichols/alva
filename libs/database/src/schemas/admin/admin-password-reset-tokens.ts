/**
 * @fileoverview Database schema definitions for admin password reset tokens
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { adminUsers } from './admin-users';

export const adminPasswordResetTokens = pgTable('admin_password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

