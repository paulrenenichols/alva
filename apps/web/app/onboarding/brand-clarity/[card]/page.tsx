'use client';

import { useParams } from 'next/navigation';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PillSelector } from '@/components/onboarding/inputs/PillSelector';
import { useOnboardingStore } from '@/stores/onboardingStore';

const brandClarityCards = [
  {
    id: 'business-name',
    question: "What's your business name?",
    description: 'The name you use to represent your business',
    component: 'text-input',
  },
  {
    id: 'business-description',
    question: 'How would you describe your business?',
    description: 'A brief description of what you do',
    component: 'textarea',
  },
  {
    id: 'brand-vibe',
    question: "What's your brand vibe?",
    description: 'Select all that apply',
    component: 'pill-selector',
    options: [
      'Professional',
      'Friendly',
      'Luxury',
      'Playful',
      'Minimalist',
      'Bold',
      'Elegant',
      'Modern',
    ],
  },
  {
    id: 'dream-customers',
    question: 'Who are your dream customers?',
    description: 'Describe your ideal customer',
    component: 'textarea',
  },
  {
    id: 'focus-areas',
    question: 'What are your main business focus areas?',
    description: 'Select up to 3',
    component: 'pill-selector',
    options: [
      'Sales',
      'Brand Awareness',
      'Customer Retention',
      'Lead Generation',
      'Product Launch',
      'Event Promotion',
      'Community Building',
      'Thought Leadership',
    ],
    maxSelections: 3,
  },
  {
    id: 'differentiators',
    question: 'What makes you unique?',
    description: 'What sets you apart from competitors?',
    component: 'textarea',
  },
];

export default function BrandClarityCard() {
  const params = useParams();
  const cardNumber = parseInt(params.card as string);
  const card = brandClarityCards[cardNumber - 1];

  const { responses, updateResponse } = useOnboardingStore();
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
            placeholder="Enter your business name"
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentResponse || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Describe your business..."
            rows={4}
            className="w-full"
          />
        );

      case 'pill-selector':
        return (
          <PillSelector
            options={card.options}
            selected={currentResponse || []}
            onChange={handleResponseChange}
            maxSelections={card.maxSelections}
          />
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingCard
      cardId={card.id}
      sectionTitle="Brand Clarity"
      question={card.question}
      description={card.description}
      isRequired={true}
      validation={(value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value && value.trim().length > 0;
      }}
    >
      {renderInput()}
    </OnboardingCard>
  );
}
