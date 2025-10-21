# Component Development Guide

## Overview

This guide covers the complete process of developing components using our Storybook 9 setup with Tailwind CSS v4 and semantic design system.

## Development Workflow

### 1. Planning Phase

Before creating a component, consider:

- **Purpose**: What problem does this component solve?
- **Variants**: What different states/styles are needed?
- **Props**: What props will make this component flexible?
- **Accessibility**: How will users interact with this component?
- **Responsive**: How should it behave on different screen sizes?

### 2. Component Creation

#### File Structure

```
apps/web/components/ui/
├── YourComponent.tsx          # Main component file
├── YourComponent.stories.tsx  # Storybook stories
└── YourComponent.test.tsx     # Unit tests (optional)
```

#### Component Template

```tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface YourComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function YourComponent({ variant = 'primary', size = 'md', disabled = false, className, children, ...props }: YourComponentProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-hover active:bg-primary-active',
    secondary: 'bg-bg-secondary text-text-primary border border-border-default hover:bg-bg-tertiary',
    ghost: 'text-text-primary hover:bg-bg-secondary',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </div>
  );
}
```

### 3. Story Creation

#### Story Template

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
        component: 'A brief description of what this component does and when to use it.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
      description: 'The visual style variant using semantic color tokens',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the component',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the component is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Component',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Component',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Component',
  },
};

// Size variations
export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <YourComponent variant="primary" size="sm">
        Small
      </YourComponent>
      <YourComponent variant="primary" size="md">
        Medium
      </YourComponent>
      <YourComponent variant="primary" size="lg">
        Large
      </YourComponent>
    </div>
  ),
};

// State variations
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <YourComponent variant="primary">Default</YourComponent>
        <YourComponent variant="primary" disabled>
          Disabled
        </YourComponent>
      </div>
      <div className="flex gap-4">
        <YourComponent variant="secondary">Default</YourComponent>
        <YourComponent variant="secondary" disabled>
          Disabled
        </YourComponent>
      </div>
    </div>
  ),
};

// Theme comparison
export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Light Mode</h3>
        <div className="flex gap-4">
          <YourComponent variant="primary">Primary</YourComponent>
          <YourComponent variant="secondary">Secondary</YourComponent>
          <YourComponent variant="ghost">Ghost</YourComponent>
        </div>
      </div>
      <div className="dark">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Dark Mode</h3>
        <div className="flex gap-4">
          <YourComponent variant="primary">Primary</YourComponent>
          <YourComponent variant="secondary">Secondary</YourComponent>
          <YourComponent variant="ghost">Ghost</YourComponent>
        </div>
      </div>
    </div>
  ),
};

// Accessibility test
export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
        <p className="text-text-secondary mb-4">Use Tab to navigate between components</p>
        <div className="flex gap-4">
          <YourComponent variant="primary">First</YourComponent>
          <YourComponent variant="secondary">Second</YourComponent>
          <YourComponent variant="ghost">Third</YourComponent>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
        <YourComponent variant="primary" aria-label="Action button">
          Action
        </YourComponent>
      </div>
    </div>
  ),
};

// Responsive test
export const ResponsiveTest: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <YourComponent variant="primary" className="w-full">
        Full Width Primary
      </YourComponent>
      <YourComponent variant="secondary" className="w-full">
        Full Width Secondary
      </YourComponent>
      <YourComponent variant="ghost" className="w-full">
        Full Width Ghost
      </YourComponent>
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};
```

### 4. Testing Checklist

Before considering a component complete, verify:

#### Functionality

- [ ] All variants render correctly
- [ ] All sizes work properly
- [ ] Disabled state functions correctly
- [ ] Props are properly typed
- [ ] Default values work as expected

#### Styling

- [ ] Uses semantic color tokens
- [ ] Works in both light and dark modes
- [ ] Responsive behavior is correct
- [ ] Hover and focus states work
- [ ] Transitions are smooth

#### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader support is adequate
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] ARIA labels are appropriate

#### Documentation

- [ ] Story descriptions are clear
- [ ] All variants are documented
- [ ] Usage examples are provided
- [ ] Theme comparison is included
- [ ] Accessibility features are demonstrated

### 5. Integration

#### Adding to Index

Update the component index file:

```tsx
// apps/web/components/ui/index.ts
export { YourComponent } from './YourComponent';
```

#### Using in Application

```tsx
import { YourComponent } from '@/components/ui';

function MyPage() {
  return (
    <div>
      <YourComponent variant="primary" size="lg">
        Call to Action
      </YourComponent>
    </div>
  );
}
```

## Design System Guidelines

### Color Usage

Always use semantic color tokens:

```tsx
// ✅ Good - Semantic tokens
className = 'bg-primary text-text-inverse';

// ❌ Bad - Hardcoded colors
className = 'bg-yellow-500 text-white';
```

### Spacing

Use consistent spacing scale:

```tsx
// ✅ Good - Consistent spacing
className = 'p-4 m-2 gap-4';

// ❌ Bad - Inconsistent spacing
className = 'p-3.5 m-1.5 gap-3';
```

### Typography

Use semantic text classes:

```tsx
// ✅ Good - Semantic text
className = 'text-text-primary text-lg font-semibold';

// ❌ Bad - Hardcoded text
className = 'text-gray-900 text-lg font-semibold';
```

### Responsive Design

Use responsive utilities:

```tsx
// ✅ Good - Responsive
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

// ❌ Bad - Fixed layout
className = 'grid grid-cols-3';
```

## Common Patterns

### Compound Components

For complex components, use compound component pattern:

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return <div className={cn('bg-bg-elevated rounded-lg border border-border-subtle', className)}>{children}</div>;
}

function CardHeader({ children, className }: CardProps) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>;
}

function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-6 py-4', className)}>{children}</div>;
}

function CardFooter({ children, className }: CardProps) {
  return <div className={cn('p-6 pt-4', className)}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
```

### Forwarding Refs

For components that need ref forwarding:

```tsx
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'primary', className, ...props }, ref) => {
  return <button ref={ref} className={cn('inline-flex items-center justify-center rounded-md font-medium transition-colors', variant === 'primary' ? 'bg-primary text-text-inverse hover:bg-primary-hover' : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary', className)} {...props} />;
});

Button.displayName = 'Button';
```

### Polymorphic Components

For components that can render as different elements:

```tsx
interface PolymorphicProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export function PolymorphicComponent({ as: Component = 'div', children, className }: PolymorphicProps) {
  return <Component className={cn('base-styles', className)}>{children}</Component>;
}
```

## Performance Considerations

### Lazy Loading

For large components, consider lazy loading:

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

Use React.memo for expensive components:

```tsx
import { memo } from 'react';

export const ExpensiveComponent = memo(function ExpensiveComponent({ data }: { data: any[] }) {
  // Expensive rendering logic
  return <div>{/* rendered content */}</div>;
});
```

### Bundle Size

Keep components focused and small:

- Avoid large dependencies
- Use tree-shaking friendly imports
- Split complex components into smaller pieces
- Use dynamic imports for optional features

This guide provides a comprehensive approach to component development using our Storybook 9 setup with Tailwind CSS v4 and semantic design system.
