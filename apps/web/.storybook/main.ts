/**
 * @fileoverview Storybook configuration for web application
 */

import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../apps/web/next.config.js',
      builder: {
        useSWC: true,
      },
    },
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@alva/api-client': path.resolve(__dirname, '../stories/mocks/api-client.ts'),
        '@alva/auth-client': path.resolve(__dirname, '../stories/mocks/auth-client.ts'),
        'next/navigation': path.resolve(__dirname, '../stories/mocks/next-navigation.ts'),
        '@/lib/utils': path.resolve(__dirname, '../lib/utils.ts'),
        '@/stores/onboardingStore': path.resolve(__dirname, '../stories/mocks/onboardingStore.ts'),
        '@/data/onboarding-cards': path.resolve(__dirname, '../stories/mocks/onboarding-cards.ts'),
      };
    }
    return config;
  },
};

export default config;