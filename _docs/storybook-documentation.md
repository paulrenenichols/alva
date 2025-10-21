# Storybook 9 & Tailwind CSS v4 Documentation

## Overview

This document provides comprehensive guidance for using Storybook 9 with Tailwind CSS v4 in the Alva project. Our component library is built with modern web standards, semantic design tokens, and full dark mode support.

## Quick Start

### Running Storybook Locally

```bash
# Start Storybook development server
pnpm nx run web:storybook

# Build Storybook for production
cd apps/web && npx storybook build
```

### Accessing the Component Library

- **Local Development**: http://localhost:9009
- **Production Deployment**: https://paulrenenichols.github.io/alva/ (after GitHub Pages setup)

## Design System

### Semantic Color System

Our design system uses semantic color tokens defined as CSS custom properties:

```css
/* Primary Colors */
--color-primary: #ffd700; /* Gold - Primary actions */
--color-primary-hover: #ffe44d; /* Lighter gold for hover */
--color-primary-active: #e6c200; /* Darker gold for active */

/* Text Colors */
--color-text-primary: #1f1f1f; /* Main text */
--color-text-secondary: #6f6f6f; /* Secondary text */
--color-text-inverse: #ffffff; /* Text on colored backgrounds */

/* Background Colors */
--color-bg-primary: #ffffff; /* Main background */
--color-bg-secondary: #fafafa; /* Secondary background */
--color-bg-elevated: #ffffff; /* Elevated surfaces */
```

### Dark Mode Support

The design system automatically adapts to dark mode:

```css
.dark {
  --color-text-primary: #fafafa;
  --color-text-secondary: #a0a0a0;
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  /* ... other dark mode tokens */
}
```

### Using Semantic Classes

Instead of hardcoded colors, use semantic Tailwind classes:

```tsx
// ✅ Good - Semantic classes
<button className="bg-primary text-text-inverse hover:bg-primary-hover">
  Primary Button
</button>

// ❌ Avoid - Hardcoded colors
<button className="bg-yellow-500 text-black hover:bg-yellow-400">
  Primary Button
</button>
```

## Component Development

### Creating New Components

1. **Create the component file**:

   ```tsx
   // components/ui/NewComponent.tsx
   import { cn } from '@/lib/utils';

   interface NewComponentProps {
     className?: string;
     children: React.ReactNode;
   }

   export function NewComponent({ className, children }: NewComponentProps) {
     return <div className={cn('base-styles', className)}>{children}</div>;
   }
   ```

2. **Create the story file**:

   ```tsx
   // components/ui/NewComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { NewComponent } from './NewComponent';

   const meta: Meta<typeof NewComponent> = {
     title: 'Design System/NewComponent',
     component: NewComponent,
     parameters: {
       layout: 'centered',
       docs: {
         description: {
           component: 'Description of what this component does.',
         },
       },
     },
     tags: ['autodocs'],
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       children: 'Default content',
     },
   };
   ```

### Story Best Practices

1. **Include multiple variants**:

   ```tsx
   export const AllVariants: Story = {
     render: () => (
       <div className="space-y-4">
         <NewComponent variant="primary">Primary</NewComponent>
         <NewComponent variant="secondary">Secondary</NewComponent>
         <NewComponent variant="ghost">Ghost</NewComponent>
       </div>
     ),
   };
   ```

2. **Add theme comparison**:

   ```tsx
   export const ThemeComparison: Story = {
     render: () => (
       <div className="space-y-8">
         <div>
           <h3 className="text-lg font-semibold mb-4 text-text-primary">Light Mode</h3>
           <NewComponent>Light mode content</NewComponent>
         </div>
         <div className="dark">
           <h3 className="text-lg font-semibold mb-4 text-text-primary">Dark Mode</h3>
           <NewComponent>Dark mode content</NewComponent>
         </div>
       </div>
     ),
   };
   ```

3. **Include accessibility testing**:
   ```tsx
   export const AccessibilityTest: Story = {
     render: () => (
       <div className="space-y-4">
         <div>
           <h3 className="text-lg font-semibold mb-2 text-text-primary">Accessibility Features</h3>
           <ul className="text-text-secondary space-y-1">
             <li>• Keyboard navigation support</li>
             <li>• Screen reader friendly</li>
             <li>• Proper ARIA attributes</li>
           </ul>
         </div>
         <NewComponent>Accessible component</NewComponent>
       </div>
     ),
   };
   ```

## Theme Development

### Adding New Color Tokens

1. **Update CSS custom properties** in `apps/web/app/global.css`:

   ```css
   :root {
     --color-new-token: #your-color;
   }

   .dark {
     --color-new-token: #your-dark-color;
   }
   ```

2. **Add to Tailwind config** in `apps/web/tailwind.config.js`:

   ```javascript
   colors: {
     'new-token': 'var(--color-new-token)',
   }
   ```

3. **Update Storybook preview** in `apps/web/.storybook/preview.tsx`:
   ```typescript
   // Add to the CSS custom properties injection
   --color-new-token: #your-color;
   ```

### Testing Theme Changes

Use the theme toggle in Storybook to test both light and dark modes:

1. Open Storybook
2. Use the theme toggle in the toolbar
3. Verify components adapt correctly
4. Test with different component variants

## Accessibility Guidelines

### WCAG Compliance

All components should meet WCAG 2.1 AA standards:

- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators

### Testing Accessibility

1. **Use Storybook's a11y addon**:

   - Check the Accessibility tab in each story
   - Review violations and fix issues

2. **Manual testing**:

   - Navigate using only keyboard (Tab, Enter, Space, Arrow keys)
   - Test with screen reader software
   - Verify color contrast ratios

3. **Automated testing**:
   ```bash
   # Run accessibility tests
   pnpm nx run web:test
   ```

## Performance Optimization

### Build Optimization

- **Tree shaking**: Unused CSS is automatically removed
- **Code splitting**: Components are loaded on demand
- **Asset optimization**: Images and fonts are optimized

### Development Performance

- **Hot reloading**: Changes reflect immediately
- **Fast builds**: Optimized webpack configuration
- **Caching**: Dependencies are cached for faster builds

## Troubleshooting

### Common Issues

1. **Styles not applying**:

   - Check if CSS custom properties are defined
   - Verify Tailwind classes are correct
   - Ensure global CSS is imported

2. **Dark mode not working**:

   - Check if `darkMode: 'class'` is set in Tailwind config
   - Verify `.dark` class is being applied
   - Test theme toggle functionality

3. **Build errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Check for TypeScript errors
   - Verify all imports are correct

### Getting Help

- **Storybook Documentation**: https://storybook.js.org/docs
- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs
- **Project Issues**: Create an issue in the repository

## Deployment

### GitHub Pages Setup

The Storybook is automatically deployed to GitHub Pages:

1. **Automatic deployment** on push to `main` or `develop` branches
2. **Manual deployment** via GitHub Actions
3. **Custom domain** support (optional)

### Deployment URLs

- **Main Branch**: https://paulrenenichols.github.io/alva/
- **Develop Branch**: https://paulrenenichols.github.io/alva/develop/

## Team Workflow

### Development Process

1. **Create feature branch** from `main`
2. **Develop component** with stories
3. **Test locally** with Storybook
4. **Create pull request** with component documentation
5. **Review and merge** to main branch
6. **Automatic deployment** to GitHub Pages

### Code Review Checklist

- [ ] Component follows semantic design system
- [ ] Stories include all variants and states
- [ ] Accessibility features are implemented
- [ ] Dark mode support is working
- [ ] Documentation is comprehensive
- [ ] No TypeScript errors
- [ ] All tests pass

## Resources

- **Storybook 9 Documentation**: https://storybook.js.org/docs
- **Tailwind CSS v4 Documentation**: https://tailwindcss.com/docs
- **Design System Guidelines**: Internal documentation
- **Accessibility Guidelines**: WCAG 2.1 AA standards
- **Component Library**: https://paulrenenichols.github.io/alva/

---

_This documentation is maintained by the Alva development team. For updates or questions, please create an issue in the repository._
