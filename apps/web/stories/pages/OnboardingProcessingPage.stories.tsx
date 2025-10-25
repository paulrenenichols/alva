/**
 * @fileoverview Storybook stories for OnboardingProcessingPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import OnboardingProcessingPage from '@/app/onboarding/processing/page';
import { withOnboardingContext } from '../mocks/pageDecorators';

const meta: Meta<typeof OnboardingProcessingPage> = {
  title: 'Pages/OnboardingProcessingPage',
  component: OnboardingProcessingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Onboarding processing page showing AI plan generation progress with loading animations.',
      },
    },
  },
  decorators: [withOnboardingContext],
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the processing is still in progress',
    },
    progress: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Processing progress percentage',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: true,
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default processing page with loading animation and progress indicator.',
      },
    },
  },
};

export const Starting: Story = {
  args: {
    isLoading: true,
    progress: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing page at the beginning of plan generation.',
      },
    },
  },
};

export const Halfway: Story = {
  args: {
    isLoading: true,
    progress: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing page halfway through plan generation.',
      },
    },
  },
};

export const AlmostComplete: Story = {
  args: {
    isLoading: true,
    progress: 90,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing page almost complete with plan generation.',
      },
    },
  },
};

export const Complete: Story = {
  args: {
    isLoading: false,
    progress: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing page with completed plan generation.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    isLoading: true,
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Processing page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    isLoading: true,
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Processing page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    isLoading: true,
    progress: 45,
  },
  parameters: {
    docs: {
      description: {
        story: 'Processing page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
