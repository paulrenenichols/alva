'use client';

import { Button } from './Button';
import { HeadingHero, BodyLarge } from './Typography';

interface HeroProps {
  headline: string;
  subhead: string;
  primaryCTA: string;
  secondaryCTA: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function Hero({
  headline,
  subhead,
  primaryCTA,
  secondaryCTA,
  onPrimaryClick,
  onSecondaryClick,
}: HeroProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <HeadingHero className="mb-6">{headline}</HeadingHero>
        <BodyLarge className="mb-8 max-w-2xl mx-auto">{subhead}</BodyLarge>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={onPrimaryClick}>
            {primaryCTA}
          </Button>
          <Button variant="secondary" size="lg" onClick={onSecondaryClick}>
            {secondaryCTA}
          </Button>
        </div>
      </div>
    </section>
  );
}
