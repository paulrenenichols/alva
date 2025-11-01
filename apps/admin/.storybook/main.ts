/**
 * @fileoverview Storybook configuration for admin application
 */

import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: '../apps/admin/next.config.js',
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
        '@alva/api-client': path.resolve(__dirname, '../src/mocks/api-client.ts'),
        '@alva/auth-client': path.resolve(__dirname, '../src/mocks/auth-client.ts'),
        'next/navigation': path.resolve(__dirname, '../src/mocks/next-navigation.ts'),
      };
    }
    return config;
  },
};

export default config;

