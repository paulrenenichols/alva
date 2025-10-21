import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Simple Test',
  parameters: {
    docs: {
      description: {
        component: 'Simple test to verify basic styling works.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicTest: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f1f1f', marginBottom: '16px' }}>
        Basic Styling Test
      </h2>

      <div
        style={{
          backgroundColor: '#ffd700',
          color: '#1f1f1f',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '600',
        }}
      >
        This should have a yellow background (#ffd700) with black text
      </div>

      <button
        style={{
          backgroundColor: '#ffd700',
          color: '#1f1f1f',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Test Button with Inline Styles
      </button>
    </div>
  ),
};

export const CSSVariablesTest: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#1f1f1f', marginBottom: '16px' }}>
        CSS Variables Test
      </h2>

      <div
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-primary)',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '600',
        }}
      >
        This uses CSS variables: var(--color-primary) and
        var(--color-text-primary)
      </div>

      <button
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-primary)',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Button with CSS Variables
      </button>
    </div>
  ),
};
