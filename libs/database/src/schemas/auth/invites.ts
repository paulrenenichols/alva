/**
 * @fileoverview Database schema definitions for invitation tokens
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  usedBy: uuid('used_by').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

