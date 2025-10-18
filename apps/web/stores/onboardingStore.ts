import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentSection: number;
  currentCard: number;
  responses: Record<string, any>;
  isCompleted: boolean;
  startOnboarding: () => void;
  updateResponse: (cardId: string, response: any) => void;
  nextCard: () => void;
  prevCard: () => void;
  completeOnboarding: () => void;
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
        const { currentSection, currentCard } = get();
        const sectionCardCounts = [6, 4, 6, 5, 5]; // Cards per section

        if (currentCard < sectionCardCounts[currentSection - 1]) {
          set({ currentCard: currentCard + 1 });
        } else if (currentSection < 5) {
          set({ currentSection: currentSection + 1, currentCard: 1 });
        } else {
          get().completeOnboarding();
        }
      },

      prevCard: () => {
        const { currentSection, currentCard } = get();

        if (currentCard > 1) {
          set({ currentCard: currentCard - 1 });
        } else if (currentSection > 1) {
          const sectionCardCounts = [6, 4, 6, 5, 5];
          set({
            currentSection: currentSection - 1,
            currentCard: sectionCardCounts[currentSection - 2],
          });
        }
      },

      completeOnboarding: () => {
        set({ isCompleted: true });
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
