import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Theme Test',
  parameters: {
    docs: {
      description: {
        component: 'Test component to verify theme switching works correctly.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const LightMode: Story = {
  render: () => (
    <div className="p-6 bg-bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Light Mode Test</h1>
      <div className="space-y-4">
        <div className="p-4 bg-bg-secondary rounded-md">
          <p className="text-text-secondary">Secondary background</p>
        </div>
        <button className="px-4 py-2 bg-primary text-text-inverse rounded-md hover:bg-primary-hover">
          Primary Button
        </button>
        <div className="p-4 border border-border-default rounded-md">
          <p className="text-text-primary">Bordered content</p>
        </div>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark p-6 bg-bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Dark Mode Test</h1>
      <div className="space-y-4">
        <div className="p-4 bg-bg-secondary rounded-md">
          <p className="text-text-secondary">Secondary background</p>
        </div>
        <button className="px-4 py-2 bg-primary text-text-inverse rounded-md hover:bg-primary-hover">
          Primary Button
        </button>
        <div className="p-4 border border-border-default rounded-md">
          <p className="text-text-primary">Bordered content</p>
        </div>
      </div>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="p-6 bg-bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-6">Semantic Color System</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary text-text-inverse rounded-md">
          <h3 className="font-semibold">Primary</h3>
          <p className="text-sm opacity-90">Gold brand color</p>
        </div>
        <div className="p-4 bg-secondary text-text-inverse rounded-md">
          <h3 className="font-semibold">Secondary</h3>
          <p className="text-sm opacity-90">Blue accent color</p>
        </div>
        <div className="p-4 bg-success text-text-inverse rounded-md">
          <h3 className="font-semibold">Success</h3>
          <p className="text-sm opacity-90">Green success color</p>
        </div>
        <div className="p-4 bg-danger text-text-inverse rounded-md">
          <h3 className="font-semibold">Danger</h3>
          <p className="text-sm opacity-90">Red error color</p>
        </div>
        <div className="p-4 bg-warning text-text-inverse rounded-md">
          <h3 className="font-semibold">Warning</h3>
          <p className="text-sm opacity-90">Yellow warning color</p>
        </div>
        <div className="p-4 bg-info text-text-inverse rounded-md">
          <h3 className="font-semibold">Info</h3>
          <p className="text-sm opacity-90">Cyan info color</p>
        </div>
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="p-6 bg-bg-primary text-text-primary">
      <h1 className="text-3xl font-bold mb-6">Typography System</h1>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Heading 1 (3xl)
          </h1>
          <p className="text-text-secondary">Large heading for main titles</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Heading 2 (2xl)
          </h2>
          <p className="text-text-secondary">Medium heading for sections</p>
        </div>
        <div>
          <h3 className="text-xl font-medium text-text-primary">
            Heading 3 (xl)
          </h3>
          <p className="text-text-secondary">Small heading for subsections</p>
        </div>
        <div>
          <p className="text-lg text-text-primary">Large body text (lg)</p>
          <p className="text-text-secondary">For important content</p>
        </div>
        <div>
          <p className="text-base text-text-primary">
            Regular body text (base)
          </p>
          <p className="text-text-secondary">Standard paragraph text</p>
        </div>
        <div>
          <p className="text-sm text-text-primary">Small text (sm)</p>
          <p className="text-text-secondary">For captions and labels</p>
        </div>
        <div>
          <p className="text-xs text-text-primary">Extra small text (xs)</p>
          <p className="text-text-secondary">For fine print</p>
        </div>
      </div>
    </div>
  ),
};
