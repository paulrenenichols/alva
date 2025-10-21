import type { Meta, StoryObj } from '@storybook/react';
import SettingsPage from '@/app/dashboard/settings/page';

const meta: Meta<typeof SettingsPage> = {
  title: 'Pages/Settings',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Settings page for managing user account information, notifications, and preferences.',
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
        story: 'Default settings page with all sections visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Settings page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Settings page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};
