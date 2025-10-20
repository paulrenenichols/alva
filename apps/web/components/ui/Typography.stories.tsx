import type { Meta, StoryObj } from '@storybook/react';
import {
  HeadingHero,
  HeadingPage,
  HeadingSection,
  HeadingCard,
  BodyDefault,
  BodyLarge,
  BodySmall,
  Caption,
  Metadata,
  Link,
  LinkGhost,
} from '@/components/ui/Typography';

const meta: Meta = {
  title: 'UI/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <HeadingHero>Hero Heading</HeadingHero>
        <Caption className="mt-1">text-3xl font-bold leading-tight</Caption>
      </div>
      <div>
        <HeadingPage>Page Heading</HeadingPage>
        <Caption className="mt-1">text-xl font-bold leading-snug</Caption>
      </div>
      <div>
        <HeadingSection>Section Heading</HeadingSection>
        <Caption className="mt-1">text-lg font-semibold leading-snug</Caption>
      </div>
      <div>
        <HeadingCard>Card Heading</HeadingCard>
        <Caption className="mt-1">text-base font-semibold leading-snug</Caption>
      </div>
    </div>
  ),
};

export const BodyText: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <BodyLarge>Large body text for emphasized content</BodyLarge>
        <Caption className="mt-1">text-md font-normal leading-normal</Caption>
      </div>
      <div>
        <BodyDefault>Default body text for regular content</BodyDefault>
        <Caption className="mt-1">text-base font-normal leading-normal</Caption>
      </div>
      <div>
        <BodySmall>Small body text for secondary content</BodySmall>
        <Caption className="mt-1">
          text-sm font-normal leading-normal text-text-secondary
        </Caption>
      </div>
    </div>
  ),
};

export const Specialized: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Caption>Caption text for labels and descriptions</Caption>
        <Caption className="mt-1">
          text-xs font-normal leading-snug text-text-secondary
        </Caption>
      </div>
      <div>
        <Metadata>METADATA TEXT</Metadata>
        <Caption className="mt-1">
          text-xs font-medium leading-snug tracking-wider uppercase
          text-text-secondary
        </Caption>
      </div>
      <div>
        <Link href="#">Link text for navigation</Link>
        <Caption className="mt-1">text-blue hover:text-blue-light</Caption>
      </div>
      <div>
        <LinkGhost href="#">Ghost link text</LinkGhost>
        <Caption className="mt-1">
          text-text-secondary hover:text-text-primary
        </Caption>
      </div>
    </div>
  ),
};

export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-6">
      <HeadingHero>Welcome to Alva</HeadingHero>
      <HeadingPage>Your Marketing Dashboard</HeadingPage>
      <BodyLarge>
        Here's what will move the needle this week. I've analyzed your business
        and created a custom plan just for you.
      </BodyLarge>
      <HeadingSection>Quick Wins</HeadingSection>
      <BodyDefault>
        These are small actions you can take today that will have an immediate
        impact on your marketing.
      </BodyDefault>
      <div className="space-y-2">
        <HeadingCard>Record a 20-second BTS Reel</HeadingCard>
        <BodySmall>Due: Today • 15 minutes</BodySmall>
        <Caption>
          This will help build trust with your audience by showing your
          authentic process.
        </Caption>
      </div>
    </div>
  ),
};

export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <HeadingPage className="text-gold">Gold Heading</HeadingPage>
        <BodyDefault className="text-blue">Blue body text</BodyDefault>
        <BodySmall className="text-green">Green success text</BodySmall>
        <Caption className="text-red">Red error text</Caption>
      </div>
    </div>
  ),
};
