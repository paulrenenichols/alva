/**
 * @fileoverview Database schema definitions for web app marketing plans
 */

import { pgTable, uuid, jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';
import { webUsers } from './web-users';

export const webMarketingPlans = pgTable('web_marketing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => webUsers.id, { onDelete: 'cascade' }),
  planData: jsonb('plan_data').notNull(),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

