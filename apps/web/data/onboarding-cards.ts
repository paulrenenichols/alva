export interface OnboardingCard {
  id: string;
  question: string;
  description: string;
  component: 'text-input' | 'textarea' | 'pill-selector' | 'number-input' | 'radio-select' | 'multi-select';
  options?: string[];
  maxSelections?: number;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => boolean;
}

export interface CardSection {
  id: string;
  title: string;
  description: string;
  cards: OnboardingCard[];
}

export const onboardingSections: CardSection[] = [
  {
    id: 'brand-clarity',
    title: 'Brand Clarity',
    description: 'Help us understand your business and brand',
    cards: [
      {
        id: 'business-name',
        question: "What's your business name?",
        description: 'The name you use to represent your business',
        component: 'text-input',
        placeholder: 'Enter your business name',
        required: true,
      },
      {
        id: 'business-description',
        question: 'How would you describe your business?',
        description: 'A brief description of what you do',
        component: 'textarea',
        placeholder: 'Describe your business...',
        required: true,
      },
      {
        id: 'brand-vibe',
        question: "What's your brand vibe?",
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Professional', 'Friendly', 'Luxury', 'Playful', 'Minimalist', 'Bold', 'Elegant', 'Modern'],
        required: true,
      },
      {
        id: 'dream-customers',
        question: 'Who are your dream customers?',
        description: 'Describe your ideal customer',
        component: 'textarea',
        placeholder: 'Describe your ideal customers...',
        required: true,
      },
      {
        id: 'focus-areas',
        question: 'What are your main business focus areas?',
        description: 'Select up to 3',
        component: 'pill-selector',
        options: ['Sales', 'Brand Awareness', 'Customer Retention', 'Lead Generation', 'Product Launch', 'Event Promotion', 'Community Building', 'Thought Leadership'],
        maxSelections: 3,
        required: true,
      },
      {
        id: 'differentiators',
        question: 'What makes you unique?',
        description: 'What sets you apart from competitors?',
        component: 'textarea',
        placeholder: 'What makes you different...',
        required: true,
      },
    ],
  },
  {
    id: 'business-goals',
    title: 'Business Goals',
    description: 'Define your marketing objectives',
    cards: [
      {
        id: 'primary-goal',
        question: "What's your primary marketing goal?",
        description: 'Choose your main objective',
        component: 'radio-select',
        options: ['Increase Sales', 'Build Brand Awareness', 'Generate Leads', 'Customer Retention', 'Product Launch', 'Market Expansion'],
        required: true,
      },
      {
        id: 'secondary-goals',
        question: 'What are your secondary goals?',
        description: 'Select up to 2 additional goals',
        component: 'pill-selector',
        options: ['Increase Sales', 'Build Brand Awareness', 'Generate Leads', 'Customer Retention', 'Product Launch', 'Market Expansion', 'Improve Customer Experience', 'Competitive Advantage'],
        maxSelections: 2,
        required: true,
      },
      {
        id: 'success-metrics',
        question: 'How do you measure success?',
        description: 'Select the metrics that matter most to you',
        component: 'pill-selector',
        options: ['Revenue Growth', 'Lead Generation', 'Website Traffic', 'Social Media Engagement', 'Brand Recognition', 'Customer Satisfaction', 'Market Share', 'ROI'],
        maxSelections: 3,
        required: true,
      },
      {
        id: 'current-challenges',
        question: 'What marketing challenges are you facing?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Limited Budget', 'Lack of Time', 'Unclear Target Audience', 'Outdated Branding', 'Poor Online Presence', 'Low Engagement', 'Competition', 'Lack of Expertise'],
        required: true,
      },
    ],
  },
  {
    id: 'target-audience',
    title: 'Target Audience',
    description: 'Define your ideal customers',
    cards: [
      {
        id: 'audience-demographics',
        question: 'What are your customer demographics?',
        description: 'Select the primary demographics',
        component: 'pill-selector',
        options: ['Age 18-24', 'Age 25-34', 'Age 35-44', 'Age 45-54', 'Age 55+', 'Male', 'Female', 'Non-binary', 'Urban', 'Suburban', 'Rural'],
        maxSelections: 4,
        required: true,
      },
      {
        id: 'audience-psychographics',
        question: 'What describes your customers?',
        description: 'Select personality traits and interests',
        component: 'pill-selector',
        options: ['Tech-Savvy', 'Price-Conscious', 'Quality-Focused', 'Convenience-Oriented', 'Eco-Conscious', 'Luxury-Seeking', 'Health-Conscious', 'Social Media Active'],
        maxSelections: 4,
        required: true,
      },
      {
        id: 'audience-pain-points',
        question: 'What problems do your customers face?',
        description: 'Describe their main pain points',
        component: 'textarea',
        placeholder: 'What problems do your customers need solved...',
        required: true,
      },
      {
        id: 'customer-journey',
        question: 'How do customers typically find you?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Google Search', 'Social Media', 'Referrals', 'Email Marketing', 'Paid Ads', 'Content Marketing', 'Events', 'Direct Contact'],
        required: true,
      },
    ],
  },
  {
    id: 'marketing-strategy',
    title: 'Marketing Strategy',
    description: 'Define your marketing approach',
    cards: [
      {
        id: 'current-marketing',
        question: 'What marketing are you currently doing?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Social Media', 'Email Marketing', 'Content Marketing', 'Paid Advertising', 'SEO', 'Influencer Marketing', 'Events', 'PR', 'None'],
        required: true,
      },
      {
        id: 'preferred-channels',
        question: 'Which marketing channels interest you most?',
        description: 'Select up to 3',
        component: 'pill-selector',
        options: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube', 'Google Ads', 'Email', 'Content Marketing', 'SEO'],
        maxSelections: 3,
        required: true,
      },
      {
        id: 'content-preferences',
        question: 'What type of content do you prefer?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Blog Posts', 'Videos', 'Infographics', 'Podcasts', 'Webinars', 'Case Studies', 'Social Media Posts', 'Email Newsletters'],
        required: true,
      },
      {
        id: 'brand-messaging',
        question: 'What key messages do you want to communicate?',
        description: 'Describe your main brand messages',
        component: 'textarea',
        placeholder: 'What do you want customers to know about your brand...',
        required: true,
      },
    ],
  },
  {
    id: 'budget-resources',
    title: 'Budget & Resources',
    description: 'Define your marketing resources',
    cards: [
      {
        id: 'monthly-budget',
        question: 'What is your monthly marketing budget?',
        description: 'Select your budget range',
        component: 'radio-select',
        options: ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000+'],
        required: true,
      },
      {
        id: 'team-size',
        question: 'How many people work on marketing?',
        description: 'Select your team size',
        component: 'radio-select',
        options: ['Just me', '2-3 people', '4-5 people', '6-10 people', '10+ people'],
        required: true,
      },
      {
        id: 'time-commitment',
        question: 'How much time can you dedicate to marketing?',
        description: 'Select your weekly time commitment',
        component: 'radio-select',
        options: ['Less than 5 hours', '5-10 hours', '10-20 hours', '20-30 hours', '30+ hours'],
        required: true,
      },
      {
        id: 'tools-software',
        question: 'What marketing tools do you currently use?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['None', 'Google Analytics', 'Facebook Ads Manager', 'Mailchimp', 'Hootsuite', 'Canva', 'HubSpot', 'Salesforce', 'Other'],
        required: true,
      },
    ],
  },
  {
    id: 'timeline-priorities',
    title: 'Timeline & Priorities',
    description: 'Define your timeline and priorities',
    cards: [
      {
        id: 'project-timeline',
        question: 'When do you want to see results?',
        description: 'Select your timeline',
        component: 'radio-select',
        options: ['ASAP', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Within 1 year'],
        required: true,
      },
      {
        id: 'priority-areas',
        question: 'What should we prioritize first?',
        description: 'Select up to 3 areas',
        component: 'pill-selector',
        options: ['Brand Development', 'Website Optimization', 'Social Media Strategy', 'Content Creation', 'Lead Generation', 'Email Marketing', 'Paid Advertising', 'SEO'],
        maxSelections: 3,
        required: true,
      },
      {
        id: 'success-timeline',
        question: 'How long are you willing to invest before seeing results?',
        description: 'Select your investment timeline',
        component: 'radio-select',
        options: ['1 month', '3 months', '6 months', '1 year', 'Long-term partnership'],
        required: true,
      },
    ],
  },
];

export const totalCards = onboardingSections.reduce((total, section) => total + section.cards.length, 0);
