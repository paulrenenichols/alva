/**
 * @fileoverview Unit tests for ProfileMapperService
 */

import { ProfileMapperService } from '../../src/services/profile/profile-mapper.service';
import { ClientProfile } from '@alva/shared-types';

describe('ProfileMapperService', () => {
  let service: ProfileMapperService;

  beforeEach(() => {
    service = new ProfileMapperService();
  });

  it('maps onboarding responses to client profile', () => {
    const responses = {
      'user-name': 'Test User',
      'business-name': 'Test Business',
      'business-description': 'A test business',
      'brand-vibe': ['Professional', 'Modern'],
      'brand-colors': ['#FFD701', '#007BFF'],
      'brand-fonts': ['Inter', 'Arial'],
      'differentiators': 'Quality and exceptional service',
      'product-categories': ['Software', 'Services'],
      'special-offers': ['Free trial', 'Discount'],
      'sales-channels': ['Online', 'Retail'],
      'promotional-strategies': ['Social media', 'Email'],
      'online-presence': ['Website', 'Social media'],
      'content-types': ['Blog posts', 'Videos'],
      'creation-preferences': ['In-house', 'Agency'],
      'face-voice-presence': ['CEO', 'Team'],
      'competitor-analysis': 'Competitor A and Competitor B analysis',
      'inspiration-accounts': ['@example1', '@example2'],
      'top-goals': ['Increase Sales', 'Brand Awareness'],
      'growth-focus': ['Customer acquisition', 'Retention'],
      'automation-preferences': ['Email marketing', 'Social posting'],
      'past-successes': 'Campaign A and Campaign B were successful',
      'past-failures': 'Campaign C and Campaign D failed due to poor targeting',
      'weekly-time-commitment': '10',
      'marketing-budget': '1000',
      'existing-tools': ['Tool A', 'Tool B'],
      'brand-restrictions': ['No profanity', 'Professional tone'],
      'additional-context': 'Additional context here',
    };

    const profile = service.mapOnboardingResponses(responses);

    expect(profile.user_profile.business_name).toBe('Test Business');
    expect(profile.user_profile.description).toBe('A test business');
    expect(profile.brand_identity.vibe_tags).toEqual([
      'Professional',
      'Modern',
    ]);
    expect(profile.goals_growth.top_goals).toEqual([
      'Increase Sales',
      'Brand Awareness',
    ]);
    expect(profile.constraints_tools.weekly_time_commitment).toBe('10');
    expect(profile.constraints_tools.marketing_budget).toBe('1000');
  });

  it('throws error when required fields are missing', () => {
    const responses = {};

    expect(() => {
      service.mapOnboardingResponses(responses);
    }).toThrow('Missing required onboarding fields:');
  });

  it('throws error when some required fields are missing', () => {
    const responses = {
      'business-name': 'Test Business',
      'business-description': 'A test business',
      // Missing many required fields
    };

    expect(() => {
      service.mapOnboardingResponses(responses);
    }).toThrow('Missing required onboarding fields:');
  });
});
