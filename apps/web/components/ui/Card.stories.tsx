/**
 * @fileoverview Storybook stories for Card component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component with multiple variants for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'highlighted', 'interactive'],
      description: 'The visual style variant of the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Default Card
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            This is a default card with subtle border styling.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Elevated Card
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            This card has a shadow for elevation.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const Highlighted: Story = {
  args: {
    variant: 'highlighted',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Highlighted Card
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            This card has a primary color left border for emphasis.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Interactive Card
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            This card has hover effects and is clickable.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <Card variant="default">
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">Default</h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">Subtle border styling</p>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">Elevated</h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">Shadow for elevation</p>
        </CardBody>
      </Card>

      <Card variant="highlighted">
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Highlighted
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">Primary color accent</p>
        </CardBody>
      </Card>

      <Card variant="interactive">
        <CardHeader>
          <h3 className="text-lg font-semibold text-text-primary">
            Interactive
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">Hover effects</p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              Task Card
            </h3>
            <Badge variant="primary">15 min</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            Record a 20-second behind-the-scenes Reel for your Instagram.
          </p>
          <p className="text-sm text-text-tertiary mt-2">Due: Today</p>
        </CardBody>
        <CardFooter>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Start Task
            </Button>
            <Button variant="ghost" size="sm">
              Skip
            </Button>
          </div>
        </CardFooter>
      </>
    ),
  },
};

export const QuickWin: Story = {
  args: {
    variant: 'highlighted',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              Quick Win
            </h3>
            <Badge variant="primary">5 min</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-text-secondary">
            Post a "behind the scenes" story showing your process.
          </p>
          <p className="text-sm text-text-tertiary mt-2">
            This will help build trust with your audience.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">
            Complete
          </Button>
        </CardFooter>
      </>
    ),
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Light Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default">
            <CardHeader>
              <h4 className="font-semibold text-text-primary">Default Card</h4>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">Light mode styling</p>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <h4 className="font-semibold text-text-primary">Elevated Card</h4>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">With shadow</p>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">
          Dark Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default">
            <CardHeader>
              <h4 className="font-semibold text-text-primary">Default Card</h4>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">Dark mode styling</p>
            </CardBody>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <h4 className="font-semibold text-text-primary">Elevated Card</h4>
            </CardHeader>
            <CardBody>
              <p className="text-text-secondary">With shadow</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-primary">Card 1</h3>
          </CardHeader>
          <CardBody>
            <p className="text-text-secondary">Responsive grid layout</p>
          </CardBody>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-primary">Card 2</h3>
          </CardHeader>
          <CardBody>
            <p className="text-text-secondary">Adapts to screen size</p>
          </CardBody>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-text-primary">Card 3</h3>
          </CardHeader>
          <CardBody>
            <p className="text-text-secondary">Mobile-first design</p>
          </CardBody>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
