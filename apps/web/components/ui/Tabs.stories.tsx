import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Design System/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tabs component for organizing content into multiple panels with keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Default active tab',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-96">
      <div className="flex border-b border-border-default">
        <button className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
          Tab 1
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
          Tab 2
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
          Tab 3
        </button>
      </div>
      <div className="p-4">
        <p className="text-text-primary">Content for Tab 1</p>
      </div>
    </Tabs>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <div className="flex border-b border-border-default">
        <button className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
          Overview
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
          Details
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
          Settings
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Overview
        </h3>
        <p className="text-text-secondary">
          This is the overview content. It provides a summary of the main
          information.
        </p>
      </div>
    </Tabs>
  ),
};

export const VerticalTabs: Story = {
  render: () => (
    <div className="flex w-96 h-64">
      <div className="flex flex-col border-r border-border-default">
        <button className="px-4 py-2 text-text-primary border-r-2 border-primary font-medium text-left">
          Profile
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary text-left">
          Account
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary text-left">
          Security
        </button>
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Profile Settings
        </h3>
        <p className="text-text-secondary">
          Manage your profile information and preferences.
        </p>
      </div>
    </div>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-96">
      <div className="flex border-b border-border-default">
        <button className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
          Active Tab
        </button>
        <button
          className="px-4 py-2 text-text-tertiary cursor-not-allowed"
          disabled
        >
          Disabled Tab
        </button>
        <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
          Available Tab
        </button>
      </div>
      <div className="p-4">
        <p className="text-text-primary">Content for Active Tab</p>
      </div>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-96">
      <div className="flex border-b border-border-default">
        <button className="flex items-center px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
          <span className="mr-2">🏠</span>
          Home
        </button>
        <button className="flex items-center px-4 py-2 text-text-secondary hover:text-text-primary">
          <span className="mr-2">📊</span>
          Analytics
        </button>
        <button className="flex items-center px-4 py-2 text-text-secondary hover:text-text-primary">
          <span className="mr-2">⚙️</span>
          Settings
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Home Dashboard
        </h3>
        <p className="text-text-secondary">
          Welcome to your dashboard. Here you can see an overview of your data.
        </p>
      </div>
    </Tabs>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Light Mode
        </h3>
        <Tabs defaultValue="tab1" className="w-96">
          <div className="flex border-b border-border-default">
            <button className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
              Tab 1
            </button>
            <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
              Tab 2
            </button>
          </div>
          <div className="p-4">
            <p className="text-text-primary">Light mode content</p>
          </div>
        </Tabs>
      </div>

      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <Tabs defaultValue="tab1" className="w-96">
          <div className="flex border-b border-border-default">
            <button className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium">
              Tab 1
            </button>
            <button className="px-4 py-2 text-text-secondary hover:text-text-primary">
              Tab 2
            </button>
          </div>
          <div className="p-4">
            <p className="text-text-primary">Dark mode content</p>
          </div>
        </Tabs>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary">
          Accessibility Features
        </h3>
        <ul className="text-text-secondary space-y-1 mb-4">
          <li>• Keyboard navigation (Arrow keys)</li>
          <li>• Screen reader support</li>
          <li>• Proper ARIA attributes</li>
          <li>• Focus management</li>
          <li>• Semantic HTML structure</li>
        </ul>
      </div>

      <Tabs defaultValue="accessibility" className="w-full">
        <div className="flex border-b border-border-default">
          <button
            className="px-4 py-2 text-text-primary border-b-2 border-primary font-medium"
            role="tab"
            aria-selected="true"
            aria-controls="accessibility-panel"
            id="accessibility-tab"
          >
            Accessibility
          </button>
          <button
            className="px-4 py-2 text-text-secondary hover:text-text-primary"
            role="tab"
            aria-selected="false"
            aria-controls="keyboard-panel"
            id="keyboard-tab"
          >
            Keyboard
          </button>
        </div>
        <div
          className="p-4"
          role="tabpanel"
          id="accessibility-panel"
          aria-labelledby="accessibility-tab"
        >
          <p className="text-text-primary">
            This tab demonstrates proper accessibility features.
          </p>
        </div>
      </Tabs>
    </div>
  ),
};
