/**
 * @fileoverview Onboarding cards data structure and configuration for user information collection
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
    id: 'brand-clarity',
    title: 'Brand Clarity',
    cards: [
      {
        id: 'business-name',
        question: "What's your business name?",
        description: 'The name you use to represent your business',
        component: 'text-input',
        isRequired: true,
        placeholder: 'Enter your business name',
      },
      {
        id: 'business-description',
        question: 'How would you describe your business?',
        description: 'A brief description of what you do',
        component: 'textarea',
        isRequired: true,
        placeholder: 'Describe your business...',
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
        isRequired: true,
      },
      {
        id: 'dream-customers',
        question: 'Who are your dream customers?',
        description: 'Describe your ideal customer',
        component: 'textarea',
        isRequired: true,
        placeholder: 'Describe your ideal customers...',
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
        isRequired: true,
      },
      {
        id: 'differentiators',
        question: 'What makes you unique?',
        description: 'What sets you apart from competitors?',
        component: 'textarea',
        isRequired: true,
        placeholder: 'What makes you different...',
      },
    ],
  },
  {
    id: 'products-offers',
    title: 'Products & Offers',
    cards: [
      {
        id: 'product-categories',
        question: 'What do you sell?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Physical Products',
          'Digital Products',
          'Services',
          'Consulting',
          'Courses',
          'Memberships',
          'Events',
          'Software',
        ],
        isRequired: true,
      },
      {
        id: 'special-offers',
        question: 'Do you have any special offers?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Discounts',
          'Free Trials',
          'Bundles',
          'Limited Time Offers',
          'Loyalty Programs',
          'Referral Bonuses',
          'Seasonal Promotions',
        ],
        isRequired: false,
      },
      {
        id: 'sales-channels',
        question: 'Where do you sell?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Website',
          'E-commerce Store',
          'Social Media',
          'Marketplaces',
          'Physical Store',
          'Pop-up Events',
          'Direct Sales',
          'Affiliates',
        ],
        isRequired: true,
      },
      {
        id: 'promotional-strategies',
        question: 'How do you currently promote your business?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Social Media',
          'Email Marketing',
          'Google Ads',
          'Facebook Ads',
          'Content Marketing',
          'Influencer Partnerships',
          'SEO',
          'Word of Mouth',
        ],
        isRequired: false,
      },
    ],
  },
  {
    id: 'content-social',
    title: 'Content & Social',
    cards: [
      {
        id: 'online-presence',
        question: 'Where do you have an online presence?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Website',
          'Instagram',
          'Facebook',
          'LinkedIn',
          'Twitter',
          'TikTok',
          'YouTube',
          'Pinterest',
          'Blog',
        ],
        isRequired: true,
      },
      {
        id: 'content-types',
        question: 'What types of content do you create?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Photos',
          'Videos',
          'Blog Posts',
          'Infographics',
          'Stories',
          'Reels',
          'Live Streams',
          'Podcasts',
        ],
        isRequired: true,
      },
      {
        id: 'creation-preferences',
        question: 'How do you prefer to create content?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'DIY',
          'Professional Photographer',
          'Content Creator',
          'Agency',
          'Team Member',
          'Outsourced',
        ],
        isRequired: true,
      },
      {
        id: 'face-voice-presence',
        question: 'Are you comfortable being the face/voice of your brand?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Yes, I love it',
          'Sometimes',
          'Prefer behind the scenes',
          'Depends on the platform',
          'Not comfortable',
        ],
        isRequired: true,
      },
      {
        id: 'competitor-analysis',
        question: 'Who are your main competitors?',
        description: 'List 2-3 competitors you admire or compete with',
        component: 'textarea',
        isRequired: true,
        placeholder: 'List your main competitors...',
      },
      {
        id: 'inspiration-accounts',
        question: 'Which accounts inspire you?',
        description: 'List 3-5 accounts you follow for inspiration',
        component: 'textarea',
        isRequired: false,
        placeholder: 'List inspiring accounts...',
      },
    ],
  },
  {
    id: 'goals-growth',
    title: 'Goals & Growth',
    cards: [
      {
        id: 'top-goals',
        question: 'What are your top 3 marketing goals?',
        description: 'Select your most important goals',
        component: 'pill-selector',
        options: [
          'Increase Sales',
          'Build Brand Awareness',
          'Generate Leads',
          'Improve Customer Retention',
          'Launch New Product',
          'Expand to New Markets',
          'Build Community',
          'Establish Thought Leadership',
        ],
        maxSelections: 3,
        isRequired: true,
      },
      {
        id: 'growth-focus',
        question: 'Where do you want to focus your growth?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'New Customers',
          'Existing Customers',
          'New Markets',
          'New Products',
          'Online Presence',
          'Offline Presence',
          'Team Expansion',
        ],
        isRequired: true,
      },
      {
        id: 'automation-preferences',
        question: 'What would you like to automate?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'Social Media Posting',
          'Email Campaigns',
          'Lead Nurturing',
          'Content Creation',
          'Customer Support',
          'Analytics Reporting',
          'Ad Management',
        ],
        isRequired: false,
      },
      {
        id: 'past-successes',
        question: 'What marketing has worked well for you?',
        description: 'Describe your past marketing successes',
        component: 'textarea',
        isRequired: false,
        placeholder: 'Describe what has worked...',
      },
      {
        id: 'past-failures',
        question: "What marketing hasn't worked?",
        description: "Describe marketing efforts that didn't work",
        component: 'textarea',
        isRequired: false,
        placeholder: "Describe what hasn't worked...",
      },
    ],
  },
  {
    id: 'constraints-tools',
    title: 'Constraints & Tools',
    cards: [
      {
        id: 'weekly-time-commitment',
        question: 'How many hours per week can you dedicate to marketing?',
        description: 'Be realistic about your availability',
        component: 'number-input',
        isRequired: true,
        placeholder: 'Enter hours per week',
      },
      {
        id: 'marketing-budget',
        question: "What's your monthly marketing budget?",
        description: 'Include all marketing expenses',
        component: 'radio-select',
        options: [
          'Under $500',
          '$500-$1,000',
          '$1,000-$2,500',
          '$2,500-$5,000',
          '$5,000-$10,000',
          'Over $10,000',
        ],
        isRequired: true,
      },
      {
        id: 'existing-tools',
        question: 'What marketing tools do you currently use?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: [
          'None',
          'Social Media Management',
          'Email Marketing',
          'Analytics',
          'Design Tools',
          'CRM',
          'Advertising Platforms',
          'Content Creation',
        ],
        isRequired: false,
      },
      {
        id: 'brand-restrictions',
        question: 'Are there any brand restrictions or guidelines?',
        description: 'Any content or messaging restrictions',
        component: 'textarea',
        isRequired: false,
        placeholder: 'Describe any restrictions...',
      },
      {
        id: 'additional-context',
        question: 'Anything else we should know?',
        description: 'Additional context about your business or goals',
        component: 'textarea',
        isRequired: false,
        placeholder: 'Share any additional context...',
      },
    ],
  },
];

export const totalCards = onboardingSections.reduce(
  (sum, section) => sum + section.cards.length,
  0
);
