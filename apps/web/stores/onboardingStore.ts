/**
 * @fileoverview Onboarding state management using Zustand with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onboardingSections, totalCards } from '@/data/onboarding-cards';

interface OnboardingState {
  currentSection: number;
  currentCard: number;
  responses: Record<string, any>;
  isCompleted: boolean;
  startOnboarding: () => void;
  updateResponse: (cardId: string, response: any) => void;
  nextCard: () => void;
  prevCard: () => void;
  goToCard: (cardNumber: number) => void;
  completeOnboarding: () => void;
  clearResponses: () => void;
  getCurrentCard: () => any;
  getCurrentSection: () => any;
  getProgress: () => { current: number; total: number; percentage: number };
}

const STORAGE_KEY = 'onboarding-storage';

/**
 * @description Onboarding store using Zustand with persistence for state management
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      isCompleted: false,

      /**
       * @description Starts the onboarding process from the beginning
       */
      startOnboarding: () => {
        set({ currentSection: 1, currentCard: 1 });
      },

      /**
       * @description Updates the response for a specific card
       * @param cardId - Unique identifier for the card
       * @param response - Response data to store
       */
      updateResponse: (cardId: string, response: any) => {
        set((state) => ({
          responses: { ...state.responses, [cardId]: response },
        }));
      },

      /**
       * @description Moves to the next card in the onboarding flow
       */
      nextCard: () => {
        const state = get();
        if (state.currentCard < totalCards) {
          const newCard = state.currentCard + 1;
          set({
            currentCard: newCard,
            currentSection: getCurrentSectionForCard(newCard),
          });
        } else {
          get().completeOnboarding();
        }
      },

      /**
       * @description Moves to the previous card in the onboarding flow
       */
      prevCard: () => {
        const state = get();
        if (state.currentCard > 1) {
          const newCard = state.currentCard - 1;
          set({
            currentCard: newCard,
            currentSection: getCurrentSectionForCard(newCard),
          });
        }
      },

      /**
       * @description Jumps to a specific card number
       * @param cardNumber - Target card number (1-based)
       */
      goToCard: (cardNumber: number) => {
        const validCard = Math.max(1, Math.min(cardNumber, totalCards));
        const newSection = getCurrentSectionForCard(validCard);
        set({
          currentCard: validCard,
          currentSection: newSection,
        });
      },

      /**
       * @description Completes the onboarding process and redirects to processing
       */
      completeOnboarding: () => {
        set({ isCompleted: true });
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding/processing';
        }
      },

      /**
       * @description Clears all stored responses
       */
      clearResponses: () => {
        set({ responses: {} });
      },

      /**
       * @description Gets the current card object based on the current card number
       * @returns Current card object or null if not found
       */
      getCurrentCard: () => {
        const state = get();
        let cardIndex = 0;
        
        for (let sectionIndex = 0; sectionIndex < onboardingSections.length; sectionIndex++) {
          const section = onboardingSections[sectionIndex];
          if (state.currentCard <= cardIndex + section.cards.length) {
            const cardInSection = state.currentCard - cardIndex - 1;
            return section.cards[cardInSection];
          }
          cardIndex += section.cards.length;
        }
        
        return null;
      },

      /**
       * @description Gets the current section object based on the current section number
       * @returns Current section object or null if not found
       */
      getCurrentSection: () => {
        const state = get();
        const sectionIndex = state.currentSection - 1; // Convert to 0-based index
        return onboardingSections[sectionIndex] || null;
      },

      /**
       * @description Calculates the current progress through the onboarding flow
       * @returns Progress object with current, total, and percentage
       */
      getProgress: () => {
        const state = get();
        const percentage = Math.round((state.currentCard / totalCards) * 100);
        
        return {
          current: state.currentCard,
          total: totalCards,
          percentage,
        };
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);

/**
 * @description Determines which section a card number belongs to
 * @param cardNumber - Card number (1-based)
 * @returns Section number (1-based)
 */
function getCurrentSectionForCard(cardNumber: number): number {
  let cardIndex = 0;
  
  for (let sectionIndex = 0; sectionIndex < onboardingSections.length; sectionIndex++) {
    const section = onboardingSections[sectionIndex];
    if (cardNumber <= cardIndex + section.cards.length) {
      return sectionIndex + 1; // Return 1-based index
    }
    cardIndex += section.cards.length;
  }
  
  return onboardingSections.length; // Return 1-based index
}
