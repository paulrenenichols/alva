/**
 * @fileoverview Storybook stories for VerifyPage
 */

import type { Meta, StoryObj } from '@storybook/react';
import VerifyPage from '@/app/verify/page';
import { withPageMocks } from '../mocks/pageDecorators';

const meta: Meta<typeof VerifyPage> = {
  title: 'Pages/VerifyPage',
  component: VerifyPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Email verification page for confirming user email addresses with magic link tokens.',
      },
    },
  },
  decorators: [withPageMocks],
  tags: ['autodocs'],
  argTypes: {
    isSuccess: {
      control: 'boolean',
      description: 'Whether the verification was successful',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the verification is still processing',
    },
    error: {
      control: 'text',
      description: 'Error message if verification failed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSuccess: false,
    isLoading: true,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default verification page in loading state.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isSuccess: false,
    isLoading: true,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Verification page showing loading state while processing token.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    isSuccess: true,
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Verification page showing successful email verification.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    isSuccess: false,
    isLoading: false,
    error: 'Invalid or expired verification token',
  },
  parameters: {
    docs: {
      description: {
        story: 'Verification page showing error state with invalid token.',
      },
    },
  },
};

export const ExpiredToken: Story = {
  args: {
    isSuccess: false,
    isLoading: false,
    error: 'Verification token has expired. Please request a new one.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Verification page showing expired token error.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    isSuccess: true,
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verification page optimized for mobile devices. Resize your browser window to test mobile layout.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    isSuccess: true,
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Verification page layout for tablet devices. Resize your browser window to test tablet layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    isSuccess: true,
    isLoading: false,
    error: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Verification page in dark mode theme.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
