import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelector } from '@/components/onboarding/inputs/MultiSelector';
import { useState } from 'react';

const meta: Meta<typeof MultiSelector> = {
  title: 'Onboarding/MultiSelector',
  component: MultiSelector,
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

const MultiSelectorWithState = (args: any) => {
  const [value, setValue] = useState<string[]>([]);
  return <MultiSelector {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: MultiSelectorWithState,
  args: {
    options: ['Email Marketing', 'Social Media', 'Content Creation', 'SEO', 'Paid Advertising', 'Analytics'],
  },
};

export const WithMaxSelections: Story = {
  render: MultiSelectorWithState,
  args: {
    options: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube', 'Pinterest', 'Snapchat'],
    maxSelections: 3,
  },
};

export const MarketingGoals: Story = {
  render: MultiSelectorWithState,
  args: {
    options: ['Increase brand awareness', 'Generate leads', 'Drive sales', 'Build community', 'Improve customer retention'],
    maxSelections: 3,
  },
};

export const ContentTypes: Story = {
  render: MultiSelectorWithState,
  args: {
    options: ['Blog posts', 'Social media posts', 'Videos', 'Infographics', 'Webinars', 'Podcasts', 'Case studies'],
  },
};
