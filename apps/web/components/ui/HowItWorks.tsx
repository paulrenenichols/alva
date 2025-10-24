'use client';

import { HeadingSection, HeadingCard, BodyDefault } from './Typography';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  className?: string;
}

export function HowItWorks({ steps, className }: HowItWorksProps) {
  return (
    <section className={`py-16 bg-bg-secondary ${className}`}>
      <div className="container mx-auto px-4">
        <HeadingSection className="text-center mb-12">
          How it Works
        </HeadingSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-text-inverse font-bold text-xl">
                  {step.number}
                </span>
              </div>
              <HeadingCard className="mb-2">{step.title}</HeadingCard>
              <BodyDefault className="text-text-secondary">
                {step.description}
              </BodyDefault>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
