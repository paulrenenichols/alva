# Alva Theme & Design System

**@fileoverview** Complete design system specification for the Alva marketing platform, defining colors, typography, spacing, and visual language to ensure consistent, premium brand expression.

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
$font-family-base: "Inter", "Helvetica", "Arial", sans-serif;
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

### Button Variants (Tailwind Config)

```ts
// tailwind.config.ts
const buttonVariants = {
  primary: {
    bg: "bg-gold hover:bg-gold-light active:bg-gold-dark",
    text: "text-dark-text",
    border: "border-transparent",
  },
  secondary: {
    bg: "bg-white hover:bg-gray-50 active:bg-gray-100",
    text: "text-dark-text",
    border: "border-border-default",
  },
  ghost: {
    bg: "bg-transparent hover:bg-gray-50",
    text: "text-blue hover:text-blue-light",
    border: "border-transparent",
  },
  destructive: {
    bg: "bg-red hover:bg-red-light active:bg-red-dark",
    text: "text-white",
    border: "border-transparent",
  },
};
```

### Card Variants

```ts
const cardVariants = {
  default: {
    bg: "bg-white",
    border: "border border-border-subtle",
    shadow: "shadow-none",
  },
  elevated: {
    bg: "bg-white",
    border: "border-transparent",
    shadow: "shadow-md",
  },
  highlighted: {
    bg: "bg-white",
    border: "border-l-4 border-l-gold border-y border-r border-border-subtle",
    shadow: "shadow-none",
  },
  interactive: {
    bg: "bg-white hover:bg-gray-50",
    border: "border border-border-subtle",
    shadow: "hover:shadow-md transition-all",
  },
};
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

## Tailwind Configuration

### Complete Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./apps/**/*.{js,ts,jsx,tsx}", "./libs/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FFD700",
          light: "#FFE44D",
          dark: "#E6C200",
          muted: "#FFF4CC",
        },
        blue: {
          DEFAULT: "#007BFF",
          light: "#4DA3FF",
          dark: "#0056B3",
          muted: "#CCE5FF",
        },
        green: {
          DEFAULT: "#28A745",
          light: "#5CB85C",
          dark: "#1E7E34",
          muted: "#D4EDDA",
        },
        red: {
          DEFAULT: "#D32F2F",
          light: "#EF5350",
          dark: "#B71C1C",
          muted: "#F8D7DA",
        },
        text: {
          primary: "#1F1F1F",
          secondary: "#6F6F6F",
          tertiary: "#A0A0A0",
          inverse: "#FFFFFF",
        },
        bg: {
          primary: "#FFFFFF",
          secondary: "#FAFAFA",
          tertiary: "#F0F0F0",
        },
        border: {
          subtle: "#E5E5E5",
          DEFAULT: "#CCCCCC",
          strong: "#A0A0A0",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13px", { lineHeight: "1.5" }],
        base: ["14px", { lineHeight: "1.5" }],
        md: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.375" }],
        xl: ["22px", { lineHeight: "1.375" }],
        "2xl": ["28px", { lineHeight: "1.25" }],
        "3xl": ["36px", { lineHeight: "1.25" }],
      },
      spacing: {
        "0": "0",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        focus: "0 0 0 3px rgba(255, 215, 0, 0.3)",
        error: "0 0 0 3px rgba(211, 47, 47, 0.2)",
      },
      transitionDuration: {
        fast: "100ms",
        DEFAULT: "150ms",
        moderate: "200ms",
        slow: "300ms",
        slower: "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Design Tokens (CSS Custom Properties)

```css
/* apps/web/app/globals.css */
:root {
  /* Colors */
  --color-gold: #ffd700;
  --color-gold-light: #ffe44d;
  --color-gold-dark: #e6c200;

  --color-blue: #007bff;
  --color-green: #28a745;
  --color-red: #d32f2f;

  --color-text-primary: #1f1f1f;
  --color-text-secondary: #6f6f6f;
  --color-text-tertiary: #a0a0a0;

  --color-bg-primary: #ffffff;
  --color-bg-secondary: #fafafa;
  --color-bg-tertiary: #f0f0f0;

  --color-border-subtle: #e5e5e5;
  --color-border-default: #cccccc;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Typography */
  --font-sans: "Inter", "Helvetica", "Arial", sans-serif;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 100ms ease-out;
  --transition-normal: 150ms ease-in-out;
  --transition-slow: 300ms ease-out;
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
