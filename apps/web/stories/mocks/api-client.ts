/**
 * @fileoverview Mock for @alva/api-client module
 */

import { mockApiResponses } from '../mocks/pageMocks';

export const apiClient = {
  getUserPlans: mockApiResponses.getUserPlans,
  generatePlan: mockApiResponses.generatePlan,
  saveOnboardingData: mockApiResponses.saveOnboardingData,
  getQuickWins: mockApiResponses.getQuickWins,
  getTasks: mockApiResponses.getTasks,
  getModules: mockApiResponses.getModules,
};
