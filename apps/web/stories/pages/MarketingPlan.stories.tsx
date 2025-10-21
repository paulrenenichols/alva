import type { Meta, StoryObj } from '@storybook/react';
import MarketingPlanPage from '@/app/dashboard/plan/page';

const meta: Meta<typeof MarketingPlanPage> = {
  title: 'Pages/Marketing Plan',
  component: MarketingPlanPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Marketing plan page showing comprehensive strategy across all channels with task management and module integration.',
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
        story:
          'Default marketing plan page with all tabs and sections visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Marketing plan page optimized for mobile devices.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Marketing plan page layout for tablet devices.',
      },
    },
  },
};

export const NoPlan: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Marketing plan page when no plan has been generated yet.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock the API client to return no plans
      const originalGetUserPlans =
        require('@alva/api-client').apiClient.getUserPlans;
      require('@alva/api-client').apiClient.getUserPlans = async () => [];

      return <Story />;
    },
  ],
};
