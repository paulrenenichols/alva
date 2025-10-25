/**
 * @fileoverview Mock for onboarding cards data
 */

export interface OnboardingCard {
  id: string;
  question: string;
  description?: string;
  component:
    | 'text-input'
    | 'textarea'
    | 'pill-selector'
    | 'radio-select'
    | 'multi-select'
    | 'number-input';
  options?: string[];
  maxSelections?: number;
  isRequired?: boolean;
  placeholder?: string;
  validation?: (value: any) => boolean;
}

export interface OnboardingSection {
  id: string;
  title: string;
  cards: OnboardingCard[];
}

export const onboardingSections: OnboardingSection[] = [
  {
    id: 'business',
    title: 'Business Information',
    cards: [
      {
        id: 'business-name',
        question: 'What\'s your business name?',
        description: 'Tell us about your business',
        component: 'text-input',
        isRequired: true,
        placeholder: 'Enter your business name',
      },
      {
        id: 'business-description',
        question: 'Describe your business',
        description: 'What do you do?',
        component: 'textarea',
        isRequired: true,
        placeholder: 'Tell us about your business...',
      },
    ],
  },
];

export const totalCards = 26;
