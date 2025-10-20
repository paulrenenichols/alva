import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'highlighted', 'interactive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Default Card</h3>
        <p className="text-gray-600">This is a default card with subtle border styling.</p>
      </div>
    ),
    variant: 'default',
  },
};

export const Elevated: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
        <p className="text-gray-600">This card has a shadow for elevation.</p>
      </div>
    ),
    variant: 'elevated',
  },
};

export const Highlighted: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Highlighted Card</h3>
        <p className="text-gray-600">This card has a gold left border for emphasis.</p>
      </div>
    ),
    variant: 'highlighted',
  },
};

export const Interactive: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
        <p className="text-gray-600">This card has hover effects for interactivity.</p>
      </div>
    ),
    variant: 'interactive',
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Alva Marketing</h3>
            <p className="text-sm text-gray-600">Marketing Platform</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          Create personalized marketing plans with AI-powered insights and automated workflows.
        </p>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium">
            Get Started
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
            Learn More
          </button>
        </div>
      </div>
    ),
    variant: 'elevated',
  },
};
