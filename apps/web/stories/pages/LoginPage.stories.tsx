/**
 * @fileoverview Storybook stories for LoginPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import LoginPage from '@/app/auth/login/page';
import { withPageMocks } from '../mocks/pageDecorators';

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Login page component for user authentication with magic link functionality.',
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
        story: 'Default login page view with email input and magic link authentication.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Login page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Login page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Login page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
