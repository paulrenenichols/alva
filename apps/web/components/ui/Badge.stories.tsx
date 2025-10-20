import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Badge',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Badge',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Badge',
    variant: 'outline',
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Inactive</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Pending</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Badge variant="default">✓ Completed</Badge>
      <Badge variant="secondary">⏳ In Progress</Badge>
      <Badge variant="destructive">⚠ Warning</Badge>
      <Badge variant="outline">ℹ Info</Badge>
    </div>
  ),
};
