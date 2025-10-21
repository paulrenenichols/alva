import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const PrimaryLarge: Story = {
  args: {
    children: "Let's Go",
    variant: 'primary',
    size: 'lg',
  },
};

export const PrimaryLargeFullWidth: Story = {
  args: {
    children: "Let's Go",
    variant: 'primary',
    size: 'lg',
    className: 'w-full',
  },
};

export const GhostFullWidth: Story = {
  args: {
    children: 'Back to Home',
    variant: 'ghost',
    className: 'w-full',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const OnboardingExample: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-md">
      <Button size="lg" className="w-full">
        Let's Go
      </Button>
      <Button variant="ghost" className="w-full">
        Back to Home
      </Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
