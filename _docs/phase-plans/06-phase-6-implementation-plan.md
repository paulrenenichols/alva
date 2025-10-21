# Phase 6: Storybook 9 & Tailwind CSS v4 Integration - Implementation Plan

**@fileoverview** Comprehensive implementation plan for Phase 6 of the Alva project, focusing on upgrading to Storybook 9 with integrated addons, upgrading to Tailwind CSS v4, implementing semantic design system with dark mode support, and establishing a robust component development environment.

---

## Implementation Overview

**Goal**: Establish a fully functional Storybook 9 development environment with Tailwind CSS v4 integration, semantic design system implementation, dark mode support, Next.js 15 compatibility, and comprehensive component documentation for efficient design system development.

**Estimated Duration**: 4-5 weeks (160-200 hours)

**Success Criteria**:

- Storybook 9 running with Next.js 15 compatibility and integrated addons
- Tailwind CSS v4 properly configured with semantic naming system
- Dark mode theme implemented alongside existing light mode
- All existing components documented in Storybook with proper styling
- Design system components properly styled with semantic tokens
- Interactive component testing environment with accessibility testing
- Responsive design testing capabilities across all viewports
- Component development workflow established with automated deployment
- Comprehensive documentation updated with new system specifications

**Builds On**: Phase 5 - provides the foundation for efficient component development and design system implementation

---

## Current System Analysis

### 🔴 **Critical Issues Identified**

#### 1. Storybook Version & Configuration Issues

**Status**: ❌ Using Storybook 9.1.13 but missing integrated addons
**Impact**: Limited development capabilities and poor developer experience
**Current Issues**:

- Using outdated addon installation approach (many addons now integrated)
- Missing proper Storybook 9 configuration for integrated addons
- No accessibility testing integration
- Limited responsive testing capabilities
- Missing design system documentation

#### 2. Tailwind CSS v3 Limitations

**Status**: ❌ Using Tailwind CSS v3.4.0 with hardcoded color system
**Impact**: No dark mode support, non-semantic naming, limited theming
**Current Issues**:

- Hardcoded color values instead of semantic naming
- No dark mode support
- Limited CSS custom properties usage
- Non-semantic color naming (gold, blue, etc.)
- Missing CSS-first configuration approach

#### 3. Component Documentation Gaps

**Status**: ❌ Limited component stories and documentation
**Impact**: Poor component development experience
**Current Issues**:

- Missing stories for most components
- No interactive component testing
- Limited design system documentation
- No responsive testing examples
- No dark mode testing examples

#### 4. Development Workflow Issues

**Status**: ❌ No established component development workflow
**Impact**: Inefficient development process
**Current Issues**:

- No hot reloading optimization
- No build performance optimization
- No testing integration
- No team training materials
- No automated deployment pipeline

---

## Implementation Plan

### **Week 1: Storybook 9 Upgrade & Configuration**

#### 1.1 Storybook 9 Upgrade (20-24 hours)

**Objective**: Upgrade to Storybook 9 with proper integrated addon configuration

**Tasks**:

1. **Upgrade Storybook to Latest Version**

   ```bash
   # Upgrade to Storybook 9 latest
   npx storybook@latest upgrade

   # Verify upgrade completed successfully
   npm list @storybook/nextjs
   ```

2. **Configure Integrated Addons (No Installation Required)**

   **Essential Addons (Now Integrated)**:

   - `@storybook/addon-essentials` - Core functionality (docs, controls, actions, viewport, background, toolbar)
   - `@storybook/addon-interactions` - User interaction testing
   - `@storybook/addon-a11y` - Accessibility testing
   - `@storybook/addon-viewport` - Responsive design testing
   - `@storybook/addon-docs` - Documentation generation
   - `@storybook/addon-controls` - Interactive controls
   - `@storybook/addon-backgrounds` - Background testing
   - `@storybook/addon-measure` - Element measurement
   - `@storybook/addon-outline` - Element outlines
   - `@storybook/addon-highlight` - Code highlighting
   - `@storybook/addon-toolbars` - Custom toolbars

3. **Update Main Configuration for Storybook 9**

   ```typescript
   // .storybook/main.ts
   import type { StorybookConfig } from '@storybook/nextjs';

   const config: StorybookConfig = {
     stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
     addons: [
       '@storybook/addon-essentials', // Includes all essential addons
       '@storybook/addon-interactions',
       '@storybook/addon-a11y',
       '@storybook/addon-viewport',
       '@storybook/addon-docs',
       '@storybook/addon-controls',
       '@storybook/addon-backgrounds',
       '@storybook/addon-measure',
       '@storybook/addon-outline',
       '@storybook/addon-highlight',
       '@storybook/addon-toolbars',
     ],
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
         propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
       },
     },
     webpackFinal: async (config) => {
       // Handle CSS imports for Tailwind CSS v4
       config.module.rules.push({
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
       });

       // Handle SVG imports
       config.module.rules.push({
         test: /\.svg$/,
         use: ['@svgr/webpack'],
       });

       return config;
     },
   };

   export default config;
   ```

4. **Configure Preview Settings for Storybook 9**

   ```typescript
   // .storybook/preview.ts
   import type { Preview } from '@storybook/react';
   import '../apps/web/app/global.css'; // Import global styles

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
       viewport: {
         viewports: {
           mobile: {
             name: 'Mobile',
             styles: {
               width: '375px',
               height: '667px',
             },
           },
           tablet: {
             name: 'Tablet',
             styles: {
               width: '768px',
               height: '1024px',
             },
           },
           desktop: {
             name: 'Desktop',
             styles: {
               width: '1440px',
               height: '900px',
             },
           },
         },
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
       (Story) => (
         <div className="font-sans antialiased">
           <Story />
         </div>
       ),
     ],
   };

   export default preview;
   ```

5. **Test Storybook 9 Setup**

   ```bash
   # Test Storybook startup
   pnpm nx run web:storybook

   # Verify no build errors
   # Test basic component rendering
   # Verify TypeScript compatibility
   # Test integrated addons functionality
   ```

#### 1.2 Tailwind CSS v4 Upgrade (24-28 hours)

**Objective**: Upgrade to Tailwind CSS v4 with CSS-first configuration and semantic naming system

**Tasks**:

1. **Upgrade Tailwind CSS to v4**

   ```bash
   # Upgrade to Tailwind CSS v4
   npm install tailwindcss@next

   # Verify upgrade
   npm list tailwindcss
   ```

2. **Create CSS-First Configuration**

   ```css
   /* apps/web/app/global.css */
   @import 'tailwindcss';

   /* Design System CSS Custom Properties */
   @theme {
     /* Semantic Color System */
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

     /* Semantic Text Colors */
     --color-text-primary: #1f1f1f;
     --color-text-secondary: #6f6f6f;
     --color-text-tertiary: #a0a0a0;
     --color-text-inverse: #ffffff;

     /* Semantic Background Colors */
     --color-bg-primary: #ffffff;
     --color-bg-secondary: #fafafa;
     --color-bg-tertiary: #f0f0f0;
     --color-bg-elevated: #ffffff;

     /* Semantic Border Colors */
     --color-border-subtle: #e5e5e5;
     --color-border-default: #cccccc;
     --color-border-strong: #a0a0a0;
     --color-border-focus: #ffd700;

     /* Spacing System */
     --spacing-0: 0;
     --spacing-1: 4px;
     --spacing-2: 8px;
     --spacing-3: 12px;
     --spacing-4: 16px;
     --spacing-5: 20px;
     --spacing-6: 24px;
     --spacing-8: 32px;
     --spacing-10: 40px;
     --spacing-12: 48px;
     --spacing-16: 64px;
     --spacing-20: 80px;
     --spacing-24: 96px;

     /* Typography */
     --font-family-sans: 'Inter', 'Helvetica', 'Arial', sans-serif;
     --font-size-xs: 12px;
     --font-size-sm: 13px;
     --font-size-base: 14px;
     --font-size-md: 16px;
     --font-size-lg: 18px;
     --font-size-xl: 22px;
     --font-size-2xl: 28px;
     --font-size-3xl: 36px;

     /* Border Radius */
     --radius-sm: 4px;
     --radius-md: 8px;
     --radius-lg: 12px;
     --radius-xl: 16px;
     --radius-full: 9999px;

     /* Shadows */
     --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
     --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
     --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
     --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
     --shadow-focus: 0 0 0 3px rgba(255, 215, 0, 0.3);
     --shadow-error: 0 0 0 3px rgba(211, 47, 47, 0.2);

     /* Transitions */
     --transition-fast: 100ms;
     --transition-normal: 150ms;
     --transition-moderate: 200ms;
     --transition-slow: 300ms;
     --transition-slower: 500ms;
   }

   /* Dark Mode Theme */
   @media (prefers-color-scheme: dark) {
     @theme {
       /* Dark Mode Semantic Colors */
       --color-text-primary: #fafafa;
       --color-text-secondary: #a0a0a0;
       --color-text-tertiary: #6f6f6f;
       --color-text-inverse: #1f1f1f;

       --color-bg-primary: #0f172a;
       --color-bg-secondary: #1e293b;
       --color-bg-tertiary: #334155;
       --color-bg-elevated: #1e293b;

       --color-border-subtle: #334155;
       --color-border-default: #475569;
       --color-border-strong: #64748b;
       --color-border-focus: #ffd700;

       /* Keep brand colors consistent */
       --color-primary: #ffd700;
       --color-primary-hover: #ffe44d;
       --color-primary-active: #e6c200;
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
   }

   /* Manual Dark Mode Toggle Support */
   .dark {
     --color-text-primary: #fafafa;
     --color-text-secondary: #a0a0a0;
     --color-text-tertiary: #6f6f6f;
     --color-text-inverse: #1f1f1f;

     --color-bg-primary: #0f172a;
     --color-bg-secondary: #1e293b;
     --color-bg-tertiary: #334155;
     --color-bg-elevated: #1e293b;

     --color-border-subtle: #334155;
     --color-border-default: #475569;
     --color-border-strong: #64748b;
     --color-border-focus: #ffd700;

     /* Keep brand colors consistent */
     --color-primary: #ffd700;
     --color-primary-hover: #ffe44d;
     --color-primary-active: #e6c200;
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
   ```

3. **Update Tailwind Configuration for v4**

   ```javascript
   // apps/web/tailwind.config.js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}', './pages/**/*.{js,ts,jsx,tsx,mdx}', './stories/**/*.{js,ts,jsx,tsx,mdx}', './.storybook/**/*.{js,ts,jsx,tsx,mdx}'],
     darkMode: 'class', // Enable manual dark mode toggle
     theme: {
       extend: {
         // Semantic color system using CSS custom properties
         colors: {
           primary: {
             DEFAULT: 'var(--color-primary)',
             hover: 'var(--color-primary-hover)',
             active: 'var(--color-primary-active)',
             muted: 'var(--color-primary-muted)',
           },
           secondary: {
             DEFAULT: 'var(--color-secondary)',
             hover: 'var(--color-secondary-hover)',
             active: 'var(--color-secondary-active)',
             muted: 'var(--color-secondary-muted)',
           },
           success: {
             DEFAULT: 'var(--color-success)',
             hover: 'var(--color-success-hover)',
             active: 'var(--color-success-active)',
             muted: 'var(--color-success-muted)',
           },
           danger: {
             DEFAULT: 'var(--color-danger)',
             hover: 'var(--color-danger-hover)',
             active: 'var(--color-danger-active)',
             muted: 'var(--color-danger-muted)',
           },
           warning: {
             DEFAULT: 'var(--color-warning)',
             hover: 'var(--color-warning-hover)',
             active: 'var(--color-warning-active)',
             muted: 'var(--color-warning-muted)',
           },
           info: {
             DEFAULT: 'var(--color-info)',
             hover: 'var(--color-info-hover)',
             active: 'var(--color-info-active)',
             muted: 'var(--color-info-muted)',
           },
           text: {
             primary: 'var(--color-text-primary)',
             secondary: 'var(--color-text-secondary)',
             tertiary: 'var(--color-text-tertiary)',
             inverse: 'var(--color-text-inverse)',
           },
           bg: {
             primary: 'var(--color-bg-primary)',
             secondary: 'var(--color-bg-secondary)',
             tertiary: 'var(--color-bg-tertiary)',
             elevated: 'var(--color-bg-elevated)',
           },
           border: {
             subtle: 'var(--color-border-subtle)',
             DEFAULT: 'var(--color-border-default)',
             strong: 'var(--color-border-strong)',
             focus: 'var(--color-border-focus)',
           },
         },
         fontFamily: {
           sans: ['var(--font-family-sans)'],
         },
         fontSize: {
           xs: ['var(--font-size-xs)', { lineHeight: '1.5' }],
           sm: ['var(--font-size-sm)', { lineHeight: '1.5' }],
           base: ['var(--font-size-base)', { lineHeight: '1.5' }],
           md: ['var(--font-size-md)', { lineHeight: '1.5' }],
           lg: ['var(--font-size-lg)', { lineHeight: '1.375' }],
           xl: ['var(--font-size-xl)', { lineHeight: '1.375' }],
           '2xl': ['var(--font-size-2xl)', { lineHeight: '1.25' }],
           '3xl': ['var(--font-size-3xl)', { lineHeight: '1.25' }],
         },
         spacing: {
           0: 'var(--spacing-0)',
           1: 'var(--spacing-1)',
           2: 'var(--spacing-2)',
           3: 'var(--spacing-3)',
           4: 'var(--spacing-4)',
           5: 'var(--spacing-5)',
           6: 'var(--spacing-6)',
           8: 'var(--spacing-8)',
           10: 'var(--spacing-10)',
           12: 'var(--spacing-12)',
           16: 'var(--spacing-16)',
           20: 'var(--spacing-20)',
           24: 'var(--spacing-24)',
         },
         borderRadius: {
           sm: 'var(--radius-sm)',
           DEFAULT: 'var(--radius-md)',
           md: 'var(--radius-md)',
           lg: 'var(--radius-lg)',
           xl: 'var(--radius-xl)',
           full: 'var(--radius-full)',
         },
         boxShadow: {
           sm: 'var(--shadow-sm)',
           DEFAULT: 'var(--shadow-md)',
           md: 'var(--shadow-md)',
           lg: 'var(--shadow-lg)',
           xl: 'var(--shadow-xl)',
           focus: 'var(--shadow-focus)',
           error: 'var(--shadow-error)',
         },
         transitionDuration: {
           fast: 'var(--transition-fast)',
           DEFAULT: 'var(--transition-normal)',
           moderate: 'var(--transition-moderate)',
           slow: 'var(--transition-slow)',
           slower: 'var(--transition-slower)',
         },
       },
     },
     plugins: [],
   };
   ```

4. **Create Dark Mode Toggle Component**

   ```typescript
   // apps/web/components/ui/ThemeToggle.tsx
   import { useState, useEffect } from 'react';
   import { Sun, Moon } from 'lucide-react';

   export function ThemeToggle() {
     const [isDark, setIsDark] = useState(false);

     useEffect(() => {
       // Check for saved theme preference or default to light mode
       const savedTheme = localStorage.getItem('theme');
       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

       setIsDark(shouldBeDark);
       document.documentElement.classList.toggle('dark', shouldBeDark);
     }, []);

     const toggleTheme = () => {
       const newTheme = !isDark;
       setIsDark(newTheme);
       document.documentElement.classList.toggle('dark', newTheme);
       localStorage.setItem('theme', newTheme ? 'dark' : 'light');
     };

     return (
       <button onClick={toggleTheme} className="p-2 rounded-md bg-bg-secondary hover:bg-bg-tertiary transition-colors" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
         {isDark ? <Sun className="h-5 w-5 text-text-primary" /> : <Moon className="h-5 w-5 text-text-primary" />}
       </button>
     );
   }
   ```

5. **Test Tailwind CSS v4 Integration**

   ```bash
   # Test Tailwind CSS v4 compilation
   pnpm nx run web:build

   # Test Storybook with new CSS system
   pnpm nx run web:storybook

   # Verify semantic color classes work
   # Test dark mode toggle functionality
   # Verify CSS custom properties are working
   ```

#### 1.3 Storybook Dark Mode Integration (8-12 hours)

**Objective**: Integrate dark mode testing in Storybook with theme switching

**Tasks**:

1. **Configure Storybook Theme Switching**

   ```typescript
   // .storybook/preview.ts - Add theme switching
   import type { Preview } from '@storybook/react';
   import '../apps/web/app/global.css';

   const preview: Preview = {
     parameters: {
       // ... existing parameters
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
         ],
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
         return (
           <div className={`font-sans antialiased ${theme === 'dark' ? 'dark' : ''}`}>
             <Story />
           </div>
         );
       },
     ],
   };

   export default preview;
   ```

2. **Create Theme-Aware Story Examples**

   ```typescript
   // apps/web/stories/ThemeTest.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';

   const meta: Meta = {
     title: 'Design System/Theme Test',
     parameters: {
       docs: {
         description: {
           component: 'Test component to verify theme switching works correctly.',
         },
       },
     },
   };

   export default meta;
   type Story = StoryObj;

   export const LightMode: Story = {
     render: () => (
       <div className="p-6 bg-bg-primary text-text-primary">
         <h1 className="text-2xl font-bold mb-4">Light Mode Test</h1>
         <div className="space-y-4">
           <div className="p-4 bg-bg-secondary rounded-md">
             <p className="text-text-secondary">Secondary background</p>
           </div>
           <button className="px-4 py-2 bg-primary text-text-inverse rounded-md hover:bg-primary-hover">Primary Button</button>
           <div className="p-4 border border-border-default rounded-md">
             <p className="text-text-primary">Bordered content</p>
           </div>
         </div>
       </div>
     ),
   };

   export const DarkMode: Story = {
     render: () => (
       <div className="dark p-6 bg-bg-primary text-text-primary">
         <h1 className="text-2xl font-bold mb-4">Dark Mode Test</h1>
         <div className="space-y-4">
           <div className="p-4 bg-bg-secondary rounded-md">
             <p className="text-text-secondary">Secondary background</p>
           </div>
           <button className="px-4 py-2 bg-primary text-text-inverse rounded-md hover:bg-primary-hover">Primary Button</button>
           <div className="p-4 border border-border-default rounded-md">
             <p className="text-text-primary">Bordered content</p>
           </div>
         </div>
       </div>
     ),
   };
   ```

3. **Test Theme Integration**
   ```bash
   # Test theme switching in Storybook
   # Verify dark mode styles apply correctly
   # Test theme persistence across stories
   # Verify accessibility in both themes
   ```

### **Week 2: Component Documentation with Semantic Design System**

#### 2.1 Button Component Documentation (16-20 hours)

**Objective**: Create comprehensive Button component documentation with semantic design system

**Tasks**:

1. **Create Button Stories with Semantic Classes**

   ```typescript
   // apps/web/components/ui/Button.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './Button';

   const meta: Meta<typeof Button> = {
     title: 'Design System/Button',
     component: Button,
     parameters: {
       layout: 'centered',
       docs: {
         description: {
           component: 'A versatile button component using semantic design tokens for consistent theming.',
         },
       },
     },
     tags: ['autodocs'],
     argTypes: {
       variant: {
         control: { type: 'select' },
         options: ['primary', 'secondary', 'ghost', 'destructive'],
         description: 'The visual style variant using semantic color tokens',
       },
       size: {
         control: { type: 'select' },
         options: ['sm', 'md', 'lg'],
         description: 'The size of the button',
       },
       disabled: {
         control: { type: 'boolean' },
         description: 'Whether the button is disabled',
       },
       loading: {
         control: { type: 'boolean' },
         description: 'Whether the button is in loading state',
       },
     },
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Button',
     },
   };

   export const Secondary: Story = {
     args: {
       variant: 'secondary',
       children: 'Secondary Button',
     },
   };

   export const Ghost: Story = {
     args: {
       variant: 'ghost',
       children: 'Ghost Button',
     },
   };

   export const Destructive: Story = {
     args: {
       variant: 'destructive',
       children: 'Destructive Button',
     },
   };

   export const AllSizes: Story = {
     render: () => (
       <div className="flex gap-4 items-center">
         <Button variant="primary" size="sm">
           Small
         </Button>
         <Button variant="primary" size="md">
           Medium
         </Button>
         <Button variant="primary" size="lg">
           Large
         </Button>
       </div>
     ),
   };

   export const AllStates: Story = {
     render: () => (
       <div className="space-y-4">
         <div className="flex gap-4">
           <Button variant="primary">Default</Button>
           <Button variant="primary" disabled>
             Disabled
           </Button>
           <Button variant="primary" loading>
             Loading
           </Button>
         </div>
         <div className="flex gap-4">
           <Button variant="secondary">Default</Button>
           <Button variant="secondary" disabled>
             Disabled
           </Button>
           <Button variant="secondary" loading>
             Loading
           </Button>
         </div>
       </div>
     ),
   };

   export const ThemeComparison: Story = {
     render: () => (
       <div className="space-y-8">
         <div>
           <h3 className="text-lg font-semibold mb-4">Light Mode</h3>
           <div className="flex gap-4">
             <Button variant="primary">Primary</Button>
             <Button variant="secondary">Secondary</Button>
             <Button variant="ghost">Ghost</Button>
             <Button variant="destructive">Destructive</Button>
           </div>
         </div>
         <div className="dark">
           <h3 className="text-lg font-semibold mb-4 text-text-primary">Dark Mode</h3>
           <div className="flex gap-4">
             <Button variant="primary">Primary</Button>
             <Button variant="secondary">Secondary</Button>
             <Button variant="ghost">Ghost</Button>
             <Button variant="destructive">Destructive</Button>
           </div>
         </div>
       </div>
     ),
   };
   ```

2. **Update Button Component with Semantic Classes**

   ```typescript
   // apps/web/components/ui/Button.tsx
   import { forwardRef } from 'react';
   import { cva, type VariantProps } from 'class-variance-authority';
   import { cn } from '@/lib/utils';

   const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50', {
     variants: {
       variant: {
         primary: 'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active',
         secondary: 'bg-bg-secondary text-text-primary border border-border-default hover:bg-bg-tertiary',
         ghost: 'text-text-primary hover:bg-bg-secondary',
         destructive: 'bg-danger text-text-inverse hover:bg-danger-hover active:bg-danger-active',
       },
       size: {
         sm: 'h-8 px-3 text-xs',
         md: 'h-10 px-4 py-2',
         lg: 'h-12 px-8 text-base',
       },
     },
     defaultVariants: {
       variant: 'primary',
       size: 'md',
     },
   });

   export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
     loading?: boolean;
   }

   const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, loading, children, disabled, ...props }, ref) => {
     return (
       <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
         {loading ? <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
         {children}
       </button>
     );
   });
   Button.displayName = 'Button';

   export { Button, buttonVariants };
   ```

3. **Document Button Accessibility Features**

   ```typescript
   export const AccessibilityTest: Story = {
     render: () => (
       <div className="space-y-4">
         <div>
           <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
           <p className="text-text-secondary mb-4">Use Tab to navigate between buttons, Enter/Space to activate</p>
           <div className="flex gap-4">
             <Button variant="primary">First Button</Button>
             <Button variant="secondary">Second Button</Button>
             <Button variant="ghost">Third Button</Button>
           </div>
         </div>
         <div>
           <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
           <Button variant="primary" aria-label="Save document">
             💾
           </Button>
         </div>
       </div>
     ),
   };
   ```

4. **Test Button Component**
   ```bash
   # Test all button variants in Storybook
   # Verify semantic classes work correctly
   # Test dark mode appearance
   # Verify accessibility compliance
   # Test responsive behavior
   ```

#### 2.2 Card Component Documentation (12-16 hours)

**Objective**: Create comprehensive Card component documentation

**Tasks**:

1. **Create Card Stories**

   ```bash
   # Create Card.stories.tsx
   # Document all card variants
   # Set up interactive controls
   # Add responsive testing
   ```

2. **Document Card Variants**

   ```bash
   # Default card
   # Elevated card
   # Highlighted card
   # Interactive card
   # Compact card
   ```

3. **Document Card States**

   ```bash
   # Default state
   # Hover state
   # Focus state
   # Active state
   # Loading state
   ```

4. **Document Card Layouts**
   ```bash
   # Card with header
   # Card with footer
   # Card with actions
   # Card with media
   ```

#### 2.3 Input Component Documentation (8-12 hours)

**Objective**: Create comprehensive Input component documentation

**Tasks**:

1. **Create Input Stories**

   ```bash
   # Create Input.stories.tsx
   # Document all input types
   # Set up form validation examples
   # Add accessibility testing
   ```

2. **Document Input Types**

   ```bash
   # Text input
   # Email input
   # Password input
   # Number input
   # Search input
   # Textarea
   ```

3. **Document Input States**

   ```bash
   # Default state
   # Focus state
   # Error state
   # Disabled state
   # Loading state
   ```

4. **Document Form Integration**
   ```bash
   # Form field wrapper
   # Label styling
   # Error message styling
   # Helper text styling
   ```

#### 2.4 Navigation Component Documentation (12-16 hours)

**Objective**: Create comprehensive Navigation component documentation

**Tasks**:

1. **Create Navigation Stories**

   ```bash
   # Create Header.stories.tsx
   # Create Sidebar.stories.tsx
   # Create Breadcrumb.stories.tsx
   # Set up responsive testing
   ```

2. **Document Navigation Variants**

   ```bash
   # Header navigation
   # Sidebar navigation
   # Breadcrumb navigation
   # Tab navigation
   # Pagination
   ```

3. **Document Navigation States**

   ```bash
   # Default state
   # Active state
   # Hover state
   # Focus state
   # Mobile state
   ```

4. **Document Navigation Layouts**
   ```bash
   # Desktop layout
   # Tablet layout
   # Mobile layout
   # Responsive behavior
   ```

### **Week 3: Advanced Features & Testing**

#### 3.1 Accessibility Testing Integration (12-16 hours)

**Objective**: Integrate comprehensive accessibility testing

**Tasks**:

1. **Configure Accessibility Addon**

   ```bash
   # Set up @storybook/addon-a11y
   # Configure accessibility rules
   # Set up accessibility testing
   # Configure color contrast testing
   ```

2. **Create Accessibility Test Stories**

   ```bash
   # Test keyboard navigation
   # Test screen reader compatibility
   # Test color contrast
   # Test focus management
   ```

3. **Document Accessibility Guidelines**

   ```bash
   # Create accessibility documentation
   # Document WCAG compliance
   # Create accessibility checklist
   # Document best practices
   ```

4. **Test All Components**
   ```bash
   # Run accessibility tests on all components
   # Fix accessibility issues
   # Document accessibility features
   # Create accessibility examples
   ```

#### 3.2 Responsive Design Testing (12-16 hours)

**Objective**: Set up comprehensive responsive design testing

**Tasks**:

1. **Configure Viewport Addon**

   ```bash
   # Set up @storybook/addon-viewport
   # Configure device presets
   # Set up custom viewports
   # Configure responsive testing
   ```

2. **Create Responsive Test Stories**

   ```bash
   # Test mobile layouts
   # Test tablet layouts
   # Test desktop layouts
   # Test breakpoint behavior
   ```

3. **Document Responsive Patterns**

   ```bash
   # Document responsive design patterns
   # Create responsive examples
   # Document breakpoint usage
   # Create responsive guidelines
   ```

4. **Test All Components Responsively**
   ```bash
   # Test all components on different viewports
   # Fix responsive issues
   # Document responsive behavior
   # Create responsive examples
   ```

#### 3.3 Interactive Component Testing (8-12 hours)

**Objective**: Set up interactive component testing environment

**Tasks**:

1. **Configure Interactions Addon**

   ```bash
   # Set up @storybook/addon-interactions
   # Configure user interactions
   # Set up interaction testing
   # Configure user flow testing
   ```

2. **Create Interactive Stories**

   ```bash
   # Create form interaction stories
   # Create navigation interaction stories
   # Create component interaction stories
   # Create user flow stories
   ```

3. **Document Interaction Patterns**

   ```bash
   # Document user interaction patterns
   # Create interaction examples
   # Document user flow patterns
   # Create interaction guidelines
   ```

4. **Test All Interactive Components**
   ```bash
   # Test all interactive components
   # Fix interaction issues
   # Document interaction features
   # Create interaction examples
   ```

### **Week 4: Polish & Documentation**

#### 4.1 Performance Optimization (8-12 hours)

**Objective**: Optimize Storybook performance and build times

**Tasks**:

1. **Optimize Webpack Configuration**

   ```bash
   # Optimize webpack build configuration
   # Set up proper caching
   # Optimize bundle splitting
   # Configure build optimization
   ```

2. **Optimize CSS Processing**

   ```bash
   # Optimize CSS build pipeline
   # Set up CSS purging
   # Optimize CSS loading
   # Configure CSS optimization
   ```

3. **Optimize Story Loading**

   ```bash
   # Optimize story loading performance
   # Set up lazy loading
   # Optimize component loading
   # Configure performance monitoring
   ```

4. **Test Performance**
   ```bash
   # Test build performance
   # Test runtime performance
   # Test loading performance
   # Document performance metrics
   ```

#### 4.2 Documentation Creation (12-16 hours)

**Objective**: Create comprehensive documentation for team

**Tasks**:

1. **Create Storybook Usage Guide**

   ```bash
   # Create comprehensive usage guide
   # Document all features and capabilities
   # Create troubleshooting guide
   # Document best practices
   ```

2. **Create Component Development Guide**

   ```bash
   # Document component development workflow
   # Create component creation guidelines
   # Document testing procedures
   # Create development best practices
   ```

3. **Create Design System Documentation**

   ```bash
   # Document design system usage
   # Create component library documentation
   # Document design tokens
   # Create design guidelines
   ```

4. **Create Team Training Materials**

   ```bash
   # Create onboarding materials
   # Create training presentations
   # Create video tutorials
   # Create reference materials
   ```

5. **Update README Documentation**
   ```bash
   # Add Storybook deployment information to README
   # Include links to deployed Storybook instances
   # Document deployment process and URLs
   # Add component development workflow documentation
   # Include troubleshooting guide for Storybook
   ```

#### 4.3 GitHub Pages Deployment Setup (8-12 hours)

**Objective**: Set up automated Storybook deployment to GitHub Pages

**Tasks**:

1. **Configure GitHub Pages Deployment**

   ```bash
   # Add Storybook build job to CI/CD pipeline
   # Configure GitHub Pages deployment
   # Set up proper build artifacts
   # Configure deployment permissions
   ```

2. **Update CI/CD Pipeline**

   ```bash
   # Add storybook-build job to .github/workflows/ci.yml
   # Configure deployment triggers
   # Set up proper caching for faster builds
   # Configure environment variables
   ```

3. **Test Deployment Process**

   ```bash
   # Test Storybook build in CI environment
   # Verify GitHub Pages deployment
   # Test deployment on different branches
   # Verify proper URL configuration
   ```

4. **Configure Custom Domain (Optional)**
   ```bash
   # Set up custom domain for Storybook
   # Configure SSL certificates
   # Set up proper redirects
   # Document deployment process
   ```

#### 4.4 Final Testing & Validation (8-12 hours)

**Objective**: Final testing and validation of all features

**Tasks**:

1. **Comprehensive Testing**

   ```bash
   # Test all components in Storybook
   # Test all interactive features
   # Test all responsive layouts
   # Test all accessibility features
   ```

2. **Performance Validation**

   ```bash
   # Validate build performance
   # Validate runtime performance
   # Validate loading performance
   # Validate memory usage
   ```

3. **Documentation Review**

   ```bash
   # Review all documentation
   # Test all examples
   # Validate all instructions
   # Fix any issues found
   ```

4. **Team Validation**
   ```bash
   # Have team test Storybook setup
   # Gather feedback and suggestions
   # Fix any issues reported
   # Finalize setup and documentation
   ```

---

## GitHub Pages Deployment Configuration

### CI/CD Pipeline Integration

**Add Storybook Build and Deploy Job to .github/workflows/ci.yml**

```yaml
storybook-build-and-deploy:
  runs-on: ubuntu-latest
  needs: [build]
  if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
  permissions:
    contents: read
    pages: write
    id-token: write
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'pnpm'

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: ${{ env.PNPM_VERSION }}

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build Storybook
      run: pnpm nx run web:build-storybook

    - name: Setup Pages
      uses: actions/configure-pages@v4

    - name: Upload Storybook artifacts
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./apps/web/storybook-static

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Storybook Build Configuration

**Update apps/web/project.json to include build-storybook target**

```json
{
  "targets": {
    "build-storybook": {
      "executor": "@nx/storybook:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "apps/web/storybook-static",
        "configDir": "apps/web/.storybook",
        "uiFramework": "@storybook/nextjs"
      },
      "configurations": {
        "ci": {
          "quiet": true
        }
      }
    },
    "storybook": {
      "executor": "@nx/storybook:storybook",
      "options": {
        "configDir": "apps/web/.storybook",
        "browserTarget": "web:build",
        "compodoc": false,
        "uiFramework": "@storybook/nextjs"
      },
      "configurations": {
        "ci": {
          "quiet": true
        }
      }
    }
  }
}
```

### GitHub Pages Configuration

**Configure GitHub Pages settings in repository:**

1. **Repository Settings**:

   - Go to Settings → Pages
   - Source: GitHub Actions
   - Custom domain: `storybook.alva.com` (optional)

2. **Environment Setup**:

   - Create `github-pages` environment
   - Configure deployment protection rules
   - Set up environment secrets if needed

3. **Branch Protection**:
   - Configure branch protection for main/develop
   - Require status checks before merging
   - Include Storybook build in required checks

### Deployment URLs

- **Main Branch**: `https://paulrenenichols.github.io/alva/`
- **Develop Branch**: `https://paulrenenichols.github.io/alva/develop/`
- **Custom Domain**: `https://storybook.alva.com/` (optional)

### Deployment Triggers

**Automatic deployment on**:

- Push to `main` branch (production Storybook)
- Push to `develop` branch (staging Storybook)
- Pull request previews (optional)

**Manual deployment**:

- Triggered via GitHub Actions UI
- Available for any branch or tag

### README Documentation Updates

**Add comprehensive Storybook 9 and Tailwind CSS v4 documentation to project README:**

````markdown
## 🎨 Component Library (Storybook 9)

Our component library is automatically deployed and updated with each merge to provide a live, interactive documentation of all UI components using Storybook 9 with Tailwind CSS v4 and semantic design system.

### 📖 Live Documentation

- **Production Storybook**: [View Live Component Library](https://paulrenenichols.github.io/alva/)
- **Staging Storybook**: [View Development Components](https://paulrenenichols.github.io/alva/develop/)

### 🚀 Quick Start

1. **View Components**: Visit the live Storybook links above
2. **Local Development**: Run `pnpm nx run web:storybook` to start local Storybook
3. **Build Storybook**: Run `pnpm nx run web:build-storybook` to build static version
4. **Theme Testing**: Use the theme toggle in Storybook toolbar to test light/dark modes

### 📚 What's Included

- **Interactive Component Playground**: Test components with live controls
- **Semantic Design System**: Complete color, typography, and spacing guides with CSS custom properties
- **Dark Mode Support**: Full theme switching with semantic color tokens
- **Accessibility Testing**: Built-in a11y testing for all components
- **Responsive Testing**: Test components across different screen sizes
- **Component Stories**: Comprehensive examples and use cases
- **Storybook 9 Features**: Latest addons and performance improvements

### 🎨 Design System Features

#### Semantic Color System

- **Primary**: Gold (#ffd700) - Primary actions and highlights
- **Secondary**: Blue (#007bff) - Secondary actions and navigation
- **Success**: Green (#28a745) - Success states and positive feedback
- **Danger**: Red (#d32f2f) - Error states and destructive actions
- **Warning**: Yellow (#ffc107) - Warning states and cautions
- **Info**: Cyan (#17a2b8) - Informational content

#### Dark Mode Support

- Automatic system preference detection
- Manual theme toggle with persistence
- Semantic color tokens that adapt to theme
- Consistent brand colors across themes

#### CSS Custom Properties

All design tokens are defined as CSS custom properties for easy theming:

```css
--color-primary: #ffd700;
--color-text-primary: #1f1f1f;
--color-bg-primary: #ffffff;
```

### 🔧 Development Workflow

1. **Create/Update Component**: Make changes to component files using semantic classes
2. **Update Stories**: Add or modify component stories in `.stories.tsx` files
3. **Test Locally**: Run Storybook locally to verify changes
4. **Test Themes**: Verify components work in both light and dark modes
5. **Deploy**: Merge to main/develop branch for automatic deployment

### 📖 Component Documentation

Each component includes:

- Interactive controls for all props
- Multiple variants and states
- Light and dark mode examples
- Accessibility testing results
- Responsive behavior examples
- Usage guidelines and best practices
- Semantic class usage examples

### 🛠️ Troubleshooting

**Storybook won't start locally?**

```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
pnpm nx run web:storybook
```

**Components not styling correctly?**

- Check Tailwind CSS v4 integration in `.storybook/preview.ts`
- Verify global CSS import includes `@import "tailwindcss"`
- Ensure semantic color classes are being used
- Check CSS custom properties are defined in `global.css`

**Dark mode not working?**

- Verify `darkMode: 'class'` is set in `tailwind.config.js`
- Check that `.dark` class is being applied to document
- Ensure CSS custom properties have dark mode variants
- Test theme toggle component functionality

**Deployment issues?**

- Check GitHub Actions logs for build errors
- Verify GitHub Pages settings in repository Settings → Pages
- Ensure proper permissions for deployment workflow
- Check Storybook 9 compatibility with deployment platform

### 🔗 Useful Links

- [Storybook 9 Documentation](https://storybook.js.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Component Development Guide](./docs/component-development.md)
- [Design System Guidelines](./docs/design-system.md)
- [Dark Mode Implementation](./docs/dark-mode.md)
- [Deployment Troubleshooting](./docs/troubleshooting.md)

### 🆕 What's New in Phase 6

- **Storybook 9**: Latest version with integrated addons and improved performance
- **Tailwind CSS v4**: CSS-first configuration with semantic design tokens
- **Dark Mode**: Complete theme system with automatic and manual switching
- **Semantic Design System**: CSS custom properties for consistent theming
- **Enhanced Accessibility**: Improved a11y testing and compliance
- **Better Performance**: Optimized build times and runtime performance
````

---

## Detailed Tailwind CSS Integration Process

### Step 1: PostCSS Configuration

**Create PostCSS Configuration File**

```javascript
// .storybook/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: require('../apps/web/tailwind.config.js'),
    autoprefixer: {},
  },
};
```

**Install Required Dependencies**

```bash
npm install -D @storybook/addon-postcss postcss autoprefixer
```

### Step 2: Storybook Configuration Update

**Update Main Configuration**

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y', '@storybook/addon-viewport', '@storybook/addon-docs', '@storybook/addon-controls', '@storybook/addon-backgrounds', '@storybook/addon-measure', '@storybook/addon-outline', '@storybook/addon-highlight', '@storybook/addon-toolbars', '@storybook/addon-postcss'],
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
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    // Handle CSS imports
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
```

### Step 3: Preview Configuration

**Update Preview Configuration**

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../apps/web/app/global.css'; // Import global styles

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
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

### Step 4: Tailwind Configuration Sharing

**Create Shared Tailwind Configuration**

```javascript
// .storybook/tailwind.config.js
const sharedConfig = require('../apps/web/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [...sharedConfig.content, '../**/*.stories.@(js|jsx|ts|tsx)', '../.storybook/**/*.@(js|jsx|ts|tsx)'],
};
```

### Step 5: Global Styles Import

**Ensure Global CSS Contains Tailwind**

```css
/* apps/web/app/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Design system custom properties */
:root {
  --color-primary: #f59e0b;
  --color-secondary: #f3f4f6;
  --color-accent: #3b82f6;
  /* ... other design tokens */
}
```

### Step 6: Verification Testing

**Create Test Story to Verify Integration**

```typescript
// Test story to verify Tailwind classes work
export const TailwindTest: Story = {
  render: () => (
    <div className="bg-primary text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Tailwind CSS Test</h1>
      <p className="text-sm opacity-90">This should have proper styling</p>
      <div className="mt-4 flex gap-2">
        <button className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90">Test Button</button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This story tests that Tailwind CSS classes are properly loaded and styled in Storybook.',
      },
    },
  },
};
```

---

## Required Storybook Plugins

### Essential Plugins (Required)

1. **@storybook/addon-essentials** - Core functionality including docs, controls, actions, viewport, background, toolbar
2. **@storybook/addon-postcss** - PostCSS and Tailwind CSS support
3. **@storybook/addon-docs** - Documentation generation and MDX support
4. **@storybook/addon-controls** - Interactive controls for component props
5. **@storybook/addon-actions** - Event handling and logging

### Development Plugins (Recommended)

1. **@storybook/addon-interactions** - User interaction testing and user flows
2. **@storybook/addon-viewport** - Responsive design testing with device presets
3. **@storybook/addon-backgrounds** - Background testing for different themes
4. **@storybook/addon-measure** - Element measurement and layout tools
5. **@storybook/addon-outline** - Element outlines for layout debugging
6. **@storybook/addon-highlight** - Code highlighting and syntax support

### Accessibility & Testing (Important)

1. **@storybook/addon-a11y** - Accessibility testing and WCAG compliance checking
2. **@storybook/addon-testing** - Testing integration and test running
3. **@storybook/addon-jest** - Particle testing integration

### Advanced Plugins (Optional)

1. **@storybook/addon-toolbars** - Custom toolbars and global controls
2. **@storybook/addon-design-tokens** - Design token integration and documentation
3. **@storybook/addon-themes** - Theme switching and multiple theme support
4. **@storybook/addon-storysource** - Source code display in stories

---

## Implementation Checklist

### **Week 1: Foundation Setup**

- [ ] Update Storybook to latest version
- [ ] Install all required plugins
- [ ] Configure PostCSS for Tailwind support
- [ ] Set up global CSS import
- [ ] Test basic Storybook functionality
- [ ] Verify Tailwind CSS integration

### **Week 2: Component Documentation**

- [ ] Create Button component stories
- [ ] Create Card component stories
- [ ] Create Input component stories
- [ ] Create Navigation component stories
- [ ] Document all component variants
- [ ] Set up interactive controls

### **Week 3: Advanced Features**

- [ ] Configure accessibility testing
- [ ] Set up responsive design testing
- [ ] Configure interactive component testing
- [ ] Test all components thoroughly
- [ ] Document testing procedures
- [ ] Create testing examples

### **Week 4: Polish & Documentation**

- [ ] Optimize build performance
- [ ] Create comprehensive documentation
- [ ] Create team training materials
- [ ] Final testing and validation
- [ ] Team onboarding and training
- [ ] Project handoff and documentation

---

## Success Metrics

### **Technical Metrics**

- Storybook builds successfully with no errors
- Tailwind CSS classes render correctly in all stories
- Hot reloading works properly (< 2 seconds)
- Build time under 30 seconds
- All components documented with stories

### **Quality Metrics**

- 100% component coverage in Storybook
- All design system tokens properly displayed
- Interactive testing functional for all components
- Accessibility testing integrated and working
- Responsive design testing functional

### **Development Metrics**

- Developer onboarding time reduced by 50%
- Component development speed increased by 40%
- Design system consistency improved by 80%
- Bug reports reduced by 30%

---

## Risk Mitigation

### **Technical Risks**

1. **Next.js 15 Compatibility**: Use latest Storybook version and test thoroughly
2. **Tailwind CSS Integration**: Follow official documentation and test incrementally
3. **Build Performance**: Optimize webpack configuration and use proper caching
4. **Monorepo Complexity**: Configure proper path resolution and shared dependencies

### **Process Risks**

1. **Learning Curve**: Provide comprehensive documentation and training
2. **Maintenance Overhead**: Automate story generation where possible
3. **Version Conflicts**: Pin dependency versions and test updates carefully

---

## Deliverables

1. **Functional Storybook Environment**

   - Complete Storybook setup with Next.js 15 compatibility
   - Proper Tailwind CSS integration
   - All required plugins installed and configured

2. **Component Documentation**

   - Stories for all existing components
   - Interactive component playground
   - Design system documentation

3. **Development Workflow**

   - Hot reloading setup
   - Build optimization
   - Testing integration

4. **Team Training Materials**

   - Storybook usage guide
   - Component development workflow
   - Best practices documentation

5. **GitHub Pages Deployment**

   - Automated Storybook deployment pipeline
   - Live component library accessible to team
   - Branch-based deployment strategy
   - Custom domain configuration (optional)

6. **Updated README Documentation**
   - Comprehensive Storybook section with live links
   - Component development workflow documentation
   - Troubleshooting guides and quick start instructions
   - Links to deployed Storybook instances

This phase establishes the foundation for efficient component development and design system implementation, enabling the team to build consistent, well-documented components with proper styling integration, automated deployment to a live, accessible component library, and comprehensive documentation for team onboarding and reference.
