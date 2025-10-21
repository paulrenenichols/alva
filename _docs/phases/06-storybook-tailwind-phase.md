# Phase 6: Storybook & Tailwind Integration

**@fileoverview** Storybook and Tailwind CSS integration phase for Alva - setting up a robust component development environment with proper Tailwind CSS styling integration, Next.js 15 compatibility, and comprehensive component documentation.

---

## Phase Overview

**Goal**: Establish a fully functional Storybook development environment with proper Tailwind CSS integration, Next.js 15 compatibility, and comprehensive component documentation for efficient design system development

**Duration**: 3-4 weeks

**Deliverable**: Fully functional Storybook environment with proper Tailwind CSS integration, component documentation, and development workflow

**Success Criteria**:

- ✅ Storybook running with Next.js 15 compatibility
- ✅ Tailwind CSS styles properly building and displaying in Storybook
- ✅ All existing components documented in Storybook
- ✅ Design system components properly styled in Storybook
- ✅ Interactive component testing environment
- ✅ Responsive design testing capabilities
- ✅ Accessibility testing integration
- ✅ Component development workflow established

---

## Features & Tasks

### 1. Storybook Next.js 15 Integration

**Objective**: Set up Storybook with full Next.js 15 compatibility

**Tasks**:

1. **Storybook Installation & Configuration**

   - Install latest Storybook version compatible with Next.js 15
   - Configure Storybook for Nx monorepo structure
   - Set up proper TypeScript configuration
   - Configure webpack for Next.js compatibility

2. **Next.js 15 Compatibility Setup**

   - Configure Storybook to use Next.js 15 features
   - Set up proper React 19 compatibility
   - Configure App Router compatibility
   - Set up proper build optimization

3. **Monorepo Configuration**
   - Configure Storybook for Nx workspace
   - Set up proper path resolution
   - Configure shared library imports
   - Set up proper build targets

### 2. Tailwind CSS Integration

**Objective**: Ensure Tailwind CSS styles work perfectly in Storybook

**Tasks**:

1. **Tailwind Configuration**

   - Set up Tailwind CSS in Storybook
   - Configure PostCSS processing
   - Set up proper CSS purging
   - Configure design system tokens

2. **Style Processing**

   - Configure CSS imports in Storybook
   - Set up global styles import
   - Configure component-specific styles
   - Set up proper CSS build pipeline

3. **Design System Integration**
   - Import design system CSS
   - Configure custom CSS variables
   - Set up proper color system
   - Configure typography system

### 3. Component Documentation

**Objective**: Document all existing components in Storybook

**Tasks**:

1. **Component Stories Creation**

   - Create stories for all existing components
   - Set up proper story structure
   - Configure component variants
   - Set up proper controls and actions

2. **Design System Documentation**

   - Document color system
   - Document typography system
   - Document spacing system
   - Document component patterns

3. **Interactive Documentation**
   - Set up interactive component testing
   - Configure component playground
   - Set up responsive testing
   - Configure accessibility testing

### 4. Development Workflow

**Objective**: Establish efficient component development workflow

**Tasks**:

1. **Development Tools Setup**

   - Configure hot reloading
   - Set up proper error handling
   - Configure build optimization
   - Set up proper debugging tools

2. **Testing Integration**

   - Integrate unit testing in Storybook
   - Set up visual regression testing
   - Configure accessibility testing
   - Set up responsive testing

3. **Build & Deployment**
   - Configure Storybook build process
   - Set up static deployment
   - Configure CI/CD integration
   - Set up proper caching

---

## Technical Implementation

### Storybook Configuration

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

### Tailwind CSS Integration

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

### PostCSS Configuration

```javascript
// .storybook/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: require('../apps/web/tailwind.config.js'),
    autoprefixer: {},
  },
};
```

### Component Story Example

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
        component: 'A versatile button component following our design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'The visual style variant of the button',
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

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
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

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    variant: 'primary',
    children: 'Click me!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Try clicking the button to see the interaction.',
      },
    },
  },
};
```

---

## Detailed Tailwind CSS Integration Process

### 1. PostCSS Configuration Setup

**Step 1: Install Required Dependencies**

```bash
npm install -D @storybook/addon-postcss postcss autoprefixer
```

**Step 2: Create PostCSS Configuration**

```javascript
// .storybook/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: require('../apps/web/tailwind.config.js'),
    autoprefixer: {},
  },
};
```

**Step 3: Configure Storybook to Use PostCSS**

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-postcss',
    // ... other addons
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
};
```

### 2. Global Styles Import

**Step 1: Import Global CSS in Preview**

```typescript
// .storybook/preview.ts
import '../apps/web/app/global.css';
```

**Step 2: Ensure Global CSS Contains Tailwind**

```css
/* apps/web/app/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Tailwind Configuration Sharing

**Step 1: Use Shared Tailwind Config**

```javascript
// .storybook/tailwind.config.js
const sharedConfig = require('../apps/web/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [...sharedConfig.content, '../**/*.stories.@(js|jsx|ts|tsx)', '../.storybook/**/*.@(js|jsx|ts|tsx)'],
};
```

### 4. Component Styling Verification

**Step 1: Create Test Story**

```typescript
// Test story to verify Tailwind classes work
export const TailwindTest: Story = {
  render: () => (
    <div className="bg-primary text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Tailwind CSS Test</h1>
      <p className="text-sm opacity-90">This should have proper styling</p>
    </div>
  ),
};
```

---

## Required Storybook Plugins

### Essential Plugins

1. **@storybook/addon-essentials** - Core functionality
2. **@storybook/addon-postcss** - PostCSS and Tailwind support
3. **@storybook/addon-docs** - Documentation generation
4. **@storybook/addon-controls** - Interactive controls
5. **@storybook/addon-actions** - Event handling

### Development Plugins

1. **@storybook/addon-viewport** - Responsive testing
2. **@storybook/addon-backgrounds** - Background testing
3. **@storybook/addon-measure** - Measurement tools
4. **@storybook/addon-outline** - Element outlines
5. **@storybook/addon-highlight** - Code highlighting

### Accessibility & Testing

1. **@storybook/addon-a11y** - Accessibility testing
2. **@storybook/addon-interactions** - Interaction testing
3. **@storybook/addon-testing** - Testing integration

### Advanced Plugins

1. **@storybook/addon-toolbars** - Custom toolbars
2. **@storybook/addon-design-tokens** - Design token integration
3. **@storybook/addon-themes** - Theme switching

---

## Implementation Timeline

### Week 1: Foundation Setup

- **Days 1-2**: Storybook installation and basic configuration
- **Days 3-4**: Tailwind CSS integration setup
- **Day 5**: Initial testing and verification

### Week 2: Component Documentation

- **Days 1-2**: Create stories for existing components
- **Days 3-4**: Set up design system documentation
- **Day 5**: Interactive component testing setup

### Week 3: Advanced Features

- **Days 1-2**: Accessibility testing integration
- **Days 3-4**: Responsive design testing setup
- **Day 5**: Performance optimization

### Week 4: Polish & Documentation

- **Days 1-2**: Final testing and bug fixes
- **Days 3-4**: Documentation completion
- **Day 5**: Team training and handoff

---

## Success Metrics

### Technical Metrics

- ✅ Storybook builds successfully with no errors
- ✅ Tailwind CSS classes render correctly in all stories
- ✅ Hot reloading works properly
- ✅ Build time under 30 seconds
- ✅ All components documented with stories

### Quality Metrics

- ✅ 100% component coverage in Storybook
- ✅ All design system tokens properly displayed
- ✅ Interactive testing functional for all components
- ✅ Accessibility testing integrated and working
- ✅ Responsive design testing functional

### Development Metrics

- ✅ Developer onboarding time reduced by 50%
- ✅ Component development speed increased by 40%
- ✅ Design system consistency improved by 80%
- ✅ Bug reports reduced by 30%

---

## Risk Mitigation

### Technical Risks

1. **Next.js 15 Compatibility**: Use latest Storybook version and test thoroughly
2. **Tailwind CSS Integration**: Follow official documentation and test incrementally
3. **Build Performance**: Optimize webpack configuration and use proper caching
4. **Monorepo Complexity**: Configure proper path resolution and shared dependencies

### Process Risks

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

This phase establishes the foundation for efficient component development and design system implementation, enabling the team to build consistent, well-documented components with proper styling integration.
