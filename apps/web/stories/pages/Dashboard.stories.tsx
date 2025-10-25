/**
 * @fileoverview Storybook stories for Dashboard page
 */

import type { Meta, StoryObj } from '@storybook/react';
import DashboardPage from '@/app/dashboard/page';
import { withDashboardContext } from '../mocks/pageDecorators';

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main dashboard page showing user overview, quick wins, and navigation to key features.',
      },
    },
  },
  decorators: [withDashboardContext],
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the page is in loading state',
    },
    hasData: {
      control: 'boolean',
      description: 'Whether the page has data to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    hasData: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dashboard view with all sections visible.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    hasData: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in loading state with skeleton placeholders.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    isLoading: false,
    hasData: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dashboard with no data available.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    isLoading: false,
    hasData: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    isLoading: false,
    hasData: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};
