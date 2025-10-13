# Phase 2: MVP (Minimum Viable Product)

**@fileoverview** MVP phase for Alva - delivering end-to-end user experience from landing to marketing plan delivery with core functionality.

---

## Phase Overview

**Goal**: Create a complete, usable product that delivers value: onboarding → personalized marketing plan

**Duration**: 3-4 weeks

**Deliverable**: Fully functional onboarding flow that generates a custom marketing plan and provides basic chat interaction with Alva

**Success Criteria**:

- ✅ Landing page converts visitors to sign-ups
- ✅ 26-card onboarding completes successfully
- ✅ Client profile JSON generated and stored
- ✅ PPC marketing plan generated via LLM
- ✅ Summary preview shows collected data
- ✅ Chat interface provides basic interaction
- ✅ Email verification works
- ✅ User can access their dashboard

---

## Features & Tasks

### 1. Landing Page

**Objective**: Convert visitors to email sign-ups with minimal friction

**Tasks**:

1. Create landing page design
   - Hero section with tagline and value proposition
   - Single email input field with gold CTA
   - Minimal, premium aesthetic matching brand guide
   - Responsive layout (mobile-first)
2. Implement email capture form
   - Form validation (email format)
   - Rate limiting (prevent spam)
   - Error states and messages
   - Loading state on submit
3. Add animations and microinteractions
   - Fade-in on page load
   - Input focus states with gold highlight
   - Button hover and active states
   - Success feedback on submit
4. Implement email capture logic
   - Create unauthenticated session
   - Store email in database (unverified)
   - Redirect to `/onboarding/welcome`

**Dependencies**: Phase 1 (auth system)

**Acceptance Criteria**:

- Landing page loads in <1s
- Email capture works on all devices
- Invalid emails show clear error messages
- Successful submission redirects to welcome screen
- Session persists email for onboarding

---

### 2. Onboarding Welcome Screen

**Objective**: Frame the onboarding as a quick, valuable exercise

**Tasks**:

1. Create welcome screen component
   - Display welcome message
   - Show "26 cards • 5 minutes" indicator
   - Gold "Let's Go" CTA button
   - Option to go back to landing
2. Implement progress tracking state
   - Zustand store for onboarding progress
   - Track current section and card
   - Persist to localStorage (resume capability)
3. Add smooth transition animation
   - Fade in from landing page
   - Animate CTA button entrance
4. Implement navigation logic
   - "Let's Go" → `/onboarding/brand-clarity/1`
   - "Back" → `/` (landing page)

**Dependencies**: Landing page

**Acceptance Criteria**:

- Welcome screen displays correctly
- Progress state initializes
- Navigation works in both directions
- Animation smooth and professional

---

### 3. Onboarding Card System (26 Cards)

**Objective**: Collect comprehensive business intelligence through 5 sections

**Tasks**:

1. Build reusable card framework
   - Create `OnboardingCard` component
   - Section header with progress bar
   - Main question area
   - Input area (dynamic based on card type)
   - Navigation controls (Back, Skip, Next)
   - Responsive full-screen layout
2. Implement input components
   - Text input fields
   - Textarea for long-form
   - Pill selection (single/multi)
   - Radio buttons with descriptions
   - Checkbox groups
   - Slider with labeled values
   - File upload (drag & drop)
   - URL input with validation
3. Create all 26 cards following user-flow.md
   - Section 1: Brand Clarity (6 cards)
   - Section 2: Products & Offers (4 cards)
   - Section 3: Content & Social (6 cards)
   - Section 4: Goals & Growth (5 cards)
   - Section 5: Constraints & Tools (5 cards)
4. Implement state management
   - Store responses in Zustand
   - Auto-save every card completion
   - Persist to localStorage
   - Sync to database on section completion
5. Add validation and error handling
   - Required field validation
   - Format validation (URL, email)
   - Inline error messages
   - Prevent navigation if invalid

**Dependencies**: Welcome screen, UI component library

**Acceptance Criteria**:

- All 26 cards render correctly
- Input types work as specified
- Progress bar updates accurately
- Responses saved reliably
- Validation prevents invalid submissions
- Skip functionality works for optional cards
- Swipe gestures work on mobile

---

### 4. Client Profile Generation

**Objective**: Transform onboarding responses into structured `client_info.json`

**Tasks**:

1. Create profile schema with Zod
   - Define complete `ClientProfile` type
   - Match structure from project-overview.md
   - Add validation rules
2. Build profile mapper service
   - Map onboarding responses to schema
   - Handle optional fields
   - Normalize data (trim strings, parse URLs)
   - Validate against schema
3. Store profile in database
   - Create `client_profiles` table entry
   - Link to authenticated user
   - Store full JSON in JSONB column
   - Create GIN index for JSONB queries
4. Add profile update capability
   - Allow editing from summary page
   - Merge updates with existing profile
   - Maintain version history (optional)

**Dependencies**: Onboarding card system, database setup

**Acceptance Criteria**:

- Profile schema validates all inputs
- Mapping covers all onboarding fields
- Database stores profile correctly
- JSONB queries work efficiently
- Updates preserve previous data

---

### 5. Marketing Plan Generation (PPC Module)

**Objective**: Generate first marketing plan using LLM

**Tasks**:

1. Set up OpenAI integration
   - Install OpenAI SDK
   - Configure API client
   - Add retry logic with exponential backoff
   - Implement response caching (optional)
2. Create PPC plan generator
   - Load base PPC plan template from project-overview.md
   - Build prompt using client profile
   - Call OpenAI with JSON mode (temperature=0)
   - Validate response with Zod schema
3. Implement plan storage
   - Create `marketing_plans` table
   - Store plan JSON in JSONB column
   - Link to user and client profile
   - Add metadata (version, generated_at)
4. Add error handling and fallbacks
   - Retry failed LLM calls
   - Provide generic plan if LLM fails
   - Log errors for debugging
   - Show user-friendly error messages
5. Create background job for generation
   - Use BullMQ for async processing
   - Queue plan generation job
   - Update status in real-time (polling or SSE)
   - Handle timeouts gracefully

**Dependencies**: Client profile generation, OpenAI API access

**Acceptance Criteria**:

- PPC plan generates successfully
- JSON response validates against schema
- Plan stored in database correctly
- User sees generation progress
- Error states handled gracefully
- Generation completes in <30 seconds

---

### 6. Processing & Summary Preview

**Objective**: Provide immediate payoff and allow profile edits

**Tasks**:

1. Create loading/processing screen
   - Animated progress indicator
   - "Crunching your answers..." message
   - Gold-accented design
   - Automatic redirect after 2-3 seconds
2. Build summary preview page
   - Display 6 summary sections as cards
   - Show profile data in organized format
   - Add iconography for visual appeal
   - Responsive card layout
3. Implement edit functionality
   - "Edit my answers" link
   - Navigate back to specific section
   - Pre-fill forms with existing data
   - Save updates to profile
4. Add verification prompt (if not verified)
   - Modal or inline prompt
   - "Save your plan & get ongoing advice"
   - Send verification email
   - Option to continue without saving (limited access)

**Dependencies**: Profile generation, plan generation

**Acceptance Criteria**:

- Processing screen shows while plan generates
- Summary displays all collected data
- Edit functionality works end-to-end
- Verification prompt appears correctly
- Email verification sends successfully

---

### 7. Email Verification System

**Objective**: Verify email ownership before full access

**Tasks**:

1. Enhance email provider setup
   - Configure Resend or similar service
   - Create verification email template
   - Add magic link with token
2. Build verification flow
   - Generate secure token
   - Send email with verification link
   - Create `/verify?token=xxx` route
   - Validate token and mark email verified
3. Implement access control
   - Block unverified users from dashboard
   - Allow summary view for unverified
   - Redirect to verification prompt
   - Show verification status in UI
4. Add resend verification option
   - "Resend email" button
   - Rate limit resend attempts
   - Update token expiration

**Dependencies**: Auth system from Phase 1

**Acceptance Criteria**:

- Verification email sends reliably
- Token validation works securely
- Verified users get full access
- Unverified users see appropriate prompts
- Resend functionality works with rate limiting

---

### 8. Basic Chat Interface

**Objective**: Provide interactive Q&A with Alva

**Tasks**:

1. Set up Vercel AI SDK
   - Install `ai` package
   - Create chat API route
   - Configure OpenAI streaming
2. Build chat UI component
   - Message list with auto-scroll
   - Input area with send button
   - Typing indicators
   - Card-based message display
   - Gold accents and branding
3. Implement chat logic
   - Use `useChat` hook from Vercel AI SDK
   - Stream responses from OpenAI
   - Maintain conversation context
   - Store chat history in database
4. Add Alva personality
   - System prompt with brand voice
   - Include client profile in context
   - Reference marketing plan
   - Provide strategic advice
5. Create initial greeting
   - First message on chat load
   - "Alright - I've got the basics. Where would you like to start today?"
   - Suggested prompts/actions

**Dependencies**: Plan generation, Vercel AI SDK

**Acceptance Criteria**:

- Chat interface renders correctly
- Messages stream smoothly
- Responses reflect Alva's personality
- Client context included in responses
- Chat history persists
- Mobile-friendly design

---

### 9. Dashboard Home

**Objective**: Provide entry point to plan and quick actions

**Tasks**:

1. Create dashboard layout
   - Top navigation with logo and user menu
   - Main content area
   - Responsive sidebar (optional)
2. Build Quick Win card
   - Display next high-priority task
   - Show estimated time (15-20 min)
   - "Start Task" or "Mark Complete" CTA
   - Streak counter display
3. Add upcoming deadlines section
   - Show next 3 tasks with due dates
   - Card layout with task details
   - Channel tags and time estimates
4. Implement plan overview
   - Plan summary (dates, capacity, channels)
   - Total tasks (planned, completed)
   - Collapsible details
5. Add navigation links
   - Dashboard, Action Board, Chat, Settings
   - Active state indicators
   - Mobile navigation drawer

**Dependencies**: Plan generation, chat interface

**Acceptance Criteria**:

- Dashboard loads quickly
- Quick Win card displays correctly
- Navigation works across all pages
- Responsive on all devices
- Tasks can be marked complete

---

### 10. UI Component Library Foundation

**Objective**: Build reusable components for consistency

**Tasks**:

1. Create primitive components
   - Button (all variants from theme-rules.md)
   - Input (text, email, number, etc.)
   - Select dropdown
   - Checkbox and Radio
   - Card layouts
2. Build pattern components
   - FormField (label + input + error)
   - Modal/Dialog
   - Progress bar
   - Badge/Tag
   - Pill selector
3. Add utility functions
   - `cn()` for conditional classes
   - `formatDate()` for consistent date display
   - `formatCurrency()` for money
4. Set up Shadcn/UI
   - Install and configure
   - Customize theme to match brand
   - Install needed components (Dialog, Select, etc.)

**Dependencies**: Tailwind configuration from Phase 1

**Acceptance Criteria**:

- All primitive components styled per theme-rules.md
- Components accessible (WCAG AA)
- TypeScript types exported
- Storybook stories created (optional for MVP)
- Components reusable across app

---

## Technical Architecture

### Data Flow

```
User Input (Onboarding)
  ↓
Zustand Store (client state)
  ↓
Auto-save to Database (per section)
  ↓
Generate Client Profile JSON
  ↓
Queue Plan Generation Job
  ↓
LLM Generates PPC Plan
  ↓
Validate & Store Plan
  ↓
Display Summary + Chat
```

### Key Schemas

#### Client Profile

```typescript
interface ClientProfile {
  user_profile: {
    user_name: string;
    business_name: string;
    description: string;
  };
  brand_identity: {
    vibe_tags: string[];
    primary_colors: string[];
    fonts: string[];
    differentiators: string[];
  };
  // ... (full schema from project-overview.md)
}
```

#### Marketing Plan

```typescript
interface MarketingPlan {
  plan: {
    client_id: string;
    window_start: string;
    window_end: string;
    weekly_capacity_hours: number;
  };
  tasks: Task[];
  meta: {
    generated_at: string;
    governance_version: string;
  };
}
```

### API Routes

```
POST /api/onboarding/save-section
POST /api/plans/generate
GET  /api/plans/[id]
POST /api/chat (streaming)
GET  /api/auth/verify?token=xxx
```

---

## Testing Strategy

### Unit Tests

- Onboarding card components
- Profile mapper logic
- Zod schema validation
- Utility functions

### Integration Tests

- Onboarding flow end-to-end
- Profile generation pipeline
- Plan generation (mocked LLM)
- Chat functionality

### E2E Tests (Playwright)

- Complete user journey: landing → onboarding → summary → dashboard
- Email verification flow
- Chat interaction
- Mobile responsive behavior

---

## Performance Considerations

- **Code Splitting**: Dynamic import for heavy components (chat, plan display)
- **Image Optimization**: Use Next.js Image for all images
- **Font Loading**: Preload Inter font, use font-display: swap
- **LLM Caching**: Cache identical profile → plan requests
- **Database Indexes**: GIN index on JSONB for fast queries
- **API Rate Limiting**: Prevent abuse of expensive endpoints

---

## Dependencies on Other Phases

**Requires**:

- Phase 1 (Setup) - foundation, auth, database, tRPC

**Blocks**:

- Phase 3 (Core Modules) - needs working plan generation system
- Phase 4 (Polish) - needs complete MVP to enhance

---

## Risks & Mitigations

### Risk 1: LLM Generation Reliability

**Mitigation**: Implement retry logic, validate outputs, provide fallback plans

### Risk 2: Onboarding Drop-off

**Mitigation**: Auto-save progress, allow resume, minimize required fields

### Risk 3: Performance on Mobile

**Mitigation**: Mobile-first design, test on real devices, optimize bundle size

### Risk 4: Email Deliverability

**Mitigation**: Use reputable provider (Resend), implement SPF/DKIM, monitor bounce rates

---

## Definition of Done

- [ ] All features implemented and tested
- [ ] User can complete onboarding flow without errors
- [ ] Client profile generates correctly
- [ ] PPC plan generates successfully
- [ ] Summary preview displays all data
- [ ] Email verification works end-to-end
- [ ] Chat interface functional
- [ ] Dashboard displays plan and tasks
- [ ] Mobile responsive across all screens
- [ ] All acceptance criteria met
- [ ] E2E tests passing
- [ ] Performance metrics acceptable (LCP < 2.5s)
- [ ] Deployed to staging environment
- [ ] User acceptance testing complete

---

## Success Metrics

**Conversion Funnel**:

- Landing → Email capture: Target 35%+
- Email → Onboarding start: Target 80%+
- Onboarding → Summary: Target 60%+
- Summary → Verified: Target 70%+

**User Experience**:

- Onboarding completion time: <7 minutes average
- Plan generation time: <30 seconds
- First chat response: <3 seconds

**Technical**:

- Uptime: 99.5%+
- Error rate: <1%
- LLM success rate: 95%+

---

## Next Steps

After MVP is complete, proceed to **Phase 3: Core Modules** to add:

- Blog module integration
- Email module integration
- Social media module integration
- Governance logic for plan merging
- Advanced task scheduling
- Enhanced dashboard features
