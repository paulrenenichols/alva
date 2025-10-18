'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface OnboardingCardProps {
  cardId: string;
  sectionTitle: string;
  question: string;
  description?: string;
  children: React.ReactNode;
  isRequired?: boolean;
  validation?: (value: any) => boolean;
}

export function OnboardingCard({
  cardId,
  sectionTitle,
  question,
  description,
  children,
  isRequired = false,
  validation,
}: OnboardingCardProps) {
  const {
    currentSection,
    currentCard,
    responses,
    updateResponse,
    nextCard,
    prevCard,
  } = useOnboardingStore();

  const currentResponse = responses[cardId];
  const sectionCardCounts = [6, 4, 6, 5, 5];
  const totalCards = sectionCardCounts.reduce((sum, count) => sum + count, 0);
  const currentCardNumber =
    sectionCardCounts
      .slice(0, currentSection - 1)
      .reduce((sum, count) => sum + count, 0) + currentCard;

  const progress = (currentCardNumber / totalCards) * 100;

  const handleNext = () => {
    if (validation && !validation(currentResponse)) {
      return;
    }
    nextCard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <ProgressBar value={progress} className="mb-8" />

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-primary-600 mb-2">
              {sectionTitle}
            </h2>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {question}
            </h1>
            {description && <p className="text-secondary-600">{description}</p>}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            {children}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentSection === 1 && currentCard === 1}
            >
              Back
            </Button>

            <div className="flex gap-3">
              {!isRequired && (
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={
                  isRequired &&
                  (!currentResponse || !validation?.(currentResponse))
                }
                className="bg-primary-500 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
