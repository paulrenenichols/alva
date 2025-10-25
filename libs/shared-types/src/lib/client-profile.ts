/**
 * @fileoverview Shared types and interfaces for client profiles
 */

import { z } from 'zod';

export const ClientProfileSchema = z.object({
  user_profile: z.object({
    user_name: z.string(),
    business_name: z.string(),
    description: z.string(),
  }),
  brand_identity: z.object({
    vibe_tags: z.array(z.string()),
    primary_colors: z.array(z.string()),
    fonts: z.array(z.string()),
    differentiators: z.string(),
  }),
  products_offers: z.object({
    categories: z.array(z.string()),
    special_offers: z.array(z.string()),
    sales_channels: z.array(z.string()),
    promotional_strategies: z.array(z.string()),
  }),
  content_social: z.object({
    online_presence: z.array(z.string()),
    content_types: z.array(z.string()),
    creation_preferences: z.array(z.string()),
    face_voice_presence: z.array(z.string()),
    competitor_analysis: z.string(),
    inspiration_accounts: z.array(z.string()),
  }),
  goals_growth: z.object({
    top_goals: z.array(z.string()),
    growth_focus: z.array(z.string()),
    automation_preferences: z.array(z.string()),
    past_successes: z.string(),
    past_failures: z.string(),
  }),
  constraints_tools: z.object({
    weekly_time_commitment: z.string(),
    marketing_budget: z.string(),
    existing_tools: z.array(z.string()),
    brand_restrictions: z.array(z.string()),
    additional_context: z.string(),
  }),
});

export type ClientProfile = z.infer<typeof ClientProfileSchema>;
