'use client';

import { HeadingSection, BodyDefault } from '@/components/ui/Typography';

const testimonials = [
  {
    quote:
      'Alva transformed our marketing approach. We went from guessing to knowing exactly what works for our customers.',
    author: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
  },
  {
    quote:
      "The AI insights are incredible. We've seen a 300% increase in our conversion rates since using Alva.",
    author: 'Mike Chen',
    role: 'Marketing Director, GrowthCo',
  },
  {
    quote:
      'Finally, a marketing tool that understands our business. The personalized strategies are spot-on.',
    author: 'Emily Rodriguez',
    role: 'Founder, Creative Agency',
  },
];

export function SocialProof() {
  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4">
        <HeadingSection className="text-center mb-12">
          What Our Customers Say
        </HeadingSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-bg-elevated p-6 rounded-lg shadow-sm border border-border-subtle"
            >
              <BodyDefault className="text-text-secondary mb-4 italic">
                "{testimonial.quote}"
              </BodyDefault>
              <div>
                <BodyDefault className="font-semibold text-text-primary">
                  {testimonial.author}
                </BodyDefault>
                <BodyDefault className="text-text-secondary text-sm">
                  {testimonial.role}
                </BodyDefault>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
