/**
 * @fileoverview Storybook stories for dark mode testing
 */

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Dark Mode Test',
  parameters: {
    docs: {
      description: {
        component:
          'Test component to verify dark mode theme switching works correctly.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ThemeComparison: Story = {
  render: () => (
    <div className="p-6 bg-bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Theme Comparison</h1>
      <p className="text-text-secondary mb-6">
        This component should change colors when you switch between light and
        dark themes using the toolbar.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-bg-secondary rounded-md">
          <p className="text-text-secondary">
            Secondary background - should be light gray in light mode, dark gray
            in dark mode
          </p>
        </div>

        <button className="px-4 py-2 bg-primary text-text-primary rounded-md hover:bg-primary-hover font-semibold">
          Primary Button - should stay yellow with black text in both themes
        </button>

        <div className="p-4 border border-border-default rounded-md">
          <p className="text-text-primary">
            Bordered content - border should change color between themes
          </p>
        </div>

        <div className="p-4 bg-primary-muted rounded-md">
          <p className="text-text-primary font-semibold">
            Primary Muted Background
          </p>
          <p className="text-sm text-text-secondary">
            Should be light yellow in light mode, dark yellow in dark mode
          </p>
        </div>
      </div>
    </div>
  ),
};

export const DarkModeOnly: Story = {
  render: () => (
    <div className="dark p-6 bg-bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Dark Mode Only</h1>
      <p className="text-text-secondary mb-6">
        This story is forced to dark mode to test dark theme colors.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-bg-secondary rounded-md">
          <p className="text-text-secondary">
            Secondary background - should be dark gray
          </p>
        </div>

        <button className="px-4 py-2 bg-primary text-text-primary rounded-md hover:bg-primary-hover font-semibold">
          Primary Button - should be yellow with black text
        </button>

        <div className="p-4 border border-border-default rounded-md">
          <p className="text-text-primary">
            Bordered content - should have dark border
          </p>
        </div>

        <div className="p-4 bg-primary-muted rounded-md">
          <p className="text-text-primary font-semibold">
            Primary Muted Background
          </p>
          <p className="text-sm text-text-secondary">Should be dark yellow</p>
        </div>
      </div>
    </div>
  ),
};
