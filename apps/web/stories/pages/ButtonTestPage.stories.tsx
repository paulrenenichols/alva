/**
 * @fileoverview Storybook stories for ButtonTestPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import ButtonTestPage from '@/app/button-test/page';
import { withPageMocks } from '../mocks/pageDecorators';

const meta: Meta<typeof ButtonTestPage> = {
  title: 'Pages/ButtonTestPage',
  component: ButtonTestPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Button test page component for development and testing of button variants and states.',
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
        story: 'Default button test page showing all button variants, sizes, and states.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Button test page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Button test page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Button test page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
