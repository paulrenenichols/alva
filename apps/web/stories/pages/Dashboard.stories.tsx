/**
 * @fileoverview Storybook stories for Dashboard page
 */

import type { Meta, StoryObj } from '@storybook/react';
import DashboardPage from '@/app/dashboard/page';

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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default dashboard view with all sections visible.',
      },
    },
  },
};

export const Mobile: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};
