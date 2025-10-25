/**
 * @fileoverview Storybook stories for ThemeToggle component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Design System/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A theme toggle component that switches between light and dark modes with persistence.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomStyling: Story = {
  args: {
    className: 'border-2 border-border-default',
  },
};

export const ThemeSwitchingDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-text-primary">
          Theme Toggle Demo
        </h3>
        <p className="text-text-secondary mb-4">
          Click the toggle to switch between light and dark themes. The theme
          preference is saved in localStorage.
        </p>
      </div>

      <div className="flex justify-center">
        <ThemeToggle />
      </div>

      <div className="p-4 bg-bg-secondary rounded-md">
        <p className="text-text-primary">
          This background should change color when you toggle the theme.
        </p>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary">
          Accessibility Features
        </h3>
        <ul className="text-text-secondary space-y-1">
          <li>• Keyboard accessible (Tab to focus, Enter/Space to activate)</li>
          <li>• Screen reader friendly with proper aria-label</li>
          <li>• Visual focus indicators</li>
          <li>• Semantic button element</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <ThemeToggle />
      </div>

      <div className="text-sm text-text-tertiary">
        <p>
          Try using Tab to focus the toggle, then Enter or Space to activate it.
        </p>
      </div>
    </div>
  ),
};
