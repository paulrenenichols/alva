import type { Meta, StoryObj } from '@storybook/react';
import QuickWinsPage from '@/app/dashboard/quick-wins/page';

const meta: Meta<typeof QuickWinsPage> = {
  title: 'Pages/Quick Wins',
  component: QuickWinsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Daily quick wins page showing high-impact tasks that can be completed in 30 minutes or less.',
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
        story: 'Default quick wins page with all tasks visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Quick wins page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Quick wins page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const NoQuickWins: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Quick wins page when no quick wins are available.',
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
