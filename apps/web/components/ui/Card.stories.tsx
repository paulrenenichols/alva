import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  HeadingCard,
  BodyDefault,
  BodySmall,
} from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';

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
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <HeadingCard>Default Card</HeadingCard>
        </CardHeader>
        <CardBody>
          <BodyDefault>
            This is a default card with subtle border styling.
          </BodyDefault>
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
          <HeadingCard>Elevated Card</HeadingCard>
        </CardHeader>
        <CardBody>
          <BodyDefault>This card has a shadow for elevation.</BodyDefault>
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
          <HeadingCard>Highlighted Card</HeadingCard>
        </CardHeader>
        <CardBody>
          <BodyDefault>
            This card has a gold left border for emphasis.
          </BodyDefault>
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
          <HeadingCard>Interactive Card</HeadingCard>
        </CardHeader>
        <CardBody>
          <BodyDefault>
            This card has hover effects and is clickable.
          </BodyDefault>
        </CardBody>
      </>
    ),
  },
};

export const WithActions: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center justify-between">
            <HeadingCard>Task Card</HeadingCard>
            <Badge variant="gold">15 min</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <BodyDefault>
            Record a 20-second behind-the-scenes Reel for your Instagram.
          </BodyDefault>
          <BodySmall className="mt-2">Due: Today</BodySmall>
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
            <HeadingCard>Quick Win</HeadingCard>
            <Badge variant="gold">5 min</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <BodyDefault>
            Post a "behind the scenes" story showing your process.
          </BodyDefault>
          <BodySmall className="mt-2">
            This will help build trust with your audience.
          </BodySmall>
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
