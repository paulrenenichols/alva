import type { Meta, StoryObj } from '@storybook/react';
import { PillSelector } from '@/components/onboarding/inputs/PillSelector';
import { useState } from 'react';

const meta: Meta<typeof PillSelector> = {
  title: 'Onboarding/PillSelector',
  component: PillSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxSelections: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PillSelectorWithState = (args: any) => {
  const [value, setValue] = useState<string[]>([]);
  return <PillSelector {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: PillSelectorWithState,
  args: {
    options: ['Modern', 'Classic', 'Minimalist', 'Bold', 'Elegant', 'Playful'],
  },
};

export const WithMaxSelections: Story = {
  render: PillSelectorWithState,
  args: {
    options: ['Email Marketing', 'Social Media', 'Content Creation', 'SEO', 'Paid Advertising', 'Analytics'],
    maxSelections: 3,
  },
};

export const BrandVibes: Story = {
  render: PillSelectorWithState,
  args: {
    options: ['Professional', 'Friendly', 'Innovative', 'Trustworthy', 'Creative', 'Reliable'],
  },
};

export const MarketingChannels: Story = {
  render: PillSelectorWithState,
  args: {
    options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube', 'Pinterest'],
    maxSelections: 5,
  },
};
