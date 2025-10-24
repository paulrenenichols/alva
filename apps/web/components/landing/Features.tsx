'use client';

import { FeatureCard } from '@/components/ui/FeatureCard';
import { HeadingSection } from '@/components/ui/Typography';

const features = [
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

export function Features() {
  return (
    <section className="py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <HeadingSection className="text-center mb-12">
          Why Choose Alva?
        </HeadingSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
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
