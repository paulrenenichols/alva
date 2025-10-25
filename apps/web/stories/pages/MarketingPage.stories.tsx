/**
 * @fileoverview Storybook stories for MarketingPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import MarketingPage from '@/app/(marketing)/page';
import { withPageMocks } from '../mocks/pageDecorators';

const meta: Meta<typeof MarketingPage> = {
  title: 'Pages/MarketingPage',
  component: MarketingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Marketing landing page component for promotional content and lead generation.',
      },
    },
  },
  decorators: [withPageMocks],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default marketing page view with promotional content and call-to-action.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Marketing page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Marketing page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Marketing page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
