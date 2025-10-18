import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  profileData: jsonb('profile_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'app'
});