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
            currentSection: getCurrentSectionForCard(newCard)
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
            currentSection: getCurrentSectionForCard(newCard)
          });
        }
      },

      goToCard: (cardNumber: number) => {
        const validCard = Math.max(1, Math.min(cardNumber, totalCards));
        set({
          currentCard: validCard,
          currentSection: getCurrentSectionForCard(validCard)
        });
      },

      completeOnboarding: () => {
        set({ isCompleted: true });
        // Redirect to processing page
        if (typeof window !== 'undefined') {
          window.location.href = '/onboarding/processing';
        }
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
        return onboardingSections[state.currentSection] || null;
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
      return i;
    }
    cardIndex += section.cards.length;
  }
  return onboardingSections.length - 1;
}
