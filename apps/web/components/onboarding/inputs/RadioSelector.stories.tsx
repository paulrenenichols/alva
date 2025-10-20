import type { Meta, StoryObj } from '@storybook/react';
import { RadioSelector } from '@/components/onboarding/inputs/RadioSelector';
import { useState } from 'react';

const meta: Meta<typeof RadioSelector> = {
  title: 'Onboarding/RadioSelector',
  component: RadioSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const RadioSelectorWithState = (args: any) => {
  const [value, setValue] = useState<string>('');
  return <RadioSelector {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: RadioSelectorWithState,
  args: {
    options: ['Small (1-10 employees)', 'Medium (11-50 employees)', 'Large (51+ employees)'],
  },
};

export const BudgetOptions: Story = {
  render: RadioSelectorWithState,
  args: {
    options: ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', '$10,000+'],
  },
};

export const TimeCommitment: Story = {
  render: RadioSelectorWithState,
  args: {
    options: ['5 hours per week', '10 hours per week', '20 hours per week', '40+ hours per week'],
  },
};

export const BusinessStage: Story = {
  render: RadioSelectorWithState,
  args: {
    options: ['Just starting out', 'Growing rapidly', 'Established business', 'Enterprise'],
  },
};
