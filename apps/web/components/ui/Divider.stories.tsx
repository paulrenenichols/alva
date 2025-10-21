import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Design System/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A divider component for separating content sections with semantic styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the divider',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-64">
      <p className="text-text-primary mb-4">Content above</p>
      <Divider {...args} />
      <p className="text-text-primary mt-4">Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex items-center h-32">
      <p className="text-text-primary mr-4">Left content</p>
      <Divider {...args} />
      <p className="text-text-primary ml-4">Right content</p>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-text-primary mb-4">Section 1</p>
      <div className="flex items-center my-4">
        <Divider orientation="horizontal" className="flex-1" />
        <span className="px-3 text-text-secondary text-sm">OR</span>
        <Divider orientation="horizontal" className="flex-1" />
      </div>
      <p className="text-text-primary mt-4">Section 2</p>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="w-64">
        <p className="text-text-primary mb-2">Default</p>
        <Divider />
      </div>
      
      <div className="w-64">
        <p className="text-text-primary mb-2">Thick</p>
        <Divider className="border-2" />
      </div>
      
      <div className="w-64">
        <p className="text-text-primary mb-2">Dashed</p>
        <Divider className="border-dashed" />
      </div>
      
      <div className="w-64">
        <p className="text-text-primary mb-2">Colored</p>
        <Divider className="border-primary" />
      </div>
    </div>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Light Mode</h3>
        <div className="w-64">
          <p className="text-text-primary mb-4">Content above</p>
          <Divider />
          <p className="text-text-primary mt-4">Content below</p>
        </div>
      </div>
      
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Dark Mode</h3>
        <div className="w-64">
          <p className="text-text-primary mb-4">Content above</p>
          <Divider />
          <p className="text-text-primary mt-4">Content below</p>
        </div>
      </div>
    </div>
  ),
};
