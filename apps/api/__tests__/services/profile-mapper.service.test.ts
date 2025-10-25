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
      'business-name': 'Test Business',
      'business-description': 'A test business',
      'brand-vibe': ['Professional', 'Modern'],
      'top-goals': ['Increase Sales', 'Brand Awareness'],
      'weekly-time-commitment': '10',
      'marketing-budget': '1000',
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

  it('handles missing responses gracefully', () => {
    const responses = {};

    const profile = service.mapOnboardingResponses(responses);

    expect(profile.user_profile.business_name).toBe('');
    expect(profile.brand_identity.vibe_tags).toEqual([]);
    expect(profile.goals_growth.top_goals).toEqual([]);
  });
});
