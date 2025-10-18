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
  progress?: { current: number; total: number; percentage: number };
  isValid?: boolean;
}

export function OnboardingCard({
  cardId,
  sectionTitle,
  question,
  description,
  children,
  isRequired = false,
  validation,
  progress,
  isValid = true,
}: OnboardingCardProps) {
  const { nextCard, prevCard, getProgress } = useOnboardingStore();
  const currentProgress = progress || getProgress();
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Card {currentProgress.current} of {currentProgress.total}</span>
              <span>{currentProgress.percentage}% Complete</span>
            </div>
            <ProgressBar value={currentProgress.percentage} />
          </div>

          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-primary-600 mb-2">
              {sectionTitle}
            </h2>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {question}
            </h1>
            {description && (
              <p className="text-secondary-600">{description}</p>
            )}
          </div>

          {/* Card Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentProgress.current === 1}
            >
              Back
            </Button>
            <Button
              onClick={nextCard}
              disabled={!isValid}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {currentProgress.current === currentProgress.total ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}