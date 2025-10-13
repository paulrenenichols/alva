# Alva User Flow

**@fileoverview** Complete user journey documentation for the Alva marketing platform, covering all user interactions from landing to active plan management.

---

## Overview

Alva provides a seamless journey from discovery to active marketing plan execution. The flow is designed to minimize friction while gathering comprehensive business intelligence for personalized marketing strategy generation.

---

## 1. Landing & Initial Contact

### Entry Points

- **Direct URL**: `alva.app` or custom domain
- **Referral Links**: Partner sites, social media, ads
- **Email Campaigns**: Marketing outreach

### Landing Page (Unauthenticated)

**Route**: `/`

**Content**:

- **Hero Section**
  - Headline: "Your personal marketing director is ready."
  - Subhead: "Alva works with you 24/7 to build and execute a strategy tailored to your business."
  - CTA: Single email input field
  - Design: Gold accents on dark text, minimal layout

**User Actions**:

- Enter email address
- Submit to begin onboarding

**State Transition**:

- Email captured → Create anonymous session
- Navigate to `/onboarding/welcome`

---

## 2. Welcome & Micro-Commitment

### Welcome Screen

**Route**: `/onboarding/welcome`

**Purpose**: Frame the onboarding as a quick, valuable exercise

**Content**:

- **Headline**: "Great, you're in. I just need a few quick details so I can get to know your brand."
- **Subtext**: "26 cards • 5 minutes"
- **CTA Button**: "Let's Go" (Gold, prominent)

**User Actions**:

- Click "Let's Go" → Navigate to `/onboarding/brand-clarity/1`
- Click "Back" → Return to landing

**Data Captured**:

- Email stored in session
- Onboarding start timestamp

---

## 3. Multi-Step Onboarding

### Onboarding Architecture

**Card-Based Flow**: Full-screen swipeable cards organized into 5 thematic sections

**Global Navigation**:

- **Back** (text link, left, blue): Previous card or section
- **Skip** (text link, center, gray): Skip optional cards
- **Next** (button, right, gold): Advance to next card

**Progress Tracking**:

- Section indicator: "Section Name • X of 6"
- Progress bar: 6 segments, current step highlighted in gold

### Section 1: Brand Clarity (6 cards)

**Route Pattern**: `/onboarding/brand-clarity/:cardNumber`

#### Card 1: Basic Information

- **Question**: "What's your business name & what do you sell?"
- **Inputs**:
  - Your name (text)
  - Business name (text)
  - Brief description (textarea)
- **Validation**: Business name required
- **Data Path**: `user_profile.{user_name, business_name, description}`

#### Card 2: Brand Vibe

- **Question**: "What's your brand vibe?"
- **Subtext**: "Choose the best fit for your brand's vibe."
- **Input**: Multi-select pills
  - Bold & Edgy, Fun & Playful, Modern & Innovative, Friendly & Approachable, Calm & Minimal, Elegant & Classic, Earthy & Natural, Retro & Nostalgic, Other (text input)
- **Data Path**: `brand_identity.vibe_tags[]`

#### Card 3: Target Customer

- **Question**: "Who's your dream customer?"
- **Input**: Multi-select with descriptions
  - College Student (18-24), Young Professional (25-34), New Parent (25-40), Homeowner (30-50), Middle-Aged Professional (40-60), Retiree (60+), Teen/Gen Z (13-18), Describe them (text)
- **Data Path**: `target_audience.personas[]`, `target_audience.custom_description`

#### Card 4: Business Focus

- **Question**: "Which of the following best matches your business focus?"
- **Input**: Single select
  - Ecommerce Sales, Local Service Bookings, Lead Generation, Content Monetization, Coaching/Consulting, Subscription Revenue, Event Promotion, App/Software Adoption, Brand Awareness, B2B Relationship Building, Customer Retention, Describe your unique solution (text)
- **Data Path**: `business_model.focus`

#### Card 5: Differentiators

- **Question**: "What makes you stand out?"
- **Input**: Multi-select
  - Better Quality, Faster Turnaround, Unique Design/Style, Personalized/Custom, Best Value for Price, Eco-Friendly/Ethical, Niche Expertise, Killer Customer Experience, Bold Branding/Story, Innovative Technology, Other (text)
- **Data Path**: `brand_identity.differentiators[]`

#### Card 6: Brand Assets

- **Question**: "Do you have colors/fonts already?"
- **Input**: Conditional
  - **Yes** → Upload brand guide (PDF/image), Hex color inputs, Font name fields
  - **No** → "Suggest for me later" button, optional brand reference upload, optional dislikes field
- **Data Path**: `brand_identity.{primary_colors[], fonts[], dislikes[]}`

**Section Completion**: Auto-save → Navigate to `/onboarding/products-offers/1`

### Section 2: Products & Offers (4 cards)

**Route Pattern**: `/onboarding/products-offers/:cardNumber`

#### Card 7: Product/Service Type

- **Question**: "What do you sell?"
- **Input**: Single select with categories
  - Products: Apparel, Beauty, Home, Digital, Subscription Boxes, Handmade, Food/Beverage, Event Merch, Prints/Art, Toys/Games, Tech/Gadgets
  - Services: Coaching, Creative, Local/In-Person, Events, Other
- **Data Path**: `business_model.products[]`

#### Card 8: Special Offers

- **Question**: "Toggle any special offer types you use:"
- **Input**: Multi-toggle
  - Bundles/Kits, Custom Options, Upsells/Add-ons, Subscriptions, Volume Pricing, Free Shipping over $X, Loyalty Program, Other (text)
- **Data Path**: `business_model.offers[]`

#### Card 9: Sales Channels

- **Question**: "Where do people buy from you?"
- **Input**: Multi-select
  - Your Website, Mobile App, DMs/Social Media, Etsy/Amazon/Marketplace, Brick & Mortar, In-Person Events, Manual Orders, Other (text)
- **Data Path**: `business_model.sales_channels[]`

#### Card 10: Promotions

- **Question**: "Do you run sales or seasonal promos?"
- **Input**: Single select with descriptions
  - Yes - Regularly (flash sales, clearance, product drops)
  - Only Around Holidays (Black Friday, seasonal themes)
  - No - I don't run discounts (evergreen pricing)
  - Not Yet - But I'm open to it
- **Data Path**: `business_model.run_promos`

**Section Completion**: Auto-save → Navigate to `/onboarding/content-social/1`

### Section 3: Content & Social (6 cards)

**Route Pattern**: `/onboarding/content-social/:cardNumber`

#### Card 11: Online Presence

- **Question**: "Where do you show up online?"
- **Subtext**: "Select all platforms where you regularly post"
- **Input**: Multi-select toggles
  - Website/Shopify, Email/Newsletter, Etsy/Amazon, TikTok, Instagram, Facebook, Twitter, Pinterest, YouTube/Podcast, LinkedIn, Other (text)
- **Data Path**: `content_presence.platforms[]`

#### Card 12: Content Types

- **Question**: "What do you usually post?"
- **Input**: Multi-toggle
  - Website Blog, Product Photos, Reels/Short Videos, Behind the Scenes, Live Videos/Q&As, Selfies/Talking to Camera, Tips/Education, Memes/Relatable Posts, Other (text)
- **Data Path**: `content_presence.post_types[]`

#### Card 13: Content Preferences

- **Question**: "What kind of content do you love making?"
- **Input**: Multi-select
  - Photoshoots/Styled Product Shots, Short-Form Video, Behind-the-Scenes Process, Talking to Camera/Storytelling, Educational/Tips, Designing Graphics, Writing/Captions, Community Interaction, Audio Content, Other (text)
- **Data Path**: `content_presence.content_preferences[]`

#### Card 14: Personal Visibility

- **Question**: "Do you show your face or voice?"
- **Input**: Single select with descriptions
  - Yes (I regularly show up with my face or voice)
  - No (I prefer to stay behind the scenes)
  - Sometimes (Depends on the content or how I'm feeling)
- **Data Path**: `content_presence.shows_face_or_voice`

#### Card 15: Competitors

- **Question**: "Who are your main competitors?"
- **Subtext**: "Drop competitor URLs to give us context on market alternatives"
- **Input**: Multi-URL input field
- **Data Path**: `content_presence.competitors[]`

#### Card 16: Inspiration

- **Question**: "Any accounts you admire or want to vibe-match?"
- **Input**: Textarea
- **Placeholder**: "Drop any links to websites, Instagram, TikTok, or brand accounts you love the vibe of..."
- **Data Path**: `content_presence.vibe_inspo[]`
- **Optional**: Can skip

**Section Completion**: Auto-save → Navigate to `/onboarding/goals-growth/1`

### Section 4: Goals & Growth (5 cards)

**Route Pattern**: `/onboarding/goals-growth/:cardNumber`

#### Card 17: Marketing Goals

- **Question**: "What are your top 3 marketing goals?"
- **Subtext**: "Select up to 3"
- **Input**: Multi-select (max 3)
  - Increase Sales/Revenue, Grow My Audience, Build Brand Awareness, Boost Engagement, Launch a Product/Offer, Automate My Marketing, Get Consistent With Content, Build Trust/Authority, Test and Learn What Works, Other (text)
- **Data Path**: `marketing_goals.top_goals[]`

#### Card 18: Growth Mode

- **Question**: "Are you growing online, in person, or both?"
- **Input**: Single select with descriptions
  - Online (Digital channels - social, email, ads, ecommerce)
  - In Person (Events, markets, local retail, face-to-face)
  - Both (Actively growing in both areas)
- **Data Path**: `marketing_goals.growth_mode`

#### Card 19: Automation Interests

- **Question**: "Trying to automate anything?"
- **Input**: Conditional
  - **Yes** → Multi-select: Email campaigns, DMs/Lead replies, Shopify/order flows, Social scheduling, Customer onboarding, Ad optimization, Other (text)
  - **No** → Prompt: "What's the one thing in marketing or admin you'd stop doing manually?" (text)
- **Data Path**: `marketing_goals.automation_goals[]`

#### Card 20: Past Successes

- **Question**: "What's worked well in the past?"
- **Input**: Multi-select
  - Instagram posts/reels got engagement, TikTok video went viral/brought sales, Pop-ups/events drove sales, Email campaigns converted, Paid ads resulted in sales/leads, Collaborations brought customers, Giveaways sparked activity, Word of mouth/referrals, My aesthetic/brand look resonated, Other (text)
- **Data Path**: `marketing_goals.past_successes[]`

#### Card 21: Past Failures

- **Question**: "What flopped or felt like a waste?"
- **Input**: Textarea
- **Prompt**: "Anything you tried that didn't work? Something you spent time or money on and it just didn't click."
- **Data Path**: `marketing_goals.past_failures`

**Section Completion**: Auto-save → Navigate to `/onboarding/constraints-tools/1`

### Section 5: Constraints & Tools (5 cards)

**Route Pattern**: `/onboarding/constraints-tools/:cardNumber`

#### Card 22: Time Availability

- **Question**: "How much time can you spend on marketing each week?"
- **Input**: Slider (0-20+ hours)
  - 1h: "Bare Minimum" (Just checking socials, maybe a post)
  - 5h: "Light Touch" (Occasional posts, small promos)
  - 10h: "Serious Effort" (Multi-channel, email, content, promos)
  - 20+h: "Full-Time Energy" (Daily content, strategy, testing, scaling)
- **Visual**: Options highlight in gold as slider moves
- **Data Path**: `constraints.weekly_marketing_time_hours`

#### Card 23: Marketing Budget

- **Question**: "Do you have a budget for marketing or ads?"
- **Input**: Slider with conditional
  - None ($0), Minimal (<$100/month), Some ($100-500), Significant ($500+)
  - If > None: Additional input "How much do you currently spend per month?"
- **Visual**: Options highlight in gold as slider moves
- **Data Path**: `constraints.{budget_level, monthly_ad_budget}`

#### Card 24: Tech Stack

- **Question**: "Do you have a website, CRM, or email list set up?"
- **Input**: Multi-checkbox
  - Website, CRM, Email List, None
- **Data Path**: `constraints.tech_stack[]`

#### Card 25: Brand Guidelines

- **Question**: "Any hard no's for your brand?"
- **Input**: Textarea
- **Prompt**: "Any topics, language, types of content, styles, tactics or values you absolutely want to avoid?"
- **Data Path**: `constraints.brand_nos[]`

#### Card 26: Additional Notes

- **Question**: "Anything else you'd like to share?"
- **Input**: Textarea
- **Prompt**: "Did we miss any information that may be crucial to understanding your business?"
- **Data Path**: `constraints.additional_notes`
- **Optional**: Can skip

**Section Completion**: Auto-save all data → Navigate to `/onboarding/processing`

---

## 4. Processing & Summary

### Loading Phase

**Route**: `/onboarding/processing`

**Duration**: 2-3 seconds

**Content**:

- **Headline**: "Crunching your answers…"
- Animated progress bar or dots (gold accent)
- **Subtext**: "Building your custom marketing plan…"

**Backend Processing**:

- Compile onboarding responses into `client_info.json`
- Store in database linked to email/session
- Trigger initial plan generation (async)

**State Transition**: Auto-navigate to `/onboarding/summary`

### Summary Preview

**Route**: `/onboarding/summary`

**Purpose**: Provide immediate payoff, build trust, allow edits

**Layout**: Slide-style cards stacked vertically

**Content Sections**:

1. **Brand at a Glance**
   - Business name, vibe, colors/fonts, dislikes
2. **Your Dream Customers**
   - Segments + key traits
3. **What You Sell**
   - Products/services + where you sell
4. **Your Goals**
   - Top 2-3 marketing priorities
5. **Tools & Limits**
   - Team size, time, budget
6. **Brand Boundaries**
   - No-go content/tone rules

**Visual Style**:

- Light gray (#F0F0F0) rounded containers
- Section headers in gold (#FFD700), Inter Bold, 16px
- Content in dark text (#1F1F1F)
- Iconography where applicable

**User Actions**:

- **Primary CTA**: "See My Plan" (gold button, black text)
  - If email NOT verified → Show verification modal
  - If email verified → Navigate to `/dashboard`
- **Secondary Link**: "Edit my answers" (blue text)
  - Navigate back to specific onboarding section

---

## 5. Email Verification (If Needed)

### Verification Hook

**Trigger**: Click "See My Plan" from summary (if not verified)

**Modal/Inline Step**:

- **Headline**: "Save your plan & get ongoing advice — verify your email."
- **Action**: Send 1-click verification link to email
- **Options**:
  - Wait for verification (recommended)
  - "Continue without saving" (secondary, limited access)

**Verification Flow**:

1. User receives email
2. Clicks verification link
3. Link includes token: `/verify?token=xxx`
4. Backend verifies token, marks email as verified
5. Redirect to `/dashboard` with success message

**Unverified State**:

- Limited to viewing summary
- Cannot access full dashboard or chat
- Cannot save plans long-term

---

## 6. Marketing Plan Dashboard

### Dashboard Home

**Route**: `/dashboard`

**Authentication**: Required (verified email)

**Layout Sections**:

#### Hero/Status Section

- **Quick Win Card**
  - Title: "Daily Quick Win"
  - Next small, high-impact task (15-20 min)
  - CTA: "Start Task" or "Mark Complete"
  - Streak counter: "🔥 X days in a row"

#### Upcoming Deadlines

- **Next 3 Deadlines** (card layout)
  - Task title, due date, channel tag, estimated time
  - Click to view details or mark complete

#### Plan Overview

- **Plan Summary** (collapsible)
  - Window: Start date → End date
  - Weekly capacity hours
  - Active channels
  - Total tasks: X planned, Y completed

**Navigation**:

- Top nav: Dashboard, Action Board, Chat, Settings
- Secondary: Plan selector (if multiple plans)

**User Actions**:

- View Quick Win details
- Mark tasks complete
- Navigate to Action Board
- Navigate to Chat
- View full plan details

---

## 7. Action Board (Task Management)

### Action Board

**Route**: `/dashboard/action-board`

**Layout**: Kanban-style task board

**Columns**:

- **Planned**: Upcoming tasks
- **In Progress**: Currently working on
- **Completed**: Finished tasks
- **Deferred**: Pushed to later

**Filters**:

- By channel (PPC, Social, Email, Blog, SEO, Ops)
- By priority (Quick Win, Launch/Seasonal, Evergreen)
- By effort (30min, 75min, 210min)
- By date range

**Task Card Display**:

- Title
- Description (truncated)
- Channel tag (color-coded)
- Estimated minutes
- Due date
- Priority indicator
- External refs (ClickUp, Google Cal links if connected)

**User Actions**:

- Drag & drop between columns
- Click task → View detailed modal
- Filter/sort tasks
- Bulk actions (mark complete, defer, etc.)
- Export to external tools

---

## 8. Chat with Alva

### Chat Interface

**Route**: `/dashboard/chat`

**Layout**: Full-screen chat

**Design Elements**:

- **Top Bar**: "Alva's Desk" with gold accent strip
- **Message Area**: Card-based responses (not endless text)
- **Input**: Bottom-fixed text input with send button
- **Thinking Indicator**: Pulsing gold dot when processing

**Initial Message** (first visit):

- "Alright - I've got the basics. Where would you like to start today?"

**Conversation Context**:

- Access to full `client_info.json`
- Access to current `master.json` plan
- Knowledge of completed tasks and progress

**User Actions**:

- Ask questions about strategy
- Request plan modifications
- Get task recommendations
- Seek marketing advice
- Review past decisions

**Response Format**:

- Headings in gold
- Body text in dark (#1F1F1F)
- Actionable items as buttons/links
- Code/technical details in cards

**Capabilities**:

- Answer "What's next?" (reads next planned tasks by priority)
- Explain strategy decisions
- Modify plan based on new inputs
- Generate content ideas
- Provide marketing insights

---

## 9. Settings & Profile

### Settings

**Route**: `/dashboard/settings`

**Sections**:

#### Profile

- Email (verified badge)
- Business name
- Change password
- Delete account

#### Integrations

- Google Calendar (connect/disconnect)
- ClickUp (connect/disconnect)
- Mailchimp/Email provider
- Social media accounts

#### Plan Settings

- Update weekly time availability
- Update monthly budget
- Refresh onboarding data
- Generate new plan

#### Notifications

- Email preferences
- Quick Win reminders
- Deadline alerts

---

## 10. Navigation & State Management

### Route Architecture

```
/ (landing)
/onboarding/welcome
/onboarding/brand-clarity/:cardNumber (1-6)
/onboarding/products-offers/:cardNumber (1-4)
/onboarding/content-social/:cardNumber (1-6)
/onboarding/goals-growth/:cardNumber (1-5)
/onboarding/constraints-tools/:cardNumber (1-5)
/onboarding/processing
/onboarding/summary
/verify?token=xxx
/dashboard (protected)
/dashboard/action-board (protected)
/dashboard/chat (protected)
/dashboard/settings (protected)
```

### Authentication States

1. **Anonymous** (no email)

   - Access: Landing only
   - Redirect: Any other route → `/`

2. **Unverified** (email captured, not verified)

   - Access: Landing, onboarding, summary
   - Redirect: Protected routes → `/onboarding/summary` with verify prompt

3. **Verified** (email verified)
   - Access: All routes
   - Redirect: None

### Data Persistence

**Session Storage** (temporary):

- Onboarding progress (current section/card)
- Partially completed responses
- Anonymous user data pre-verification

**Database** (permanent):

- User account (post-verification)
- Client profile JSON
- Marketing plans (all versions)
- Task completion history
- Chat message history

**Auto-Save Triggers**:

- Every card completion
- Every section completion
- On navigation away from onboarding
- Every 30 seconds during text input

---

## 11. Error States & Edge Cases

### Connection Lost

- **Trigger**: Network error during onboarding
- **Behavior**: Auto-save to localStorage, show reconnection banner
- **Recovery**: Resume from last saved card, sync on reconnect

### Incomplete Onboarding

- **Trigger**: User leaves mid-onboarding
- **Behavior**: Email with resume link sent after 2 hours
- **Recovery**: Resume link → Navigate to last completed card

### Email Already Exists

- **Trigger**: Email entered is already registered
- **Behavior**: Show sign-in option or "Forgot password?"
- **Alternative**: Different email prompt

### Plan Generation Failure

- **Trigger**: Backend error during plan generation
- **Behavior**: Retry up to 3 times, then show error with support contact
- **Recovery**: Manual trigger "Regenerate Plan" button

### Invalid Input

- **Trigger**: Required field empty or invalid format
- **Behavior**: Inline validation message (red), cannot proceed
- **Recovery**: Fix input to proceed

---

## 12. Mobile Considerations

### Responsive Breakpoints

- **Mobile**: < 768px (single column, swipeable cards)
- **Tablet**: 768px - 1024px (adapted layouts)
- **Desktop**: > 1024px (full layouts)

### Mobile-Specific Interactions

- **Onboarding**: Full-screen swipe gestures between cards
- **Dashboard**: Bottom navigation for main sections
- **Action Board**: Simplified to list view with expandable tasks
- **Chat**: Full-screen takeover with slide-up keyboard

### Touch Targets

- Minimum 44px × 44px for all interactive elements
- Adequate spacing between tappable items
- Large, obvious CTAs

---

## Success Metrics

### Completion Rates

- Landing → Email capture: Target 35%+
- Email capture → Onboarding start: Target 80%+
- Onboarding start → Summary: Target 60%+
- Summary → Verified account: Target 70%+

### Engagement Metrics

- Time to complete onboarding: Target < 7 minutes
- Daily Quick Win completion rate: Target 40%+
- Return visitor rate (7-day): Target 50%+
- Chat interactions per week: Target 3+

### Quality Indicators

- Skip rate per card: Monitor for friction points
- Edit rate on summary: Monitor for unclear questions
- Support contacts for flow issues: Minimize

---

## Future Enhancements

### Phase 2+ Features

- Social login (Google, LinkedIn)
- Team collaboration (multi-user accounts)
- Industry templates for faster onboarding
- A/B testing different onboarding sequences
- Progressive profiling (gather data over time)
- Import from existing tools (Google Analytics, Shopify, etc.)
- White-label options for agencies
