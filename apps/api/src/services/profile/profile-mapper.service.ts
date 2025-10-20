import { ClientProfile, ClientProfileSchema } from '@alva/shared-types';

export class ProfileMapperService {
  mapOnboardingResponses(responses: Record<string, any>): ClientProfile {
    const profile: ClientProfile = {
      user_profile: {
        user_name: responses['user-name'] || '',
        business_name: responses['business-name'] || '',
        description: responses['business-description'] || '',
      },
      brand_identity: {
        vibe_tags: responses['brand-vibe'] || [],
        primary_colors: responses['brand-colors'] || [],
        fonts: responses['brand-fonts'] || [],
        differentiators: responses['differentiators'] || '',
      },
      products_offers: {
        categories: responses['product-categories'] || [],
        special_offers: responses['special-offers'] || [],
        sales_channels: responses['sales-channels'] || [],
        promotional_strategies: responses['promotional-strategies'] || [],
      },
      content_social: {
        online_presence: responses['online-presence'] || [],
        content_types: responses['content-types'] || [],
        creation_preferences: responses['creation-preferences'] || [],
        face_voice_presence: responses['face-voice-presence'] || [],
        competitor_analysis: responses['competitor-analysis'] || '',
        inspiration_accounts: responses['inspiration-accounts'] || [],
      },
      goals_growth: {
        top_goals: responses['top-goals'] || [],
        growth_focus: responses['growth-focus'] || [],
        automation_preferences: responses['automation-preferences'] || [],
        past_successes: responses['past-successes'] || '',
        past_failures: responses['past-failures'] || '',
      },
      constraints_tools: {
        weekly_time_commitment: responses['weekly-time-commitment'] || '',
        marketing_budget: responses['marketing-budget'] || '',
        existing_tools: responses['existing-tools'] || [],
        brand_restrictions: responses['brand-restrictions'] || [],
        additional_context: responses['additional-context'] || '',
      },
    };

    return ClientProfileSchema.parse(profile);
  }
}
