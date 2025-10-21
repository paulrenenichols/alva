import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component using semantic design tokens for consistent theming.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'destructive'],
      description: 'The visual style variant using semantic color tokens',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button is in loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button variant="primary">Default</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
      </div>
    </div>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Light Mode</h3>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
        <p className="text-text-secondary mb-4">
          Use Tab to navigate between buttons, Enter/Space to activate
        </p>
        <div className="flex gap-4">
          <Button variant="primary">First Button</Button>
          <Button variant="secondary">Second Button</Button>
          <Button variant="ghost">Third Button</Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
        <Button variant="primary" aria-label="Save document">
          💾
        </Button>
      </div>
    </div>
  ),
};

export const ResponsiveExample: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <Button variant="primary" size="lg" className="w-full">
        Full Width Primary
      </Button>
      <Button variant="secondary" className="w-full">
        Full Width Secondary
      </Button>
      <Button variant="ghost" className="w-full">
        Full Width Ghost
      </Button>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
