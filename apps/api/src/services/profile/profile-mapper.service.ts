/**
 * @fileoverview Service for mapping onboarding responses to client profile structure
 */

import { ClientProfile, ClientProfileSchema } from '@alva/shared-types';

/**
 * @description Service for mapping onboarding form responses to structured client profiles
 */
export class ProfileMapperService {
  /**
   * @description Maps onboarding responses to a structured client profile, throwing errors for missing required fields
   * @param responses - Raw onboarding form responses
   * @returns Structured client profile
   * @throws Error if required fields are missing
   */
  mapOnboardingResponses(responses: Record<string, any>): ClientProfile {
    this.validateRequiredFields(responses);
    
    const profile: ClientProfile = {
      user_profile: {
        user_name: responses['user-name'],
        business_name: responses['business-name'],
        description: responses['business-description'],
      },
      brand_identity: {
        vibe_tags: responses['brand-vibe'],
        primary_colors: responses['brand-colors'],
        fonts: responses['brand-fonts'],
        differentiators: responses['differentiators'],
      },
      products_offers: {
        categories: responses['product-categories'],
        special_offers: responses['special-offers'],
        sales_channels: responses['sales-channels'],
        promotional_strategies: responses['promotional-strategies'],
      },
      content_social: {
        online_presence: responses['online-presence'],
        content_types: responses['content-types'],
        creation_preferences: responses['creation-preferences'],
        face_voice_presence: responses['face-voice-presence'],
        competitor_analysis: responses['competitor-analysis'],
        inspiration_accounts: responses['inspiration-accounts'],
      },
      goals_growth: {
        top_goals: responses['top-goals'],
        growth_focus: responses['growth-focus'],
        automation_preferences: responses['automation-preferences'],
        past_successes: responses['past-successes'],
        past_failures: responses['past-failures'],
      },
      constraints_tools: {
        weekly_time_commitment: responses['weekly-time-commitment'],
        marketing_budget: responses['marketing-budget'],
        existing_tools: responses['existing-tools'],
        brand_restrictions: responses['brand-restrictions'],
        additional_context: responses['additional-context'],
      },
    };

    return ClientProfileSchema.parse(profile);
  }

  /**
   * @description Validates that all required onboarding fields are present
   * @param responses - Raw onboarding form responses
   * @throws Error if any required field is missing
   */
  private validateRequiredFields(responses: Record<string, any>): void {
    const requiredFields = [
      'user-name',
      'business-name',
      'business-description',
      'brand-vibe',
      'brand-colors',
      'brand-fonts',
      'differentiators',
      'product-categories',
      'special-offers',
      'sales-channels',
      'promotional-strategies',
      'online-presence',
      'content-types',
      'creation-preferences',
      'face-voice-presence',
      'competitor-analysis',
      'inspiration-accounts',
      'top-goals',
      'growth-focus',
      'automation-preferences',
      'past-successes',
      'past-failures',
      'weekly-time-commitment',
      'marketing-budget',
      'existing-tools',
      'brand-restrictions',
      'additional-context',
    ];

    const missingFields = requiredFields.filter(field => !responses[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required onboarding fields: ${missingFields.join(', ')}`);
    }
  }
}
