import type { Preview } from '@storybook/react';
import React from 'react';

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
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      // Add CSS custom properties to the document head and apply theme
      React.useEffect(() => {
        console.log('Theme changed to:', theme);

        // Apply theme class to document body for Storybook canvas
        if (theme === 'dark') {
          document.body.classList.add('dark');
          console.log('Applied dark class to body');
        } else {
          document.body.classList.remove('dark');
          console.log('Removed dark class from body');
        }

        // Remove existing style if it exists
        const existingStyle = document.getElementById('storybook-theme-styles');
        if (existingStyle) {
          existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'storybook-theme-styles';
        style.textContent = `
          :root {
            /* Light Mode Semantic Colors */
            --color-primary: #ffd700;
            --color-primary-hover: #ffe44d;
            --color-primary-active: #e6c200;
            --color-primary-muted: #fff4cc;

            --color-secondary: #007bff;
            --color-secondary-hover: #4da3ff;
            --color-secondary-active: #0056b3;
            --color-secondary-muted: #cce5ff;

            --color-success: #28a745;
            --color-success-hover: #5cb85c;
            --color-success-active: #1e7e34;
            --color-success-muted: #d4edda;

            --color-danger: #d32f2f;
            --color-danger-hover: #ef5350;
            --color-danger-active: #b71c1c;
            --color-danger-muted: #f8d7da;

            --color-warning: #ffc107;
            --color-warning-hover: #ffd54f;
            --color-warning-active: #e0a800;
            --color-warning-muted: #fff3cd;

            --color-info: #17a2b8;
            --color-info-hover: #5dade2;
            --color-info-active: #138496;
            --color-info-muted: #d1ecf1;

            /* Light Mode Text Colors */
            --color-text-primary: #1f1f1f;
            --color-text-secondary: #6f6f6f;
            --color-text-tertiary: #a0a0a0;
            --color-text-inverse: #ffffff;

            /* Light Mode Background Colors */
            --color-bg-primary: #ffffff;
            --color-bg-secondary: #fafafa;
            --color-bg-tertiary: #f0f0f0;
            --color-bg-elevated: #ffffff;

            /* Light Mode Border Colors */
            --color-border-subtle: #e5e5e5;
            --color-border-default: #cccccc;
            --color-border-strong: #a0a0a0;
            --color-border-focus: #ffd700;
          }

          /* Dark Mode Theme */
          .dark {
            /* Dark Mode Text Colors */
            --color-text-primary: #fafafa;
            --color-text-secondary: #a0a0a0;
            --color-text-tertiary: #6f6f6f;
            --color-text-inverse: #0a0a0a;

            /* Dark Mode Background Colors */
            --color-bg-primary: #0f172a;
            --color-bg-secondary: #1e293b;
            --color-bg-tertiary: #334155;
            --color-bg-elevated: #1e293b;

            /* Dark Mode Border Colors */
            --color-border-subtle: #334155;
            --color-border-default: #475569;
            --color-border-strong: #64748b;
            --color-border-focus: #ffd700;

            /* Keep brand colors consistent in dark mode */
            --color-primary: #d4af00;
            --color-primary-hover: #e6c200;
            --color-primary-active: #b8941f;
            --color-primary-muted: #332f00;

            --color-secondary: #3b82f6;
            --color-secondary-hover: #60a5fa;
            --color-secondary-active: #2563eb;
            --color-secondary-muted: #1e3a8a;

            --color-success: #10b981;
            --color-success-hover: #34d399;
            --color-success-active: #059669;
            --color-success-muted: #064e3b;

            --color-danger: #ef4444;
            --color-danger-hover: #f87171;
            --color-danger-active: #dc2626;
            --color-danger-muted: #7f1d1d;

            --color-warning: #f59e0b;
            --color-warning-hover: #fbbf24;
            --color-warning-active: #d97706;
            --color-warning-muted: #78350f;

            --color-info: #06b6d4;
            --color-info-hover: #22d3ee;
            --color-info-active: #0891b2;
            --color-info-muted: #164e63;
          }

          /* Storybook Canvas Background */
          .sb-show-main,
          .sb-main-padded,
          .sb-main-padded .sb-show-main,
          #storybook-root,
          #storybook-root .sb-show-main {
            background-color: var(--color-bg-primary) !important;
          }
          
          /* Ensure dark mode applies to body */
          body.dark {
            background-color: var(--color-bg-primary) !important;
          }
          
          /* Basic utility classes for Storybook */
          .bg-primary { background-color: var(--color-primary); }
          .text-text-primary { color: var(--color-text-primary); }
          .text-text-inverse { color: var(--color-text-inverse); }
          .bg-primary-hover:hover { background-color: var(--color-primary-hover); }
          .bg-primary-active:active { background-color: var(--color-primary-active); }
          .font-semibold { font-weight: 600; }
          .inline-flex { display: inline-flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .rounded-md { border-radius: 8px; }
          .text-sm { font-size: 14px; }
          .font-medium { font-weight: 500; }
          .transition-colors { transition: color 150ms, background-color 150ms; }
          .focus-visible\\:outline-none:focus-visible { outline: none; }
          .focus-visible\\:ring-2:focus-visible { box-shadow: 0 0 0 2px var(--color-border-focus); }
          .disabled\\:pointer-events-none:disabled { pointer-events: none; }
          .disabled\\:opacity-50:disabled { opacity: 0.5; }
          .h-10 { height: 40px; }
          .px-4 { padding-left: 16px; padding-right: 16px; }
          .py-2 { padding-top: 8px; padding-bottom: 8px; }
        `;
        document.head.appendChild(style);

        return () => {
          const existingStyle = document.getElementById(
            'storybook-theme-styles'
          );
          if (existingStyle) {
            existingStyle.remove();
          }
          // Clean up theme class
          document.body.classList.remove('dark');
        };
      }, [theme]);

      return (
        <div
          className={`font-sans antialiased ${theme === 'dark' ? 'dark' : ''}`}
          style={{
            backgroundColor:
              theme === 'dark'
                ? 'var(--color-bg-primary)'
                : 'var(--color-bg-primary)',
            minHeight: '100vh',
            padding: '20px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
