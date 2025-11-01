/**
 * @fileoverview Database schema definitions for web app client profiles
 */

import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { webUsers } from './web-users';

export const webClientProfiles = pgTable('web_client_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => webUsers.id, { onDelete: 'cascade' }),
  profileData: jsonb('profile_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

