# Alva UI Design Rules

**@fileoverview** Comprehensive UI design principles and guidelines for the Alva marketing platform, ensuring consistent, accessible, and premium user experiences.

---

## Design Philosophy

### Core Principles

**1. Minimal & Intentional**

- Every element serves a purpose
- No decorative flourishes or gimmicks
- Design feels premium through restraint, not excess
- White space is a design element, not empty space

**2. Clarity Over Cleverness**

- Clear labels, obvious interactions
- No hidden navigation or mystery meat menus
- Straightforward language, no marketing speak
- Users should never wonder "what does this do?"

**3. Empowering, Not Overwhelming**

- Progressive disclosure (show what's needed, when needed)
- Guided flows for complex tasks
- Always provide context and next steps
- Confidence through clear direction

**4. AI-First, Not AI-Obvious**

- Intelligence in the background, not the spotlight
- Alva is a director, not a chatbot
- Avoid "AI is thinking..." clichés
- Focus on outcomes, not the mechanism

---

## Component Architecture

### Design System Hierarchy

```
Design Tokens (colors, spacing, typography)
    ↓
Primitives (Button, Input, Card)
    ↓
Patterns (Form Field, Modal, Navigation)
    ↓
Features (Onboarding Card, Task Card, Chat Message)
    ↓
Pages (Dashboard, Onboarding, Action Board)
```

### Component Categories

**1. Primitives** (Atomic, highly reusable)

- Button, Input, Select, Checkbox, Radio
- Typography (Heading, Text, Caption)
- Icon, Avatar, Badge, Divider

**2. Patterns** (Composed, reusable)

- Form Field (Label + Input + Error)
- Modal, Drawer, Dropdown
- Card, Panel, Section
- Navigation (Top Nav, Side Nav, Breadcrumbs)

**3. Features** (Domain-specific)

- Onboarding Card
- Task Card
- Chat Message
- Plan Summary Card
- Quick Win Card

**4. Layouts**

- Page Container
- Two-Column Layout
- Sidebar Layout
- Full-Screen Modal Layout

---

## Layout Patterns

### 1. Card-Based Layouts

**Usage**: Dashboard, summaries, task lists, content previews

**Structure**:

```tsx
<Card>
  <CardHeader>
    <Heading />
    <SubText />
  </CardHeader>
  <CardBody>
    <Content />
  </CardBody>
  <CardFooter>
    <Actions />
  </CardFooter>
</Card>
```

**Variants**:

- **Flat**: No shadow, border only (default)
- **Elevated**: Subtle shadow for emphasis
- **Interactive**: Hover state, clickable
- **Highlighted**: Gold left border for active/featured items

**Spacing**:

- Padding: 24px (desktop), 16px (mobile)
- Gap between cards: 16px (vertical), 24px (horizontal)
- Max width: 800px for readability

**Example Use Cases**:

- Quick Win card on dashboard
- Task card in Action Board
- Summary sections in onboarding
- Plan preview cards

---

### 2. Full-Screen Moments

**Usage**: Onboarding cards, modals, focus experiences

**Purpose**: Eliminate distractions, guide attention

**Characteristics**:

- Background: #FAFAFA or white
- Centered content with max-width constraints
- Clear navigation (back, skip, next)
- Progress indicators when part of a sequence

**Layout**:

```
┌─────────────────────────────────────┐
│  [Progress Bar]                     │
│                                     │
│                                     │
│     [Heading]                       │
│     [Subheading]                    │
│                                     │
│     [Input/Content]                 │
│                                     │
│                                     │
│  [Back]    [Skip]         [Next →]  │
└─────────────────────────────────────┘
```

**Responsive Behavior**:

- Desktop: Max-width 600px, centered
- Tablet: Full-width with 32px horizontal padding
- Mobile: Full-width with 16px horizontal padding

**Example Use Cases**:

- Onboarding cards (26 cards)
- Email verification prompt
- Plan generation loading state

---

### 3. Dashboard Layouts

**Usage**: Main dashboard, action board, settings

**Structure**:

```
┌─────────────────────────────────────┐
│  Top Navigation                     │
├─────────────────────────────────────┤
│                                     │
│  [Hero Section / Quick Win]         │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Card 1  │  │  Card 2  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────────────────────┐      │
│  │  Primary Content Area    │      │
│  └──────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

**Grid System**:

- 12-column grid (desktop)
- 8-column grid (tablet)
- 4-column grid (mobile)
- Gutter: 24px (desktop), 16px (mobile)

**Sections**:

1. **Hero/Status**: Full-width, attention-grabbing
2. **Cards Grid**: 2-3 columns, equal height
3. **Main Content**: Full-width or 2/3 width with sidebar
4. **Footer/Secondary**: Full-width, de-emphasized

---

### 4. Sidebar Layouts

**Usage**: Dashboard with navigation, settings pages

**Left Sidebar** (Navigation):

- Width: 240px (desktop), slide-in drawer (mobile)
- Background: White or #FAFAFA
- Border-right: 1px solid #E5E5E5
- Contains: Logo, nav links, user menu

**Right Sidebar** (Contextual):

- Width: 320px (desktop), slide-in drawer (mobile)
- Use sparingly (don't crowd the UI)
- Examples: Help panel, quick actions, filters

**Content Area**:

- Min-width: 600px (enforce horizontal scroll if needed)
- Padding: 32px (desktop), 16px (mobile)

---

## Interactive Elements

### 1. Buttons

**Hierarchy**:

```tsx
// Primary Action (gold, high contrast)
<Button variant="primary">See My Plan</Button>

// Secondary Action (outline, subtle)
<Button variant="secondary">Edit Answers</Button>

// Tertiary Action (text link, minimal)
<Button variant="ghost">Skip</Button>

// Destructive Action (red, cautious)
<Button variant="destructive">Delete Account</Button>
```

**States**:

- **Default**: Base colors, no hover
- **Hover**: Slightly darker (+10% brightness)
- **Active**: Slightly lighter (-5% brightness), subtle scale down
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner replaces text, disabled state

**Sizing**:

- **Large**: 48px height, 24px horizontal padding (CTAs)
- **Medium**: 40px height, 20px horizontal padding (default)
- **Small**: 32px height, 16px horizontal padding (compact UIs)

**Styling**:

- Border radius: 8px (consistent across sizes)
- Font: Inter Medium, 14px (medium/small), 16px (large)
- Transition: all 150ms ease-in-out

**Accessibility**:

- Min 44x44px touch target on mobile
- Focus ring: 2px gold outline, 2px offset
- Keyboard accessible (Enter/Space)
- ARIA labels for icon-only buttons

---

### 2. Input Fields

**Anatomy**:

```tsx
<FormField>
  <Label>Business Name</Label>
  <Input placeholder="e.g., Acme Inc." />
  <HelperText>This will appear on your marketing plan</HelperText>
  <ErrorText>Business name is required</ErrorText>
</FormField>
```

**States**:

- **Default**: Border #CCCCCC, background white
- **Focus**: Border gold (#FFD700), subtle glow
- **Error**: Border red (#D32F2F), red helper text
- **Disabled**: Background #F0F0F0, cursor not-allowed
- **Read-only**: No border, looks like text

**Styling**:

- Height: 44px (comfortable for touch)
- Padding: 12px 14px
- Border: 1px solid
- Border radius: 8px
- Font: Inter Regular, 14px

**Validation**:

- Real-time for format (email, URL)
- On blur for required fields
- Inline error messages below field
- Error icon inside field (right side)

**Types**:

- Text, Email, Password, Number
- Textarea (auto-resize or fixed height)
- Rich text (for longer content like "additional notes")

---

### 3. Selection Controls

#### Radio Buttons (Single Choice)

```tsx
<RadioGroup>
  <Radio value="online" label="Online" description="..." />
  <Radio value="in-person" label="In Person" description="..." />
  <Radio value="both" label="Both" description="..." />
</RadioGroup>
```

**Styling**:

- Circle indicator, gold when selected
- Label: Inter Medium, 14px
- Description: Inter Regular, 13px, #6F6F6F
- Spacing: 12px between options

#### Checkboxes (Multiple Choice)

```tsx
<CheckboxGroup>
  <Checkbox value="website" label="Website" />
  <Checkbox value="email" label="Email List" />
</CheckboxGroup>
```

**Styling**:

- Square with rounded corners (4px)
- Gold checkmark when selected
- Same text styling as radio buttons

#### Pill Selects (Visual Choice)

```tsx
<PillGroup multiple>
  <Pill value="playful">Fun & Playful</Pill>
  <Pill value="minimal">Calm & Minimal</Pill>
</PillGroup>
```

**Styling**:

- Background: #F0F0F0 (default), gold (selected)
- Text: #1F1F1F (default), white (selected)
- Border radius: 24px (fully rounded)
- Padding: 8px 16px
- Transition: background 200ms

**Use Cases**:

- Brand vibe selection
- Marketing goals
- Content preferences

---

### 4. Sliders

**Usage**: Time availability, budget selection

**Anatomy**:

```tsx
<Slider min={0} max={20} step={1} labels={["Bare Minimum", "Light Touch", "Serious Effort", "Full-Time Energy"]} />
```

**Styling**:

- Track: 4px height, #E5E5E5 (inactive), gold (active)
- Thumb: 20px circle, white with gold border
- Labels below: Highlight in gold as slider moves past

**Behavior**:

- Smooth dragging with haptic feedback (mobile)
- Keyboard accessible (arrow keys)
- Show current value near thumb

**Variants**:

- **Continuous**: Any value in range
- **Stepped**: Discrete values (e.g., 1, 5, 10, 20+)
- **Labeled**: Text labels for key values

---

### 5. Progress Indicators

#### Progress Bar (Linear)

```tsx
<ProgressBar total={6} current={3} label="Brand Clarity • 3 of 6" />
```

**Styling**:

- Height: 6px
- Background: #E5E5E5 (track)
- Fill: Gold (#FFD700)
- Segments: Show divisions for stepped progress
- Animated transition between steps

#### Progress Dots (Stepped)

```tsx
<ProgressDots steps={5} current={2} />
```

**Styling**:

- Size: 8px diameter
- Inactive: #E5E5E5
- Active: Gold
- Spacing: 8px between dots

#### Loading Spinner

```tsx
<Spinner size="md" color="gold" />
```

**Usage**:

- Button loading states
- Content loading (skeleton preferred)
- Full-page loading (with message)

**Styling**:

- Circular, smooth rotation
- Sizes: sm (16px), md (24px), lg (48px)
- Colors: gold (default), blue (info), gray (neutral)

---

### 6. File Upload

**Drag & Drop Zone**:

```tsx
<FileUpload
  accept=".pdf,.jpg,.png"
  maxSize={5} // MB
  label="Upload brand guide or logo"
/>
```

**States**:

- **Default**: Dashed border, upload icon, "Drag & drop or click"
- **Hover**: Gold border, slight background tint
- **Dragging**: Solid gold border, gold background (10% opacity)
- **Uploaded**: File name, size, remove button

**Styling**:

- Min height: 120px
- Border: 2px dashed #CCCCCC
- Border radius: 8px
- Icon: Gray, 32px
- Text: Inter Regular, 14px

---

## Navigation Patterns

### 1. Top Navigation

**Layout**:

```
┌──────────────────────────────────────────┐
│  [Logo]    Dashboard  Action Board  Chat │
│                          [User Menu] [⚙️] │
└──────────────────────────────────────────┘
```

**Styling**:

- Height: 64px
- Background: White
- Border-bottom: 1px solid #E5E5E5
- Padding: 0 32px (desktop), 0 16px (mobile)

**Navigation Links**:

- Font: Inter Medium, 14px
- Color: #1F1F1F (default), gold (active)
- Active indicator: 3px gold bottom border
- Hover: Slight gold tint on text

**User Menu** (dropdown):

- Avatar + name (on desktop)
- Avatar only (on mobile)
- Dropdown: Profile, Settings, Sign Out

---

### 2. Onboarding Navigation

**Three-Part Control**:

```
[← Back]        [Skip]        [Next →]
```

**Back Button** (text link, left):

- Color: Blue (#007BFF)
- Icon: Left arrow
- Action: Previous card or section

**Skip Link** (text link, center):

- Color: Gray (#6F6F6F)
- Only shown for optional cards
- Action: Next card, mark as skipped

**Next Button** (primary, right):

- Gold background
- Icon: Right arrow
- Disabled until valid input
- Action: Save and advance

**Mobile**:

- Fixed to bottom of screen
- Safe area inset padding
- Swipe gestures also work

---

### 3. Breadcrumbs

**Usage**: Settings, multi-level pages

```tsx
<Breadcrumbs>
  <Breadcrumb href="/dashboard">Dashboard</Breadcrumb>
  <Breadcrumb href="/dashboard/settings">Settings</Breadcrumb>
  <Breadcrumb current>Profile</Breadcrumb>
</Breadcrumbs>
```

**Styling**:

- Font: Inter Regular, 13px
- Color: #6F6F6F (links), #1F1F1F (current)
- Separator: "/" or "›" in gray
- Hover: Blue (#007BFF)

---

## Responsive Behavior

### Breakpoints

```scss
$mobile: 0-767px; // Stacked, single column
$tablet: 768-1023px; // 2 columns, some stacking
$desktop: 1024px+; // Full layouts, 3+ columns
```

### Mobile-First Strategy

**Always Design for Mobile First**:

1. Start with mobile layout (< 768px)
2. Add complexity at tablet (768px+)
3. Full features at desktop (1024px+)

**Key Mobile Patterns**:

- Single column layouts
- Full-width cards
- Bottom sheet modals (not centered)
- Sticky CTAs at bottom
- Hamburger nav (slide-in drawer)
- Swipe gestures for card navigation

**Touch Targets**:

- Minimum 44x44px for all tappable elements
- Extra padding around text links (12px vertical)
- No hover states (use active/pressed instead)

**Typography Scaling**:

- Headings: Slightly smaller on mobile (H1: 28px → 24px)
- Body: Same size (16px for readability)
- Line height: Slightly more generous (1.6 vs 1.5)

---

## Animation & Microinteractions

### Animation Principles

1. **Purposeful**: Animations clarify state changes
2. **Quick**: 150-300ms for most transitions
3. **Natural**: Ease-in-out for organic feel
4. **Reduced Motion**: Respect `prefers-reduced-motion`

### Common Animations

**Fade In** (content appearing):

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: fadeIn 200ms ease-out;
```

**Gold Pulse** (Alva thinking):

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
animation: pulse 1.5s ease-in-out infinite;
```

**Button Press**:

```css
active:scale-95 active:brightness-95
transition: all 150ms ease-in-out
```

**Slide In** (modals, drawers):

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
animation: slideIn 250ms ease-out;
```

**Skeleton Loading** (content loading):

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

### Microinteractions

**Gold Hover State** (buttons, cards):

- Transition: 150ms ease-in-out
- Effect: Slight brightness increase, subtle lift (transform: translateY(-2px))

**Active State** (buttons):

- Effect: Scale down slightly (0.95), brief (100ms)

**Checkbox/Radio Selection**:

- Effect: Checkmark or circle fills with gold
- Timing: 200ms ease-out

**Card Click** (interactive cards):

- Effect: Subtle scale (1.02), shadow increase
- Timing: 150ms ease-in-out

**Input Focus**:

- Effect: Border color to gold, subtle glow
- Timing: 200ms ease-in-out

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast**:

- Text on white: Minimum 4.5:1 (body text)
- Large text (18px+): Minimum 3:1
- Gold on white: Passes for large text only (use for headings, not body)
- Blue on white: Passes for all text sizes

**Keyboard Navigation**:

- All interactive elements focusable
- Visible focus indicators (gold ring, 2px, 2px offset)
- Logical tab order (follows visual order)
- Skip links for main content

**Screen Reader Support**:

- Semantic HTML (nav, main, article, aside)
- ARIA labels for icon buttons
- ARIA live regions for dynamic content (chat, notifications)
- Alt text for images (descriptive, not decorative)

**Form Accessibility**:

- Label elements associated with inputs
- Error messages linked via aria-describedby
- Required fields marked with aria-required
- Group related fields with fieldset/legend

**Motion**:

- Respect `prefers-reduced-motion`
- Provide static alternatives
- No auto-playing animations (user-triggered only)

---

## Component Composition Patterns

### 1. Compound Components

**Pattern**: Parent provides context, children consume

```tsx
<Card>
  <CardHeader>
    <CardTitle>Quick Win</CardTitle>
    <CardBadge>15 min</CardBadge>
  </CardHeader>
  <CardBody>
    <CardDescription>Record a 20s BTS Reel</CardDescription>
  </CardBody>
  <CardFooter>
    <Button>Start Task</Button>
  </CardFooter>
</Card>
```

**Benefits**:

- Flexible composition
- Type-safe props
- Clear hierarchy

---

### 2. Render Props

**Pattern**: Parent controls rendering, child provides data

```tsx
<TaskList>
  {(tasks) => (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  )}
</TaskList>
```

**Use Cases**:

- Data fetching wrappers
- Custom rendering logic
- Headless UI components

---

### 3. Polymorphic Components

**Pattern**: Component can render as different elements

```tsx
<Button as="a" href="/dashboard">Go to Dashboard</Button>
<Button as="button" type="submit">Submit</Button>
```

**Benefits**:

- Semantic HTML
- Styling consistency
- Accessibility

---

## Form Design Standards

### Input Groups

**Horizontal Fields** (side-by-side):

```tsx
<div className="grid grid-cols-2 gap-4">
  <FormField label="First Name" />
  <FormField label="Last Name" />
</div>
```

**Vertical Fields** (stacked, default):

```tsx
<div className="space-y-4">
  <FormField label="Email" />
  <FormField label="Business Name" />
</div>
```

### Validation Patterns

**Real-Time** (as user types):

- Email format
- Password strength
- Character limits

**On Blur** (when field loses focus):

- Required fields
- Custom validation

**On Submit**:

- Final validation
- Server-side checks

**Error Display**:

```tsx
<FormField label="Email" error="Please enter a valid email" value={email} onChange={setEmail} />
```

- Error text below input
- Red color, icon
- Input border turns red
- Focus on first error on submit

---

## Loading States & Skeletons

### Skeleton Screens

**Purpose**: Show layout before content loads

```tsx
<Card>
  <Skeleton className="h-6 w-32 mb-2" /> {/* Title */}
  <Skeleton className="h-4 w-full mb-1" /> {/* Line 1 */}
  <Skeleton className="h-4 w-3/4" /> {/* Line 2 */}
</Card>
```

**Styling**:

- Background: #F0F0F0
- Shimmer animation (subtle)
- Match actual content dimensions

**Use Cases**:

- Initial page load
- Infinite scroll
- Lazy-loaded content

### Loading Indicators

**Inline** (within component):

- Spinner in button
- Progress bar in upload

**Overlay** (full component):

- Dim background (rgba(0,0,0,0.05))
- Centered spinner
- Optional message

**Full Page**:

- Alva logo with pulse
- "Crunching your answers..." text
- Progress bar if multi-step

---

## Error Handling Patterns

### Error Boundary

**Component-Level**:

```tsx
<ErrorBoundary fallback={<ErrorCard />}>
  <Dashboard />
</ErrorBoundary>
```

**Page-Level**:

```tsx
// app/error.tsx
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### Empty States

**No Data**:

```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No tasks yet"
  description="Your marketing plan will appear here"
  action={<Button>Generate Plan</Button>}
/>
```

**No Results** (search/filter):

```tsx
<EmptyState title="No tasks match your filters" action={<Button variant="ghost">Clear Filters</Button>} />
```

### Inline Errors

**Form Errors**: Below field (red text, icon)
**API Errors**: Toast notification (top-right)
**Validation Errors**: Inline with field

---

## Visual Reference

### Mockups & Designs

- **[Mobile Mockups](../../mockups/mobile/)** - Complete onboarding flow (26 cards)
- **[Desktop Mockups](../../mockups/web/)** - Application interface designs
- **[Mockups README](../../mockups/README.md)** - Detailed breakdown and usage guidelines

---

## Best Practices Summary

### Do's ✅

- Use semantic HTML elements
- Provide clear, actionable error messages
- Test with keyboard navigation only
- Ensure 4.5:1 contrast ratio for text
- Keep components under 250 lines
- Co-locate styles with components
- Use design tokens (no magic numbers)
- Implement loading states for all async actions
- Reference mockups for accurate visual implementation

### Don'ts ❌

- Don't use color alone to convey meaning
- Don't nest interactive elements (button in button)
- Don't use vague labels ("Click here", "Learn more")
- Don't auto-play animations without user control
- Don't forget mobile touch targets (44x44px min)
- Don't use custom scrollbars (accessibility issues)
- Don't implement UI patterns not in this guide
- Don't skip error states

---

## Component Checklist

Before shipping a component, ensure:

- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (keyboard, screen reader, ARIA)
- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] Empty state (if applicable)
- [ ] Follows design tokens (no hardcoded colors/spacing)
- [ ] TypeScript types exported
- [ ] Documented with JSDoc
- [ ] Unit tested (behavior, not implementation)
- [ ] Storybook story (if in design system)

---

## Future Enhancements

### Phase 2+ Patterns

- Dark mode support (user preference)
- Advanced data visualization (charts, graphs)
- Real-time collaboration indicators
- Gesture controls (swipe, pinch, etc.)
- Voice interface considerations
- AR/VR presentation modes (long-term vision)
