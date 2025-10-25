/**
 * @fileoverview Storybook preview configuration and global decorators
 */

import type { Preview } from '@storybook/react';
import React from 'react';
import '../app/global.css'; // Import Tailwind CSS
import { withThemeByClassName } from '@storybook/addon-themes';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'primary',
          value: '#f59e0b', // Gold color from design system
        },
      ],
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    (Story) => (
      <div className="font-sans antialiased p-5 min-h-screen bg-bg-primary">
        <Story />
      </div>
    ),
  ],
};

export default preview;
