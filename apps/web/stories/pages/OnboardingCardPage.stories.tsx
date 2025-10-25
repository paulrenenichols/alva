/**
 * @fileoverview Storybook stories for OnboardingCardPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import OnboardingCardPage from '@/app/onboarding/[card]/page';
import { withOnboardingContext } from '../mocks/pageDecorators';

const meta: Meta<typeof OnboardingCardPage> = {
  title: 'Pages/OnboardingCardPage',
  component: OnboardingCardPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Dynamic onboarding card page for collecting user information with progress tracking.',
      },
    },
  },
  decorators: [withOnboardingContext],
  tags: ['autodocs'],
  argTypes: {
    cardNumber: {
      control: { type: 'number', min: 1, max: 26 },
      description: 'The onboarding card number to display',
    },
    responses: {
      control: 'object',
      description: 'Existing onboarding responses',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cardNumber: 1,
    responses: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding card page for the first card (business name).',
      },
    },
  },
};

export const BusinessNameCard: Story = {
  args: {
    cardNumber: 1,
    responses: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Business name card with text input field.',
      },
    },
  },
};

export const BusinessDescriptionCard: Story = {
  args: {
    cardNumber: 2,
    responses: {
      'business-name': 'Acme Corp',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Business description card with textarea input field.',
      },
    },
  },
};

export const DreamCustomersCard: Story = {
  args: {
    cardNumber: 3,
    responses: {
      'business-name': 'Acme Corp',
      'business-description': 'We provide innovative solutions',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Dream customers card with textarea input field.',
      },
    },
  },
};

export const BrandVibeCard: Story = {
  args: {
    cardNumber: 4,
    responses: {
      'business-name': 'Acme Corp',
      'business-description': 'We provide innovative solutions',
      'dream-customers': 'Small business owners',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Brand vibe card with multi-select input field.',
      },
    },
  },
};

export const PrimaryGoalCard: Story = {
  args: {
    cardNumber: 5,
    responses: {
      'business-name': 'Acme Corp',
      'business-description': 'We provide innovative solutions',
      'dream-customers': 'Small business owners',
      'brand-vibe': ['professional', 'innovative'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary goal card with radio selector input field.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    cardNumber: 1,
    responses: {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Onboarding card page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    cardNumber: 1,
    responses: {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Onboarding card page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    cardNumber: 1,
    responses: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Onboarding card page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
