/**
 * @fileoverview Storybook stories for RootPage (landing page)
 */

import type { Meta, StoryObj } from '@storybook/react';
import RootPage from '@/app/page';
import { withPageMocks } from '../mocks/pageDecorators';

const meta: Meta<typeof RootPage> = {
  title: 'Pages/RootPage',
  component: RootPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Root page component that renders the main landing page with authentication integration.',
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
        story: 'Default landing page view with hero section, features, and call-to-action buttons.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Landing page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Landing page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Landing page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
