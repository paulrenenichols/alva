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

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      isCompleted: false,

      startOnboarding: () => {
        set({ currentSection: 1, currentCard: 1 });
      },

      updateResponse: (cardId, response) => {
        set((state) => ({
          responses: { ...state.responses, [cardId]: response },
        }));
      },

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

      goToCard: (cardNumber: number) => {
        const validCard = Math.max(1, Math.min(cardNumber, totalCards));
        const newSection = getCurrentSectionForCard(validCard);
        set({
          currentCard: validCard,
          currentSection: newSection,
        });
      },

      completeOnboarding: () => {
        set({ isCompleted: true });
        // Redirect to processing page
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding/processing';
        }
      },

      clearResponses: () => {
        set({ responses: {} });
      },

      getCurrentCard: () => {
        const state = get();
        let cardIndex = 0;
        for (let i = 0; i < onboardingSections.length; i++) {
          const section = onboardingSections[i];
          if (state.currentCard <= cardIndex + section.cards.length) {
            const cardInSection = state.currentCard - cardIndex - 1;
            return section.cards[cardInSection];
          }
          cardIndex += section.cards.length;
        }
        return null;
      },

      getCurrentSection: () => {
        const state = get();
        // currentSection is 1-based, but array is 0-based
        const section = onboardingSections[state.currentSection - 1] || null;
        return section;
      },

      getProgress: () => {
        const state = get();
        return {
          current: state.currentCard,
          total: totalCards,
          percentage: Math.round((state.currentCard / totalCards) * 100),
        };
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);

function getCurrentSectionForCard(cardNumber: number): number {
  let cardIndex = 0;
  for (let i = 0; i < onboardingSections.length; i++) {
    const section = onboardingSections[i];
    if (cardNumber <= cardIndex + section.cards.length) {
      return i + 1; // Return 1-based index
    }
    cardIndex += section.cards.length;
  }
  return onboardingSections.length; // Return 1-based index
}
