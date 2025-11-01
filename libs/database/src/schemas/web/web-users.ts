/**
 * @fileoverview Database schema definitions for web app users
 */

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const webUsers = pgTable('web_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // NULL for magic-link users
  emailVerified: boolean('email_verified').default(false),
  mustResetPassword: boolean('must_reset_password').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

