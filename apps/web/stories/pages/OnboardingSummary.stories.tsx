/**
 * @fileoverview Storybook stories for OnboardingSummary page
 */

import type { Meta, StoryObj } from '@storybook/react';
import SummaryPreview from '@/app/onboarding/summary/page';

const meta: Meta<typeof SummaryPreview> = {
  title: 'Pages/Onboarding/Summary',
  component: SummaryPreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Onboarding summary page showing a preview of the user's responses and generated marketing plan.",
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
        story: 'Default onboarding summary page with all sections visible.',
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Onboarding summary page optimized for mobile devices.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Onboarding summary page layout for tablet devices.',
      },
    },
  },
};
