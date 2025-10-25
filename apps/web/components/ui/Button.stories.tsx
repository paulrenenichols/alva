/**
 * @fileoverview Storybook stories for Button component
 */

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

export const LetsGo: Story = {
  args: {
    variant: 'primary',
    children: "Let's Go",
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary call-to-action button matching the onboarding design.',
      },
    },
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

export const OnboardingExample: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-text-primary">A</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Welcome to Alva!
        </h1>
        <p className="text-text-secondary mb-6">
          Let's create your personalized marketing plan in just 5 minutes.
        </p>
        <div className="bg-primary-muted rounded-lg p-4 mb-6">
          <p className="font-semibold text-text-primary mb-1">
            26 cards • 5 minutes
          </p>
          <p className="text-sm text-text-secondary">
            I'll guide you step-by-step. You won't need to guess your next move
            again.
          </p>
        </div>
        <Button variant="primary" size="lg" className="w-full mb-4">
          Let's Go
        </Button>
        <a href="#" className="text-secondary hover:underline text-sm">
          Back to Home
        </a>
        <p className="text-xs text-gray-400 mt-8">
          Bringing your marketing into the light.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Complete onboarding screen example showing the button in context.',
      },
    },
  },
};
