/**
 * @fileoverview Storybook stories for Header component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '../../components/layout/Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main application header with navigation, branding, and user controls.',
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

export const WithNavigation: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Main Content
        </h1>
        <p className="text-text-secondary">
          This demonstrates how the header looks with main content below it.
        </p>
      </main>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
          Responsive Header
        </h1>
        <p className="text-text-secondary">
          The header adapts to different screen sizes. Try resizing your browser
          window to see the responsive behavior.
        </p>
        <div className="mt-4 p-4 bg-bg-secondary rounded-md">
          <p className="text-sm text-text-secondary">
            <strong>Desktop:</strong> Full navigation menu visible
            <br />
            <strong>Mobile:</strong> Hamburger menu for navigation
          </p>
        </div>
      </main>
    </div>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Light Mode
        </h3>
        <div className="border border-border-default rounded-md overflow-hidden">
          <Header />
        </div>
      </div>

      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <div className="border border-border-default rounded-md overflow-hidden">
          <Header />
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Accessibility Features
          </h1>
          <div className="space-y-4">
            <div className="p-4 bg-bg-secondary rounded-md">
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Keyboard Navigation
              </h2>
              <ul className="text-text-secondary space-y-1">
                <li>• Tab to navigate between interactive elements</li>
                <li>• Enter/Space to activate buttons and links</li>
                <li>• Arrow keys for dropdown menus</li>
                <li>• Escape to close menus</li>
              </ul>
            </div>

            <div className="p-4 bg-bg-secondary rounded-md">
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Screen Reader Support
              </h2>
              <ul className="text-text-secondary space-y-1">
                <li>• Proper heading structure</li>
                <li>• Descriptive link text</li>
                <li>• ARIA labels for interactive elements</li>
                <li>• Skip links for main content</li>
              </ul>
            </div>

            <div className="p-4 bg-bg-secondary rounded-md">
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Visual Indicators
              </h2>
              <ul className="text-text-secondary space-y-1">
                <li>• Clear focus indicators</li>
                <li>• High contrast colors</li>
                <li>• Consistent visual hierarchy</li>
                <li>• Responsive design for all devices</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  ),
};
