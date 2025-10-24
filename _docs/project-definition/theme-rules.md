# Alva Theme & Design System - Semantic Design System

**@fileoverview** Complete semantic design system specification for the Alva marketing platform, defining semantic colors, typography, spacing, and visual language using CSS custom properties for consistent theming across light and dark modes.

---

## Brand Identity

### Name

**Alva** — Derived from Latin "albus" (white/light), symbolizing clarity and illumination

### Tagline

_"Bringing your marketing into the light."_

### Mission

Provide small business owners with a custom marketing plan and a skilled, always-on marketing director at a fraction of the cost.

### Brand Personality

- **Sharp**: Cutting through marketing noise with precision
- **Confident**: Decisive recommendations, never wishy-washy
- **Warm**: Approachable and encouraging, not clinical
- **Direct**: Clear communication, no fluff

### Core Values

1. **Clarity** — Eliminate confusion, provide direction
2. **Precision** — Targeted strategies, not generic advice
3. **Empowerment** — Users feel in control, not dependent
4. **Adaptation** — Evolves with business needs

---

## Semantic Design System Overview

### Philosophy

The Alva design system uses **semantic naming** instead of color-specific naming to ensure consistent theming across light and dark modes. All design tokens are defined as CSS custom properties for maximum flexibility and maintainability.

### Key Principles

1. **Semantic Over Literal**: Use `primary`, `secondary`, `success` instead of `gold`, `blue`, `green`
2. **CSS Custom Properties**: All tokens defined as CSS variables for easy theming
3. **Theme Agnostic**: Components work seamlessly in light and dark modes
4. **Consistent Branding**: Brand colors (gold) remain consistent across themes
5. **Accessibility First**: All color combinations meet WCAG AA standards

---

## Semantic Color System

### Primary Colors (Brand Identity)

#### Primary (Gold - Brand Color)

```css
--color-primary: #ffd700;
--color-primary-hover: #ffe44d;
--color-primary-active: #e6c200;
--color-primary-muted: #fff4cc;
```

**Usage**:

- Primary CTAs (buttons, links)
- Active states (selected items, current page)
- Progress indicators
- Attention-grabbing elements (Quick Win card)
- Alva's "thinking" pulse animation
- Highlights and accents

**Accessibility**:

- ⚠️ Does not pass WCAG AA for body text on white
- ✅ Use for large text only (18px+, headings)
- ✅ Passes AA for icons and UI elements (3:1 ratio)

#### Secondary (Blue - Navigation & Info)

```css
--color-secondary: #007bff;
--color-secondary-hover: #4da3ff;
--color-secondary-active: #0056b3;
--color-secondary-muted: #cce5ff;
```

**Usage**:

- Secondary actions (back links, info links)
- Informational states
- Links in body text
- Icons for information/help

**Accessibility**:

- ✅ Passes WCAG AA for all text sizes (4.5:1 on white)

### Semantic State Colors

#### Success (Green)

```css
--color-success: #28a745;
--color-success-hover: #5cb85c;
--color-success-active: #1e7e34;
--color-success-muted: #d4edda;
```

**Usage**:

- Success messages
- Completed states (tasks, onboarding)
- Positive metrics/trends
- Verification badges

#### Danger (Red)

```css
--color-danger: #d32f2f;
--color-danger-hover: #ef5350;
--color-danger-active: #b71c1c;
--color-danger-muted: #f8d7da;
```

**Usage**:

- Error messages
- Destructive actions (delete, remove)
- Validation failures
- Warning indicators

#### Warning (Yellow)

```css
--color-warning: #ffc107;
--color-warning-hover: #ffd54f;
--color-warning-active: #e0a800;
--color-warning-muted: #fff3cd;
```

**Usage**:

- Warning messages
- Caution states
- Important notices
- Attention-grabbing alerts

#### Info (Cyan)

```css
--color-info: #17a2b8;
--color-info-hover: #5dade2;
--color-info-active: #138496;
--color-info-muted: #d1ecf1;
```

**Usage**:

- Informational content
- Help text
- Neutral alerts
- General notifications

---

## Theme-Aware Color System

### Light Mode (Default)

```css
/* Text Colors */
--color-text-primary: #1f1f1f;
--color-text-secondary: #6f6f6f;
--color-text-tertiary: #a0a0a0;
--color-text-inverse: #ffffff;

/* Background Colors */
--color-bg-primary: #ffffff;
--color-bg-secondary: #fafafa;
--color-bg-tertiary: #f0f0f0;
--color-bg-elevated: #ffffff;

/* Border Colors */
--color-border-subtle: #e5e5e5;
--color-border-default: #cccccc;
--color-border-strong: #a0a0a0;
--color-border-focus: #ffd700;
```

### Dark Mode

```css
/* Text Colors */
--color-text-primary: #fafafa;
--color-text-secondary: #a0a0a0;
--color-text-tertiary: #6f6f6f;
--color-text-inverse: #1f1f1f;

/* Background Colors */
--color-bg-primary: #0f172a;
--color-bg-secondary: #1e293b;
--color-bg-tertiary: #334155;
--color-bg-elevated: #1e293b;

/* Border Colors */
--color-border-subtle: #334155;
--color-border-default: #475569;
--color-border-strong: #64748b;
--color-border-focus: #ffd700;

/* Brand Colors (Consistent Across Themes) */
--color-primary: #ffd700;
--color-primary-hover: #ffe44d;
--color-primary-active: #e6c200;
--color-primary-muted: #332f00;

/* Adjusted Semantic Colors for Dark Mode */
--color-secondary: #3b82f6;
--color-success: #10b981;
--color-danger: #ef4444;
--color-warning: #f59e0b;
--color-info: #06b6d4;
```

---

## Typography System

### Font Family

```css
--font-family-sans: 'Inter', 'Helvetica', 'Arial', sans-serif;
```

### Font Sizes

```css
--font-size-xs: 12px;
--font-size-sm: 13px;
--font-size-base: 14px;
--font-size-md: 16px;
--font-size-lg: 18px;
--font-size-xl: 22px;
--font-size-2xl: 28px;
--font-size-3xl: 36px;
```

### Semantic Typography Classes

#### Headings

```css
.heading-hero {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text-primary);
}

.heading-page {
  font-size: var(--font-size-xl);
  font-weight: 700;
  line-height: 1.375;
  color: var(--color-text-primary);
}

.heading-section {
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: 1.375;
  color: var(--color-text-primary);
}
```

#### Body Text

```css
.body-default {
  font-size: var(--font-size-base);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.body-large {
  font-size: var(--font-size-md);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.body-small {
  font-size: var(--font-size-sm);
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-text-secondary);
}
```

---

## Spacing System

### Base Unit

**4px** — All spacing is a multiple of 4px for consistency

### Spacing Scale

```css
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
```

---

## Border & Radius System

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Border Widths

```css
--border-width-thin: 1px;
--border-width-default: 1px;
--border-width-thick: 2px;
--border-width-heavy: 3px;
```

---

## Shadow & Elevation System

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-focus: 0 0 0 3px rgba(255, 215, 0, 0.3);
--shadow-error: 0 0 0 3px rgba(211, 47, 47, 0.2);
```

---

## Transition System

### Duration Scale

```css
--transition-fast: 100ms;
--transition-normal: 150ms;
--transition-moderate: 200ms;
--transition-slow: 300ms;
--transition-slower: 500ms;
```

---

## Component Theming Examples

### Button Variants (Semantic Classes)

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid transparent;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-primary:active {
  background-color: var(--color-primary-active);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}

.btn-secondary:hover {
  background-color: var(--color-bg-tertiary);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  background-color: var(--color-bg-secondary);
}

/* Destructive Button */
.btn-destructive {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
  border: 1px solid transparent;
}

.btn-destructive:hover {
  background-color: var(--color-danger-hover);
}
```

### Card Variants (Semantic Classes)

```css
/* Default Card */
.card-default {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  box-shadow: none;
}

/* Elevated Card */
.card-elevated {
  background-color: var(--color-bg-elevated);
  border: 1px solid transparent;
  box-shadow: var(--shadow-md);
}

/* Interactive Card */
.card-interactive {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border-subtle);
  transition: all var(--transition-normal);
}

.card-interactive:hover {
  background-color: var(--color-bg-secondary);
  box-shadow: var(--shadow-md);
}

/* Highlighted Card */
.card-highlighted {
  background-color: var(--color-bg-elevated);
  border-left: 4px solid var(--color-primary);
  border-top: 1px solid var(--color-border-subtle);
  border-right: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}
```

---

## Dark Mode Implementation

### Automatic Detection

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode color overrides */
  }
}
```

### Manual Toggle

```css
.dark {
  /* Dark mode color overrides */
}
```

### Theme Toggle Component

```typescript
// Theme toggle implementation
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
};
```

---

## Usage Guidelines

### DO's ✅

- Use semantic color names (`primary`, `secondary`, `success`, `danger`)
- Use CSS custom properties for all design tokens
- Test components in both light and dark modes
- Ensure sufficient contrast ratios (4.5:1 for body text)
- Use consistent spacing multiples of 4px
- Maintain brand color consistency across themes

### DON'Ts ❌

- Don't use literal color names (`gold`, `blue`, `green`)
- Don't hardcode color values in components
- Don't assume light mode only
- Don't use color alone to convey meaning
- Don't vary brand colors across themes
- Don't forget to test accessibility in both modes

---

## Migration from Tailwind CSS 3 to 4

### Before (Tailwind CSS 3)

```css
/* Old @tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Literal color naming */
.btn-gold {
  background-color: #ffd700;
}
.btn-blue {
  background-color: #007bff;
}
.text-gray-600 {
  color: #6f6f6f;
}
```

### After (Tailwind CSS 4)

```css
/* New @import syntax */
@import 'tailwindcss';

/* Semantic naming with CSS custom properties */
.btn-primary {
  background-color: var(--color-primary);
}
.btn-secondary {
  background-color: var(--color-secondary);
}
.text-secondary {
  color: var(--color-text-secondary);
}
```

### Benefits of Tailwind CSS 4 + Semantic System

1. **Theme Consistency**: Components automatically adapt to theme changes
2. **Maintainability**: Change colors in one place (CSS custom properties)
3. **Accessibility**: Easier to ensure proper contrast ratios
4. **Scalability**: Easy to add new themes or brand variations
5. **Developer Experience**: Clear, meaningful class names
6. **Performance**: Tailwind CSS 4's improved CSS generation
7. **Modern Architecture**: Better integration with CSS custom properties
8. **Future-Proof**: Aligned with modern CSS standards

---

## Tailwind CSS 4 Best Practices

### Key Features & Changes

1. **New Import Syntax**: Use `@import 'tailwindcss'` instead of `@tailwind` directives
2. **CSS Custom Properties**: Direct integration with CSS variables in configuration
3. **Improved Performance**: Faster CSS generation and smaller bundle sizes
4. **Better PostCSS Integration**: Enhanced PostCSS plugin architecture
5. **Modern CSS Standards**: Better support for modern CSS features

### Implementation Guidelines

#### ✅ DO's (Tailwind CSS 4)

- Use `@import 'tailwindcss'` in your CSS files
- Define colors using CSS custom properties: `var(--color-primary)`
- Use semantic naming: `primary`, `secondary`, `success`, `danger`
- Leverage CSS custom properties for dynamic theming
- Use the new PostCSS plugin: `@tailwindcss/postcss`

#### ❌ DON'Ts (Avoid Tailwind CSS 3 Patterns)

- Don't use `@tailwind base; @tailwind components; @tailwind utilities;`
- Don't hardcode color values in Tailwind config
- Don't use literal color names: `gold`, `blue`, `green`
- Don't mix Tailwind 3 and 4 syntax in the same project

### PostCSS Configuration

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### Storybook Integration

```tsx
// .storybook/preview.tsx
import '../app/global.css'; // Import Tailwind CSS
import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];
```

---

## Future Considerations

### Advanced Theming

- User-customizable accent colors (premium feature)
- Industry-specific color schemes (e.g., eco-brands → green accents)
- Seasonal theme variations
- Brand-specific theme customization

### Accessibility Enhancements

- High contrast mode support
- Dyslexia-friendly font options
- Enhanced focus indicators
- Reduced motion preferences

---

## Implementation Checklist (Tailwind CSS 4)

Before shipping any component:

- [ ] Uses `@import 'tailwindcss'` syntax (not `@tailwind` directives)
- [ ] Uses semantic color classes (no literal color names)
- [ ] Uses CSS custom properties for all design tokens
- [ ] Tested in both light and dark modes
- [ ] Meets WCAG AA contrast requirements
- [ ] Follows 4px spacing system
- [ ] Uses consistent border radius values
- [ ] Implements proper focus states
- [ ] Includes loading and error states
- [ ] Responsive across all breakpoints
- [ ] Accessible via keyboard navigation
- [ ] Uses Tailwind CSS 4 PostCSS plugin
- [ ] Storybook properly imports Tailwind CSS file
- [ ] No hardcoded color values in Tailwind config

This semantic design system with Tailwind CSS 4 ensures consistent, accessible, and maintainable theming across the entire Alva platform while supporting both light and dark modes seamlessly.

---

## Brand Identity

### Name

**Alva** — Derived from Latin "albus" (white/light), symbolizing clarity and illumination

### Tagline

_"Bringing your marketing into the light."_

### Mission

Provide small business owners with a custom marketing plan and a skilled, always-on marketing director at a fraction of the cost.

### Brand Personality

- **Sharp**: Cutting through marketing noise with precision
- **Confident**: Decisive recommendations, never wishy-washy
- **Warm**: Approachable and encouraging, not clinical
- **Direct**: Clear communication, no fluff

### Core Values

1. **Clarity** — Eliminate confusion, provide direction
2. **Precision** — Targeted strategies, not generic advice
3. **Empowerment** — Users feel in control, not dependent
4. **Adaptation** — Evolves with business needs

---

## Color System

### Primary Palette

#### Gold (Primary Action / Highlight)

```scss
$gold: #ffd700;
$gold-light: #ffe44d; // Hover, lighter contexts
$gold-dark: #e6c200; // Active, pressed states
$gold-muted: #fff4cc; // Backgrounds, soft highlights
$gold-10: rgba(255, 215, 0, 0.1); // Subtle tints
```

**Usage**:

- Primary CTAs (buttons, links)
- Active states (selected items, current page)
- Progress indicators
- Attention-grabbing elements (Quick Win card)
- Alva's "thinking" pulse animation
- Highlights and accents

**Accessibility**:

- ⚠️ Does not pass WCAG AA for body text on white
- ✅ Use for large text only (18px+, headings)
- ✅ Passes AA for icons and UI elements (3:1 ratio)

#### Blue (Secondary Accent)

```scss
$blue: #007bff;
$blue-light: #4da3ff; // Hover states
$blue-dark: #0056b3; // Active states
$blue-muted: #cce5ff; // Backgrounds
$blue-10: rgba(0, 123, 255, 0.1);
```

**Usage**:

- Secondary actions (back links, info links)
- Informational states
- Links in body text
- Icons for information/help

**Accessibility**:

- ✅ Passes WCAG AA for all text sizes (4.5:1 on white)

#### Success Green

```scss
$green: #28a745;
$green-light: #5cb85c;
$green-dark: #1e7e34;
$green-muted: #d4edda;
$green-10: rgba(40, 167, 69, 0.1);
```

**Usage**:

- Success messages
- Completed states (tasks, onboarding)
- Positive metrics/trends
- Verification badges

#### Danger Red

```scss
$red: #d32f2f;
$red-light: #ef5350;
$red-dark: #b71c1c;
$red-muted: #f8d7da;
$red-10: rgba(211, 47, 47, 0.1);
```

**Usage**:

- Error messages
- Destructive actions (delete, remove)
- Validation failures
- Warning indicators

### Neutral Palette

#### Dark Text

```scss
$text-primary: #1f1f1f; // Headings, body text
$text-secondary: #6f6f6f; // Subtext, captions, metadata
$text-tertiary: #a0a0a0; // Disabled text, placeholders
$text-inverse: #ffffff; // Text on dark backgrounds
```

#### Backgrounds

```scss
$bg-primary: #ffffff; // Main background
$bg-secondary: #fafafa; // Subtle backgrounds, alternating rows
$bg-tertiary: #f0f0f0; // Muted backgrounds, disabled states
$bg-elevated: #ffffff; // Cards, modals (with shadow)
```

#### Borders & Dividers

```scss
$border-subtle: #e5e5e5; // Default borders, track backgrounds
$border-default: #cccccc; // Input borders, dividers
$border-strong: #a0a0a0; // Emphasized borders
$border-gold: #ffd700; // Active/focus borders
```

### Semantic Colors

#### Info

```scss
$info: #17a2b8;
$info-light: #5dade2;
$info-muted: #d1ecf1;
```

#### Warning

```scss
$warning: #ffc107;
$warning-light: #ffd54f;
$warning-muted: #fff3cd;
```

### Color Usage Rules

**DO**:

- Use gold for primary actions and active states
- Use blue for navigation and informational elements
- Use semantic colors consistently (green=success, red=error)
- Ensure sufficient contrast (4.5:1 for body text)
- Use muted variants for backgrounds

**DON'T**:

- Don't use gold for body text (accessibility)
- Don't use color alone to convey meaning (add icons/text)
- Don't vary gold hue or saturation (stay consistent)
- Don't use more than 3 colors in a single component

---

## Typography

### Font Family

**Primary**: Inter

```scss
$font-family-base: 'Inter', 'Helvetica', 'Arial', sans-serif;
```

**Why Inter**:

- Designed for screens (excellent legibility)
- Large x-height (readability at small sizes)
- Comprehensive weights and styles
- Variable font support
- Open source

**Fallbacks**: Helvetica → Arial → system sans-serif

### Font Weights

```scss
$font-weight-regular: 400; // Body text, most content
$font-weight-medium: 500; // Emphasis, labels, nav
$font-weight-semibold: 600; // Subheadings, buttons
$font-weight-bold: 700; // Headings, strong emphasis
```

**Usage**:

- Regular (400): Default for all body text
- Medium (500): Navigation links, labels, minor emphasis
- Semibold (600): Subheadings, card titles, button text
- Bold (700): Page headings, section titles

### Type Scale

#### Desktop (1024px+)

```scss
$text-xs: 12px; // Metadata, timestamps
$text-sm: 13px; // Captions, helper text
$text-base: 14px; // Body text (default)
$text-md: 16px; // Emphasized body, large labels
$text-lg: 18px; // Subheadings, card titles
$text-xl: 22px; // Page headings
$text-2xl: 28px; // Hero headings
$text-3xl: 36px; // Landing page headlines (rare)
```

#### Mobile (<768px)

```scss
$text-xs: 11px; // -1px from desktop
$text-sm: 12px; // -1px
$text-base: 14px; // Same (readability)
$text-md: 16px; // Same
$text-lg: 18px; // Same
$text-xl: 20px; // -2px from desktop
$text-2xl: 24px; // -4px
$text-3xl: 28px; // -8px
```

**Rationale**: Smaller screens need slightly smaller headings, but body text stays the same for readability.

### Line Height

```scss
$leading-tight: 1.25; // Headings
$leading-snug: 1.375; // Subheadings
$leading-normal: 1.5; // Body text (desktop)
$leading-relaxed: 1.6; // Body text (mobile)
$leading-loose: 1.75; // Long-form content
```

**Usage**:

- Tight (1.25): Large headings, where space is limited
- Snug (1.375): Subheadings, card titles
- Normal (1.5): Default body text
- Relaxed (1.6): Mobile body text (easier to read)
- Loose (1.75): Long articles, help content

### Letter Spacing

```scss
$tracking-tight: -0.02em; // Large headings (36px+)
$tracking-normal: 0; // Default (most text)
$tracking-wide: 0.02em; // Small caps, labels
$tracking-wider: 0.05em; // All caps, metadata
```

**Usage**:

- Tight: Large headings appear more balanced
- Normal: Default for all regular text
- Wide: Uppercase labels for better readability
- Wider: ALL CAPS metadata (e.g., "ONBOARDING • 3 OF 6")

### Text Styles (Utility Classes)

#### Headings

```scss
.heading-hero {
  font-size: $text-3xl;
  font-weight: $font-weight-bold;
  line-height: $leading-tight;
  letter-spacing: $tracking-tight;
  color: $text-primary;
}

.heading-page {
  font-size: $text-xl;
  font-weight: $font-weight-bold;
  line-height: $leading-snug;
  color: $text-primary;
}

.heading-section {
  font-size: $text-lg;
  font-weight: $font-weight-semibold;
  line-height: $leading-snug;
  color: $text-primary;
}
```

#### Body Text

```scss
.body-default {
  font-size: $text-base;
  font-weight: $font-weight-regular;
  line-height: $leading-normal;
  color: $text-primary;
}

.body-large {
  font-size: $text-md;
  font-weight: $font-weight-regular;
  line-height: $leading-normal;
  color: $text-primary;
}

.body-small {
  font-size: $text-sm;
  font-weight: $font-weight-regular;
  line-height: $leading-normal;
  color: $text-secondary;
}
```

#### Specialized

```scss
.label {
  font-size: $text-sm;
  font-weight: $font-weight-medium;
  line-height: $leading-snug;
  color: $text-primary;
}

.caption {
  font-size: $text-xs;
  font-weight: $font-weight-regular;
  line-height: $leading-snug;
  color: $text-secondary;
}

.metadata {
  font-size: $text-xs;
  font-weight: $font-weight-medium;
  line-height: $leading-snug;
  letter-spacing: $tracking-wider;
  text-transform: uppercase;
  color: $text-secondary;
}
```

---

## Spacing System

### Base Unit

**4px** — All spacing is a multiple of 4px for consistency

### Spacing Scale

```scss
$space-0: 0;
$space-1: 4px; // 1 unit
$space-2: 8px; // 2 units
$space-3: 12px; // 3 units
$space-4: 16px; // 4 units
$space-5: 20px; // 5 units
$space-6: 24px; // 6 units
$space-8: 32px; // 8 units
$space-10: 40px; // 10 units
$space-12: 48px; // 12 units
$space-16: 64px; // 16 units
$space-20: 80px; // 20 units
$space-24: 96px; // 24 units
```

### Spacing Usage

#### Component Internal Spacing

```scss
$padding-button: $space-4 $space-6; // 16px vertical, 24px horizontal
$padding-input: $space-3 $space-4; // 12px vertical, 16px horizontal
$padding-card: $space-6; // 24px all sides (desktop)
$padding-card-mobile: $space-4; // 16px all sides (mobile)
```

#### Layout Spacing

```scss
$gap-xs: $space-2; // 8px - Tight groups (pill group)
$gap-sm: $space-3; // 12px - Related items (form fields)
$gap-md: $space-4; // 16px - Default gap (card grid)
$gap-lg: $space-6; // 24px - Section spacing
$gap-xl: $space-8; // 32px - Major section breaks
```

#### Container Padding

```scss
$container-padding-mobile: $space-4; // 16px
$container-padding-tablet: $space-6; // 24px
$container-padding-desktop: $space-8; // 32px
```

### Responsive Spacing

**Mobile** (<768px):

- Reduce padding: 24px → 16px
- Reduce gaps: 24px → 16px
- Maintain minimum touch targets (44px)

**Tablet** (768-1023px):

- Moderate padding: 24px
- Moderate gaps: 20px

**Desktop** (1024px+):

- Full padding: 32px
- Full gaps: 24px

---

## Border & Radius

### Border Widths

```scss
$border-width-thin: 1px; // Default borders, dividers
$border-width-default: 1px; // Most use cases
$border-width-thick: 2px; // Focus rings, emphasis
$border-width-heavy: 3px; // Active indicators (nav)
```

### Border Radius

```scss
$radius-none: 0;
$radius-sm: 4px; // Small elements (badges)
$radius-md: 8px; // Default (buttons, inputs, cards)
$radius-lg: 12px; // Larger cards, modals
$radius-xl: 16px; // Hero elements (rare)
$radius-full: 9999px; // Pills, circular elements
```

**Usage**:

- **4px**: Badges, small tags
- **8px**: Buttons, inputs, most cards (standard)
- **12px**: Large cards, modal dialogs
- **24px (full)**: Pill selects, fully rounded buttons
- **9999px (full)**: Avatars, circular indicators

---

## Shadows & Elevation

### Shadow Scale

```scss
$shadow-none: none;

$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
// Subtle lift, hover states

$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
// Default card elevation

$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
// Modal, dropdown elevation

$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
// Maximum elevation (rare)

$shadow-focus: 0 0 0 3px rgba(255, 215, 0, 0.3);
// Focus ring (gold glow)

$shadow-error: 0 0 0 3px rgba(211, 47, 47, 0.2);
// Error focus ring
```

### Elevation Levels

**Level 0** (No Shadow):

- Flat cards (default state)
- Inline elements
- Page backgrounds

**Level 1** (sm):

- Hover states on cards
- Minor interactive elevation

**Level 2** (md):

- Default card resting state (when cards need separation)
- Dropdowns
- Tooltips

**Level 3** (lg):

- Modals
- Slide-out panels
- Important overlays

**Level 4** (xl):

- Full-screen overlays (rare)
- Critical modals

### Usage Rules

**DO**:

- Use shadows sparingly (prefer borders for separation)
- Increase shadow on hover for interactive cards
- Use focus shadow for keyboard navigation

**DON'T**:

- Don't use multiple shadow levels on same page
- Don't use shadows on white backgrounds without borders (low contrast)
- Don't animate shadow size (use opacity instead)

---

## Iconography

### Icon System

**Lucide Icons** (recommended)

**Why Lucide**:

- Consistent design language
- Comprehensive set (1000+ icons)
- Optimized SVGs
- Tree-shakeable
- MIT licensed

**Alternative**: Heroicons, Feather Icons

### Icon Sizes

```scss
$icon-xs: 12px; // Inline with small text
$icon-sm: 16px; // Inline with body text, small buttons
$icon-md: 20px; // Default size, most buttons
$icon-lg: 24px; // Large buttons, standalone icons
$icon-xl: 32px; // Hero sections, empty states
$icon-2xl: 48px; // Landing page, large empty states
```

### Icon Usage

**With Text**:

- Align to text baseline
- Use `$icon-sm` (16px) for body text
- Use `$icon-md` (20px) for headings
- 8px gap between icon and text

**Standalone**:

- Minimum touch target: 44x44px (wrap in clickable area)
- Use `$icon-lg` (24px) for toolbar icons
- Use `$icon-xl` (32px) for prominent actions

**Button Icons**:

- Leading icon: 16px gap from text
- Trailing icon: 8px gap from text
- Icon-only button: 44x44px min, center icon

### Icon Colors

```scss
$icon-primary: $text-primary; // Default
$icon-secondary: $text-secondary; // Muted
$icon-gold: $gold; // Active, highlight
$icon-blue: $blue; // Info, navigation
$icon-success: $green; // Success states
$icon-error: $red; // Error states
```

**States**:

- Default: `$icon-secondary` (#6F6F6F)
- Hover: `$icon-primary` (#1F1F1F)
- Active/Selected: `$icon-gold` (#FFD700)

---

## Motion & Timing

### Timing Functions

```scss
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Usage**:

- **Ease-in**: Elements leaving the screen
- **Ease-out**: Elements entering the screen (most common)
- **Ease-in-out**: State changes, hover effects
- **Ease-bounce**: Playful interactions (use sparingly)

### Duration Scale

```scss
$duration-instant: 0ms; // No animation
$duration-fast: 100ms; // Instant feedback (active states)
$duration-normal: 150ms; // Default (hover, focus)
$duration-moderate: 200ms; // Subtle animations (fade in)
$duration-slow: 300ms; // Deliberate animations (slide)
$duration-slower: 500ms; // Dramatic entrances (modals)
```

**Guidelines**:

- Micro-interactions: 100-150ms
- Standard transitions: 150-200ms
- Page transitions: 200-300ms
- Complex animations: 300-500ms

### Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Respect User Preferences**:

- Always provide reduced motion alternative
- Remove decorative animations
- Keep functional animations (focus rings, etc.)

---

## Grid System

### Breakpoints

```scss
$breakpoint-sm: 640px; // Small tablets, large phones
$breakpoint-md: 768px; // Tablets
$breakpoint-lg: 1024px; // Desktops
$breakpoint-xl: 1280px; // Large desktops
$breakpoint-2xl: 1536px; // Extra large displays
```

### Grid Configuration

#### Mobile (<768px)

- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 16px

#### Tablet (768-1023px)

- **Columns**: 8
- **Gutter**: 20px
- **Margin**: 24px

#### Desktop (1024px+)

- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 32px

### Container Widths

```scss
$container-sm: 640px; // Small content (articles)
$container-md: 768px; // Medium content (forms)
$container-lg: 1024px; // Large content (dashboards)
$container-xl: 1280px; // Full-width content
$container-max: 1536px; // Maximum width (rare)
```

**Usage**:

- **640px**: Long-form text, onboarding cards
- **768px**: Forms, modals
- **1024px**: Dashboard layouts
- **1280px**: Wide dashboards, data tables

---

## Component Theming

### Button Variants (Semantic Classes - Tailwind CSS 4)

```tsx
// Button component using semantic Tailwind classes
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonClasses = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50',
    {
      // Primary button using semantic colors
      'bg-primary text-text-primary hover:bg-primary-hover active:bg-primary-active font-semibold': variant === 'primary',
      
      // Secondary button using semantic colors
      'bg-bg-secondary text-text-primary border border-border-default hover:bg-bg-tertiary': variant === 'secondary',
      
      // Ghost button using semantic colors
      'text-text-primary hover:bg-bg-secondary': variant === 'ghost',
      
      // Destructive button using semantic colors
      'bg-danger text-text-inverse hover:bg-danger-hover active:bg-danger-active': variant === 'destructive',
    },
    {
      'h-8 px-3 text-xs': size === 'sm',
      'h-10 px-4 py-2': size === 'md',
      'h-12 px-8 text-base': size === 'lg',
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
```

### Card Variants (Semantic Classes - Tailwind CSS 4)

```tsx
// Card component using semantic Tailwind classes
export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  const cardClasses = cn(
    'rounded-md transition-colors',
    {
      // Default card using semantic colors
      'bg-bg-elevated border border-border-subtle': variant === 'default',
      
      // Elevated card using semantic colors
      'bg-bg-elevated border-transparent shadow-md': variant === 'elevated',
      
      // Highlighted card using semantic colors
      'bg-bg-elevated border-l-4 border-l-primary border-y border-r border-border-subtle': variant === 'highlighted',
      
      // Interactive card using semantic colors
      'bg-bg-elevated border border-border-subtle hover:bg-bg-secondary hover:shadow-md': variant === 'interactive',
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}
```

---

## Dark Mode (Future)

_Currently not implemented, but prepared for future addition_

### Color Mapping

```scss
// Light mode (current)
$bg-primary-light: #ffffff;
$text-primary-light: #1f1f1f;

// Dark mode (future)
$bg-primary-dark: #1a1a1a;
$text-primary-dark: #fafafa;
$gold-dark-mode: #ffd700; // Keep gold consistent
```

**Preparation**:

- Use CSS custom properties for dynamic switching
- Design with sufficient contrast for both modes
- Test gold on dark backgrounds

---

## Tailwind CSS 4 Configuration

### Complete Config (Tailwind CSS 4)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        sans: ['var(--font-family-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        md: ['1.125rem', { lineHeight: '1.5' }],
        lg: ['1.25rem', { lineHeight: '1.375' }],
        xl: ['1.5rem', { lineHeight: '1.375' }],
        '2xl': ['1.875rem', { lineHeight: '1.25' }],
        '3xl': ['2.25rem', { lineHeight: '1.25' }],
      },
      spacing: {
        0: '0px',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        focus: '0 0 0 2px var(--color-border-focus)',
        error: '0 0 0 2px var(--color-danger)',
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '200ms',
        moderate: '300ms',
        slow: '500ms',
        slower: '700ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Design Tokens (CSS Custom Properties) - Tailwind CSS 4

### CSS Import Syntax (Tailwind CSS 4)

```css
/* apps/web/app/global.css */
@import 'tailwindcss';

/* Design System CSS Custom Properties */
:root {
  /* Semantic Color System */
  --color-primary: #ffd701;
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
  --color-border-focus: #ffd701;

  /* Typography */
  --font-family-sans: 'Inter', 'Helvetica', 'Arial', sans-serif;

  /* Spacing */
  --spacing-0: 0px;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-moderate: 300ms;
  --transition-slow: 500ms;
  --transition-slower: 700ms;
}

/* Dark Mode Theme */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Mode Semantic Colors */
    --color-text-primary: #fafafa;
    --color-text-secondary: #a0a0a0;
    --color-text-tertiary: #6f6f6f;
    --color-text-inverse: #0a0a0a;

    --color-bg-primary: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-bg-tertiary: #334155;
    --color-bg-elevated: #1e293b;

    --color-border-subtle: #334155;
    --color-border-default: #475569;
    --color-border-strong: #64748b;
    --color-border-focus: #ffd701;

    /* Keep brand colors consistent */
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
}

/* Manual Dark Mode Toggle Support */
.dark {
  --color-text-primary: #fafafa;
  --color-text-secondary: #a0a0a0;
  --color-text-tertiary: #6f6f6f;
  --color-text-inverse: #0a0a0a;

  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-bg-elevated: #1e293b;

  --color-border-subtle: #334155;
  --color-border-default: #475569;
  --color-border-strong: #64748b;
  --color-border-focus: #ffd701;

  /* Keep brand colors consistent */
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
```

---

## Brand Voice Guidelines

### Tone

**Professional but Approachable**:

- ✅ "Here's what will move the needle this week."
- ❌ "Yo, check out these sick marketing hacks!"

**Confident, Never Arrogant**:

- ✅ "I recommend focusing on Instagram Reels based on your audience."
- ❌ "You should definitely only use Instagram Reels. Everything else is a waste."

**Strategic, Never Fluffy**:

- ✅ "Launch your email campaign on Tuesday for higher open rates."
- ❌ "Think about maybe sending some emails sometime soon?"

### Language Style

**Plain English, No Jargon Without Context**:

- ✅ "Your click-through rate (CTR) measures how many people click your ads."
- ❌ "Optimize your CTR to improve ROAS across PPC campaigns."

**Short, Punchy Sentences for Advice**:

- ✅ "Post twice per week. Focus on Reels. Keep it under 30 seconds."
- ❌ "You should consider posting approximately two times per week, and when you do post, you might want to focus primarily on creating Reels, which should generally be kept to under 30 seconds in duration."

**Warmer Phrasing in Onboarding**:

- ✅ "I'll guide you step-by-step. You won't need to guess your next move again."
- ❌ "Complete the following fields to proceed with system configuration."

**"You" More Than "We"** (Customer-Focused):

- ✅ "You're building something special. Let's make sure people see it."
- ❌ "We're here to help our clients achieve their marketing goals."

### Example Phrasing

**Onboarding**:

- "I'll guide you step-by-step. You won't need to guess your next move again."
- "Great, you're in. I just need a few quick details so I can get to know your brand."

**Strategy Delivery**:

- "Here's what will move the needle this week."
- "Your next Quick Win: Record a 20-second BTS Reel."

**Recommendations**:

- "Based on your audience, Instagram Reels will give you the best ROI."
- "Skip Facebook Ads for now—your budget is better spent on Google Search."

**Encouragement**:

- "You're 5 days into your streak. Keep it going."
- "Nice work. That post got 3x your average engagement."

---

## Design System Checklist

Before shipping any component or page:

- [ ] Uses design tokens (no hardcoded values)
- [ ] Follows color usage rules (gold for primary actions, etc.)
- [ ] Typography matches type scale and hierarchy
- [ ] Spacing follows 4px base unit
- [ ] Border radius is 8px (default) or 24px (pills)
- [ ] Shadows used sparingly and appropriately
- [ ] Icons from Lucide, correct size for context
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Responsive across all breakpoints
- [ ] Accessible contrast ratios (4.5:1 minimum)

---

## Future Considerations

### Theming Extensions

- Dark mode color mappings
- User-customizable accent colors (premium feature)
- Industry-specific color schemes (e.g., eco-brands → green accents)

### Advanced Motion

- Page transitions (Next.js View Transitions API)
- Scroll-triggered animations
- Gesture-based interactions (swipe, pinch)

### Accessibility Enhancements

- High contrast mode
- Dyslexia-friendly font option
- Enhanced focus indicators (beyond gold ring)

---

## Visual Reference

### Mockups & Design Implementation

- **[Mobile Mockups](../../mockups/mobile/)** - Complete onboarding flow implementing this design system
- **[Desktop Mockups](../../mockups/web/)** - Application interfaces using these design tokens
- **[Mockups README](../../mockups/README.md)** - Detailed breakdown of visual designs
