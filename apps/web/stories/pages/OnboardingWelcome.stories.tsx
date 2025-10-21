import type { Meta, StoryObj } from '@storybook/react';
import OnboardingWelcome from '@/app/onboarding/welcome/page';

const meta: Meta<typeof OnboardingWelcome> = {
  title: 'Pages/Onboarding/Welcome',
  component: OnboardingWelcome,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Welcome page for the onboarding flow, introducing users to Alva and the personalized marketing plan creation process.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default onboarding welcome page with all elements visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Onboarding welcome page optimized for mobile devices.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Onboarding welcome page layout for tablet devices.',
      },
    },
  },
};
