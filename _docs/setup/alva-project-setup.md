# Alva Project Planning & Setup

## Phase 1: User Journey & Flow Definition

**Create `user-flow.md`** in `_docs/project-definition/`

- Map the complete user journey through Alva's application
- Cover: Landing → Email capture → Onboarding (26 cards across 5 sections) → Summary preview → Marketing plan delivery → Chat interface
- Include state transitions, navigation patterns, and redirect logic
- Reference the detailed onboarding flow already defined in project-overview.md
- Clarify authentication flow and session management

## Phase 2: Tech Stack Selection & Documentation

**Create `tech-stack.md`** in `_docs/project-definition/`

For each technology category, provide:

- Your stated preference (TypeScript, React, Tailwind, Docker, Postgres, NX)
- Industry standard alternative
- Popular alternative
- Pros/cons comparison
- Compatibility considerations

Categories to cover:

- **Monorepo Structure**: NX (your choice) vs Turborepo vs Lerna
- **Language**: TypeScript (your choice) - document version, config approach
- **Frontend Framework**: React (your choice) vs Vue vs Svelte
- **Styling**: Tailwind (your choice) vs CSS Modules vs Styled Components
- **Component Library**: Shadcn/UI + Radix UI vs MUI vs Chakra
- **Backend Framework**: Next.js App Router vs Remix vs Express + Vite
- **Database**: Postgres (your choice) vs Supabase (Postgres + services) vs MySQL
- **ORM/Query Builder**: Prisma vs Drizzle vs Kysely
- **Authentication**: NextAuth.js vs Clerk vs Supabase Auth
- **AI/LLM Integration**: OpenAI SDK vs Vercel AI SDK vs LangChain
- **API Layer**: tRPC vs REST vs GraphQL
- **State Management**: Zustand vs Jotai vs TanStack Query
- **Deployment**: Docker (your choice) + platform options (Vercel, Railway, Fly.io)
- **Testing**: Vitest + Testing Library vs Jest + Cypress
- **Task Queue/Jobs**: BullMQ vs Inngest vs Trigger.dev

After review, finalize selections and document:

- Best practices for each chosen technology
- Common pitfalls and how to avoid them
- Integration patterns between technologies
- Development workflow considerations

## Phase 3: UI Design Rules

**Create `ui-rules.md`** in `_docs/project-definition/`

Extract and expand from project-overview.md:

- Design philosophy (minimal, premium, intentional)
- Component architecture principles
- Layout patterns (card-based, full-screen moments)
- Interactive elements (pills, sliders, progress bars, file uploads)
- Navigation patterns (Back/Skip/Next controls)
- Responsive behavior (mobile-first strategy)
- Animation & microinteractions (fade-ins, gold pulsing, hover states)
- Accessibility requirements
- Component composition patterns
- Form design standards
- Loading states and error handling patterns

## Phase 4: Theme & Design System

**Create `theme-rules.md`** in `_docs/project-definition/`

Based on project-overview.md brand guide:

- **Color System**:
- Primary palette (Gold #FFD700, Blue #007BFF, etc.)
- Semantic colors (success, danger, warning, info)
- Neutral scale (#1F1F1F to #FAFAFA)
- Color usage rules (when to use each)

- **Typography**:
- Font family (Inter with fallbacks)
- Type scale (headings, body, captions)
- Font weights and their usage
- Line heights and spacing

- **Spacing System**:
- Base unit and scale
- Component spacing patterns
- Layout spacing rules

- **Border & Radius**:
- Standard radius values (8px buttons, 24px pills)
- Border colors and widths

- **Shadows & Elevation**:
- Shadow scale
- When to use elevation

- **Iconography**:
- Icon system selection
- Size standards
- Usage guidelines

## Phase 5: Project Structure & Rules

**Create `project-rules.md`** in `_docs/project-definition/`

Define for AI-first, NX monorepo architecture:

- **Directory Structure**:
- NX workspace layout (apps/, libs/, tools/)
- App organization (Next.js structure within apps)
- Shared library organization (ui, utils, data-access, feature)
- Asset organization

- **File Naming Conventions**:
- Components (PascalCase)
- Utilities (camelCase)
- Types/interfaces (PascalCase with .types.ts)
- API routes
- Test files

- **Code Organization**:
- @fileoverview requirement for all files
- Function documentation (JSDoc/TSDoc)
- 500 line file limit enforcement
- Import order standards
- Barrel exports pattern

- **NX-Specific Patterns**:
- Library boundaries and dependencies
- Shared component patterns
- Code generation templates
- Build and test conventions

## Phase 6: Development Phases

**Create phase documents** in `_docs/phases/`

Following the iterative development model:

**`01-setup-phase.md`** - Barebones Foundation

- NX workspace initialization
- Core dependencies setup
- Database schema (client profiles, marketing plans)
- Authentication scaffolding
- Basic Next.js app structure
- Deliverable: Running framework with health check

**`02-mvp-phase.md`** - Minimum Viable Product

- Email capture landing page
- 26-card onboarding flow (all 5 sections)
- Client profile JSON generation
- Basic marketing plan generation (PPC module)
- Summary preview page
- Simple chat interface with Alva
- Deliverable: End-to-end onboarding → plan delivery

**`03-core-modules-phase.md`** - Marketing Intelligence

- Blog module integration
- Email module integration
- Social media module integration
- Governance logic for plan merging
- Task scheduling and prioritization
- Dashboard (Quick Win, deadlines, streaks)
- Deliverable: Multi-module plan generation

**`04-polish-phase.md`** - Production Ready

- Action Board (task management Kanban)
- Calendar integrations
- External refs (ClickUp, Google Cal)
- Performance optimization
- Error handling and monitoring
- Full test coverage
- Deliverable: Production-ready platform

Each phase document should include:

- Clear scope and objectives
- Feature breakdown with actionable steps (max 5 per feature)
- Technical approach and patterns
- Dependencies on previous phases
- Success criteria

## Phase 7: Documentation Finalization

**Update `README.md`** in project root

- Project overview and mission
- Tech stack summary
- Getting started guide
- Development workflow
- Project structure overview
- Contributing guidelines
- Link to detailed docs

**Organize Documentation**

- Verify all docs in correct `_docs/` locations
- Create index/navigation in \_docs/README.md if needed
- Ensure consistent formatting across all docs

## Phase 8: Development Setup

After all documentation is complete and reviewed:

- Initialize NX workspace
- Set up initial project structure per project-rules.md
- Configure tooling (linting, formatting, git hooks)
- Set up development environment
- Begin setup-phase implementation

---

## Key Deliverables

1. ✓ `_docs/overview/project-overview.md` (existing)
2. `_docs/project-definition/user-flow.md`
3. `_docs/project-definition/tech-stack.md`
4. `_docs/project-definition/ui-rules.md`
5. `_docs/project-definition/theme-rules.md`
6. `_docs/project-definition/project-rules.md`
7. `_docs/phases/01-setup-phase.md`
8. `_docs/phases/02-mvp-phase.md`
9. `_docs/phases/03-core-modules-phase.md`
10. `_docs/phases/04-polish-phase.md`
11. Updated `README.md`
12. Organized documentation structure

## Success Criteria

- All planning documents created and comprehensive
- Tech stack fully evaluated with clear rationale
- UI/UX guidelines extracted and expanded from brand guide
- Development phases clearly defined with actionable steps
- Project ready for implementation kickoff
