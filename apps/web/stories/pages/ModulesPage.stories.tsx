/**
 * @fileoverview Storybook stories for ModulesPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import ModulesPage from '@/app/dashboard/modules/page';
import { withDashboardContext } from '../mocks/pageDecorators';

const meta: Meta<typeof ModulesPage> = {
  title: 'Pages/ModulesPage',
  component: ModulesPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modules page component for managing marketing modules and features with progress tracking.',
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
        story: 'Default modules page view with all marketing modules and their progress.',
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
        story: 'Modules page in loading state with skeleton placeholders.',
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
        story: 'Modules page with no data available.',
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
          'Modules page optimized for mobile devices. Resize your browser window to test mobile layout.',
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
          'Modules page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    isLoading: false,
    hasData: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Modules page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
