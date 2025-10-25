/**
 * @fileoverview Mock for onboarding store using Zustand
 */

import { mockOnboardingCard, mockOnboardingResponses } from './pageMocks';

// Mock onboarding card data
const mockOnboardingSections = [
  {
    id: 'business',
    name: 'Business Information',
    cards: [mockOnboardingCard],
  },
];

// Mock onboarding store
export const useOnboardingStore = () => ({
  currentSection: 1,
  currentCard: 1,
  responses: mockOnboardingResponses,
  isCompleted: false,
  startOnboarding: () => {},
  updateResponse: () => {},
  nextCard: () => {},
  prevCard: () => {},
  goToCard: () => {},
  completeOnboarding: () => {},
  clearResponses: () => {},
  getCurrentCard: () => mockOnboardingCard,
  getCurrentSection: () => mockOnboardingSections[0],
  getProgress: () => ({ current: 1, total: 26, percentage: 3.8 }),
});

// Mock the getState method for direct access
export const useOnboardingStoreGetState = () => ({
  goToCard: () => {},
  getCurrentCard: () => mockOnboardingCard,
  getCurrentSection: () => mockOnboardingSections[0],
  getProgress: () => ({ current: 1, total: 26, percentage: 3.8 }),
});

// Add getState to the hook for compatibility
useOnboardingStore.getState = useOnboardingStoreGetState;
