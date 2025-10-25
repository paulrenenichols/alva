/**
 * @fileoverview Storybook stories for CSS variables testing
 */

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/CSS Variables Test',
  parameters: {
    docs: {
      description: {
        component:
          'Test to verify CSS custom properties are working correctly.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const PrimaryColorTest: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-primary text-text-primary rounded-md">
        <p className="font-semibold">Primary Background Test</p>
        <p>This should have a yellow background (#ffd700) with black text</p>
      </div>

      <div className="p-4 bg-primary-muted text-text-primary rounded-md">
        <p className="font-semibold">Primary Muted Background Test</p>
        <p>This should have a light yellow background</p>
      </div>

      <div className="p-4 border-2 border-primary text-text-primary rounded-md">
        <p className="font-semibold">Primary Border Test</p>
        <p>This should have a yellow border</p>
      </div>

      <div className="p-4 bg-bg-secondary text-text-primary rounded-md">
        <p className="font-semibold">Secondary Background Test</p>
        <p>This should have a light gray background</p>
      </div>
    </div>
  ),
};

export const ButtonTest: Story = {
  render: () => (
    <div className="space-y-4">
      <button className="bg-primary text-text-primary px-4 py-2 rounded-md font-semibold">
        Test Button with CSS Variables
      </button>

      <button className="bg-primary-muted text-text-primary px-4 py-2 rounded-md font-semibold">
        Test Button with Muted Primary
      </button>

      <div className="p-4 bg-primary text-text-primary rounded-md">
        <p>Direct CSS Variable Test:</p>
        <div
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-primary)',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          This uses CSS variables directly
        </div>
      </div>
    </div>
  ),
};
