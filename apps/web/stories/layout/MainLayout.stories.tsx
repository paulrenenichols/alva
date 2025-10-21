import type { Meta, StoryObj } from '@storybook/react';
import { MainLayout } from '../layout/MainLayout';

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main application layout with header, sidebar, and content area.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Content to display in the main area',
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
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Welcome to Alva</h1>
        <p className="text-text-secondary mb-6">
          This is the main content area of the application. The layout includes a header, 
          sidebar navigation, and this main content area.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-secondary rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">Quick Stats</h3>
            <p className="text-text-secondary">View your marketing performance metrics</p>
          </div>
          <div className="p-4 bg-bg-secondary rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">Recent Activity</h3>
            <p className="text-text-secondary">See your latest marketing activities</p>
          </div>
          <div className="p-4 bg-bg-secondary rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">Quick Actions</h3>
            <p className="text-text-secondary">Access frequently used features</p>
          </div>
        </div>
      </div>
    </MainLayout>
  ),
};

export const WithSidebar: Story = {
  render: () => (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Dashboard</h1>
        <p className="text-text-secondary mb-6">
          This layout includes a collapsible sidebar for navigation. The sidebar can be 
          toggled on mobile devices and provides easy access to all main sections.
        </p>
        <div className="bg-bg-secondary p-4 rounded-md">
          <h3 className="font-semibold text-text-primary mb-2">Layout Features</h3>
          <ul className="text-text-secondary space-y-1">
            <li>• Responsive sidebar navigation</li>
            <li>• Collapsible on mobile devices</li>
            <li>• Persistent state across page loads</li>
            <li>• Keyboard accessible</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  ),
};

export const Responsive: Story = {
  render: () => (
    <MainLayout>
      <div className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-4">Responsive Layout</h1>
        <p className="text-text-secondary mb-6">
          This layout adapts to different screen sizes. The sidebar behavior changes 
          based on the viewport width.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-secondary rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">Desktop</h3>
            <p className="text-text-secondary text-sm">
              Sidebar is always visible and can be collapsed/expanded
            </p>
          </div>
          <div className="p-4 bg-bg-secondary rounded-md">
            <h3 className="font-semibold text-text-primary mb-2">Mobile</h3>
            <p className="text-text-secondary text-sm">
              Sidebar is hidden by default and can be toggled via hamburger menu
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Light Mode</h3>
        <div className="border border-border-default rounded-md overflow-hidden h-96">
          <MainLayout>
            <div className="p-4">
              <h4 className="font-semibold text-text-primary mb-2">Light Theme</h4>
              <p className="text-text-secondary text-sm">
                Clean, bright interface with subtle shadows and borders.
              </p>
            </div>
          </MainLayout>
        </div>
      </div>
      
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Dark Mode</h3>
        <div className="border border-border-default rounded-md overflow-hidden h-96">
          <MainLayout>
            <div className="p-4">
              <h4 className="font-semibold text-text-primary mb-2">Dark Theme</h4>
              <p className="text-text-secondary text-sm">
                Easy on the eyes with high contrast text and dark backgrounds.
              </p>
            </div>
          </MainLayout>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Accessibility Features</h1>
        <div className="max-w-4xl space-y-6">
          <div className="p-4 bg-bg-secondary rounded-md">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Navigation</h2>
            <ul className="text-text-secondary space-y-1">
              <li>• Skip links for main content</li>
              <li>• Proper heading hierarchy</li>
              <li>• Keyboard navigation support</li>
              <li>• Screen reader friendly</li>
            </ul>
          </div>
          
          <div className="p-4 bg-bg-secondary rounded-md">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Layout</h2>
            <ul className="text-text-secondary space-y-1">
              <li>• Semantic HTML structure</li>
              <li>• ARIA landmarks</li>
              <li>• Focus management</li>
              <li>• High contrast support</li>
            </ul>
          </div>
          
          <div className="p-4 bg-bg-secondary rounded-md">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Responsive Design</h2>
            <ul className="text-text-secondary space-y-1">
              <li>• Mobile-first approach</li>
              <li>• Touch-friendly controls</li>
              <li>• Scalable text and UI elements</li>
              <li>• Flexible grid system</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  ),
};
