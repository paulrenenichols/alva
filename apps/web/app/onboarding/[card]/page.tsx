'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PillSelector } from '@/components/onboarding/inputs/PillSelector';
import { RadioSelector } from '@/components/onboarding/inputs/RadioSelector';
import { MultiSelector } from '@/components/onboarding/inputs/MultiSelector';

export default function OnboardingCardPage({
  params,
}: {
  params: Promise<{ card: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ card: string } | null>(
    null
  );
  const {
    getCurrentCard,
    getCurrentSection,
    responses,
    updateResponse,
    getProgress,
  } = useOnboardingStore();

  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
      const cardNumber = parseInt(resolved.card);
      const { goToCard } = useOnboardingStore.getState();
      goToCard(cardNumber);
    });
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  const cardNumber = parseInt(resolvedParams.card);

  const card = getCurrentCard();
  const section = getCurrentSection();
  const progress = getProgress();

  if (!card || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Card not found
          </h1>
          <p className="text-gray-600">
            The requested onboarding card could not be found.
          </p>
        </div>
      </div>
    );
  }

  const currentResponse = responses[card.id];

  const handleResponseChange = (value: any) => {
    updateResponse(card.id, value);
  };

  const renderInput = () => {
    switch (card.component) {
      case 'text-input':
        return (
          <Input
            value={currentResponse || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={card.placeholder || 'Enter your answer...'}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentResponse || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={card.placeholder || 'Enter your answer...'}
            rows={4}
            className="w-full"
          />
        );

      case 'pill-selector':
        return (
          <PillSelector
            options={card.options || []}
            value={currentResponse || []}
            onChange={handleResponseChange}
            maxSelections={card.maxSelections}
          />
        );

      case 'radio-select':
        return (
          <RadioSelector
            options={card.options || []}
            value={currentResponse || ''}
            onChange={handleResponseChange}
          />
        );

      case 'multi-select':
        return (
          <MultiSelector
            options={card.options || []}
            value={currentResponse || []}
            onChange={handleResponseChange}
            maxSelections={card.maxSelections}
          />
        );

      case 'number-input':
        return (
          <Input
            type="number"
            value={currentResponse || ''}
            onChange={(e) =>
              handleResponseChange(parseFloat(e.target.value) || 0)
            }
            placeholder={card.placeholder || 'Enter a number...'}
            className="w-full"
          />
        );

      default:
        return (
          <div className="text-gray-500 text-center py-8">
            Unsupported input type: {card.component}
          </div>
        );
    }
  };

  const validateResponse = () => {
    if (!card.validation) {
      return true;
    }
    return card.validation(currentResponse);
  };

  const isCardValid = validateResponse();

  return (
    <OnboardingCard
      cardId={card.id}
      sectionTitle={section.title}
      question={card.question}
      description={card.description}
      isRequired={card.required !== false}
      progress={progress}
      isValid={isCardValid}
      validation={card.validation}
    >
      {renderInput()}
    </OnboardingCard>
  );
}
