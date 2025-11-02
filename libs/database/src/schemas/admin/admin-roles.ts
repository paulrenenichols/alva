/**
 * @fileoverview Database schema definitions for admin roles
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

