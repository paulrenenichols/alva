/**
 * @fileoverview Features section component displaying key product features
 */

'use client';

import { FeatureCard } from '@/components/ui/FeatureCard';
import { HeadingSection } from '@/components/ui/Typography';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES_DATA: Feature[] = [
  {
    icon: 'brain',
    title: 'AI-Powered Strategy',
    description:
      'Get personalized marketing strategies tailored to your business goals and target audience.',
  },
  {
    icon: 'clock',
    title: '24/7 Availability',
    description:
      'Your marketing director never sleeps. Get insights and recommendations whenever you need them.',
  },
  {
    icon: 'target',
    title: 'Precision Targeting',
    description:
      'Reach the right customers with data-driven targeting and optimization strategies.',
  },
  {
    icon: 'chart',
    title: 'Performance Analytics',
    description:
      'Track your marketing performance with detailed analytics and actionable insights.',
  },
  {
    icon: 'users',
    title: 'Customer Insights',
    description:
      'Understand your customers better with AI-powered analysis and segmentation.',
  },
  {
    icon: 'zap',
    title: 'Quick Implementation',
    description:
      'Get your marketing campaigns up and running in minutes, not months.',
  },
];

/**
 * @description Renders features section with grid of feature cards
 */
export function Features() {
  return (
    <section className="py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <HeadingSection className="text-center mb-12">
          Why Choose Alva?
        </HeadingSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feature, featureIndex) => (
            <FeatureCard
              key={featureIndex}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
