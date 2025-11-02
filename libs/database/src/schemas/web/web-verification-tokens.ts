/**
 * @fileoverview Database schema definitions for web verification tokens
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { webUsers } from './web-users';

export const webVerificationTokens = pgTable('web_verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  webUserId: uuid('web_user_id')
    .notNull()
    .references(() => webUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

