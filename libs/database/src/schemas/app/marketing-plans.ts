/**
 * @fileoverview Database schema definitions for marketing plans
 */

import { pgTable, uuid, jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const marketingPlans = pgTable('marketing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planData: jsonb('plan_data').notNull(),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
