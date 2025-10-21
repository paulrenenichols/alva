# Storybook 9 & Tailwind CSS v4 Usage Guide

## Overview

This guide covers how to use our Storybook 9 setup with Tailwind CSS v4 and semantic design system for component development and testing.

## Quick Start

### Running Storybook Locally

```bash
# Start Storybook development server
pnpm nx run web:storybook

# Build static Storybook for deployment
pnpm nx run web:build-storybook
```

### Accessing Storybook

- **Local Development**: http://localhost:4400
- **Production Deployment**: https://paulrenenichols.github.io/alva/
- **Staging Deployment**: https://paulrenenichols.github.io/alva/develop/

## Design System

### Semantic Color System

Our design system uses semantic color tokens that automatically adapt to light and dark themes:

```css
/* Primary Colors */
bg-primary          /* Primary background */
bg-secondary        /* Secondary background */
bg-tertiary         /* Tertiary background */
bg-elevated         /* Elevated surfaces */

/* Text Colors */
text-primary        /* Primary text */
text-secondary      /* Secondary text */
text-tertiary       /* Tertiary text */
text-inverse        /* Inverse text (white/black) */

/* Brand Colors */
bg-primary          /* Gold brand color */
bg-secondary        /* Blue accent color */
bg-success          /* Green success color */
bg-danger           /* Red error color */
bg-warning          /* Yellow warning color */
bg-info             /* Cyan info color */

/* Border Colors */
border-subtle       /* Subtle borders */
border-default      /* Default borders */
border-strong       /* Strong borders */
border-focus        /* Focus indicators */
```

### Dark Mode Support

The design system automatically supports both light and dark modes:

- **Automatic**: Respects system preference (`prefers-color-scheme`)
- **Manual**: Use the theme toggle in Storybook toolbar
- **CSS Classes**: Add `.dark` class to any element for manual dark mode

## Component Development

### Creating New Components

1. **Create Component File**: `apps/web/components/ui/YourComponent.tsx`
2. **Use Semantic Classes**: Always use semantic color tokens
3. **Create Stories**: `apps/web/components/ui/YourComponent.stories.tsx`
4. **Test Themes**: Verify component works in both light and dark modes

### Example Component

```tsx
import { cn } from '@/lib/utils';

interface YourComponentProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

export function YourComponent({ variant = 'primary', className, children }: YourComponentProps) {
  return <div className={cn('p-4 rounded-md transition-colors', variant === 'primary' ? 'bg-primary text-text-inverse' : 'bg-bg-secondary text-text-primary', className)}>{children}</div>;
}
```

### Example Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Design System/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of your component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description: 'The visual style variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary variant',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Light Mode</h3>
        <YourComponent variant="primary">Light Mode</YourComponent>
      </div>
      <div className="dark">
        <h3 className="text-lg font-semibold mb-2 text-text-primary">Dark Mode</h3>
        <YourComponent variant="primary">Dark Mode</YourComponent>
      </div>
    </div>
  ),
};
```

## Testing Features

### Accessibility Testing

Storybook includes built-in accessibility testing:

- **Color Contrast**: Automatic WCAG compliance checking
- **Keyboard Navigation**: Test Tab/Enter/Space navigation
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Management**: Visual focus indicators

### Responsive Testing

Test components across different screen sizes:

- **Mobile**: 375px width
- **Tablet**: 768px width
- **Desktop**: 1440px width

Use the viewport addon in Storybook toolbar to test responsive behavior.

### Interactive Testing

Test user interactions and state management:

- **Button Clicks**: Test click handlers and state changes
- **Form Interactions**: Test form validation and submission
- **Hover Effects**: Test hover states and transitions
- **Theme Switching**: Test theme toggle functionality

## Best Practices

### Component Design

1. **Use Semantic Classes**: Always use semantic color tokens instead of hardcoded colors
2. **Support Dark Mode**: Ensure components work in both light and dark themes
3. **Accessibility First**: Include proper ARIA labels and keyboard navigation
4. **Responsive Design**: Test components across different screen sizes

### Story Creation

1. **Comprehensive Coverage**: Create stories for all variants and states
2. **Interactive Controls**: Use Storybook controls for prop testing
3. **Theme Testing**: Include light/dark mode examples
4. **Accessibility Examples**: Show proper ARIA usage
5. **Responsive Examples**: Demonstrate responsive behavior

### Performance

1. **Lazy Loading**: Components are loaded on demand
2. **Tree Shaking**: Unused code is automatically removed
3. **Caching**: Storybook uses aggressive caching for fast rebuilds
4. **Hot Reloading**: Changes are reflected immediately

## Troubleshooting

### Common Issues

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

### Getting Help

- **Documentation**: Check Storybook 9 and Tailwind CSS v4 docs
- **Issues**: Report bugs in the project repository
- **Team Chat**: Ask questions in team communication channels
- **Code Review**: Request reviews for new components and stories

## Advanced Features

### Custom Addons

Storybook includes several useful addons:

- **Essentials**: Core functionality (docs, controls, actions)
- **A11y**: Accessibility testing
- **Viewport**: Responsive design testing
- **Interactions**: User interaction testing
- **Measure**: Element measurement tools
- **Outline**: Layout debugging

### Performance Monitoring

Monitor Storybook performance:

- **Build Time**: Track build performance in CI/CD
- **Bundle Size**: Monitor bundle size growth
- **Load Time**: Test initial load performance
- **Hot Reload**: Measure development experience

### Custom Configuration

Extend Storybook configuration:

- **Webpack**: Custom webpack configuration in `main.ts`
- **PostCSS**: Tailwind CSS processing configuration
- **TypeScript**: Type checking and documentation generation
- **Themes**: Custom theme configurations

This guide provides everything needed to effectively use our Storybook 9 setup with Tailwind CSS v4 and semantic design system for component development and testing.
