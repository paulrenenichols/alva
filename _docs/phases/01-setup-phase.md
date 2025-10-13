# Phase 1: Setup & Foundation

**@fileoverview** Initial setup phase for Alva - establishing the barebones infrastructure, workspace configuration, and foundational systems needed for development.

---

## Phase Overview

**Goal**: Create a running, deployable foundation with core infrastructure in place

**Duration**: 1-2 weeks

**Deliverable**: A functional Next.js application with database, authentication scaffolding, and basic health checks

**Success Criteria**:

- ✅ NX monorepo initialized and configured
- ✅ Next.js app running locally and in Docker
- ✅ Database connected with initial schema
- ✅ Authentication system scaffolded
- ✅ CI/CD pipeline functional
- ✅ Development environment documented

---

## Features & Tasks

### 1. NX Workspace Initialization

**Objective**: Set up the monorepo structure with NX

**Tasks**:

1. Initialize NX workspace with Next.js preset
   - Run `npx create-nx-workspace@latest alva --preset=next`
   - Configure TypeScript strict mode
   - Set up path aliases (@alva/\*)
2. Configure workspace libraries structure
   - Create `libs/ui`, `libs/data-access`, `libs/utils`, `libs/types` placeholders
   - Set up NX library tags (type:ui, type:feature, etc.)
   - Configure module boundaries in ESLint
3. Set up development tools
   - Install and configure Prettier
   - Install and configure ESLint with Next.js, React, and TypeScript rules
   - Set up Husky pre-commit hooks
   - Configure lint-staged for auto-formatting

**Dependencies**: None

**Acceptance Criteria**:

- NX commands work (`nx serve web`, `nx test`, etc.)
- Libraries import correctly using path aliases
- Pre-commit hooks format code automatically
- ESLint enforces module boundaries

---

### 2. Database Setup (PostgreSQL + Drizzle)

**Objective**: Establish database connection and ORM configuration

**Tasks**:

1. Set up PostgreSQL with Docker Compose
   - Create `docker-compose.yml` with Postgres 16 service
   - Configure environment variables (DATABASE_URL)
   - Add volume mounts for data persistence
2. Install and configure Drizzle ORM
   - Install `drizzle-orm`, `drizzle-kit`, `pg` packages
   - Create `libs/data-access/src/db/client.ts` connection
   - Configure `drizzle.config.ts` for migrations
3. Create initial database schemas
   - User schema (`id`, `email`, `verified`, `created_at`)
   - Session schema (for NextAuth)
   - Client profile schema (`user_id`, `profile` JSONB)
   - Create and run initial migration
4. Set up connection pooling
   - Configure pg pool with sensible defaults
   - Add connection error handling
   - Create health check endpoint

**Dependencies**: Docker installed

**Acceptance Criteria**:

- Database starts with `docker-compose up`
- Drizzle can connect and run migrations
- Schemas are created in database
- Health check endpoint returns database status

---

### 3. Next.js App Structure

**Objective**: Set up Next.js 14 with App Router and initial routes

**Tasks**:

1. Configure Next.js application
   - Set up `apps/web/app` directory structure
   - Configure `next.config.js` (image domains, env vars)
   - Set up root `layout.tsx` and `page.tsx`
2. Create route groups
   - `(auth)` group for authentication routes
   - `(dashboard)` group for protected routes
   - Create placeholder pages for each route
3. Set up global styles
   - Install Tailwind CSS 4.0
   - Configure `tailwind.config.ts` with design tokens from theme-rules.md
   - Create `globals.css` with CSS custom properties
   - Import Inter font from Google Fonts
4. Configure metadata and SEO
   - Set up dynamic metadata API
   - Configure OpenGraph tags
   - Add favicon and app icons

**Dependencies**: NX workspace setup

**Acceptance Criteria**:

- Next.js dev server runs (`nx serve web`)
- All route groups accessible
- Tailwind classes work with design tokens
- Inter font loads correctly

---

### 4. Authentication Scaffolding

**Objective**: Set up NextAuth.js v5 (Auth.js) with email provider

**Tasks**:

1. Install and configure NextAuth
   - Install `next-auth@beta`, `@auth/drizzle-adapter`
   - Create `apps/web/app/api/auth/[...nextauth]/route.ts`
   - Configure Drizzle adapter with database schemas
2. Set up email verification flow
   - Configure email provider (use Resend or similar)
   - Create verification token system
   - Add email templates for magic links
3. Implement middleware for route protection
   - Create `apps/web/middleware.ts`
   - Protect dashboard routes
   - Redirect unauthenticated users to login
4. Create auth utility functions
   - `getSession()` helper for server components
   - `useSession()` hook for client components
   - Auth status checking utilities

**Dependencies**: Database setup

**Acceptance Criteria**:

- Email magic link login works
- Protected routes require authentication
- Session persists across page reloads
- Sign out functionality works

---

### 5. tRPC Setup

**Objective**: Configure type-safe API layer with tRPC

**Tasks**:

1. Install tRPC with React Query
   - Install `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`
   - Create `libs/data-access/src/trpc` directory structure
2. Configure tRPC server
   - Create context with auth session
   - Set up router structure
   - Create auth middleware (protectedProcedure)
3. Set up tRPC client in Next.js
   - Create app provider with React Query
   - Configure tRPC client with API endpoint
   - Add dev tools for React Query
4. Create initial routers
   - Health check router (public)
   - User router (protected) with `getMe` procedure
   - Test with simple queries

**Dependencies**: Authentication setup

**Acceptance Criteria**:

- tRPC procedures callable from client
- Type inference works (client knows server types)
- Auth middleware blocks unauthenticated requests
- React Query dev tools accessible

---

### 6. Docker Configuration

**Objective**: Containerize the application for consistent deployment

**Tasks**:

1. Create multi-stage Dockerfile for Next.js
   - Base stage with Node 20
   - Builder stage with NX build
   - Runner stage with production optimizations
2. Configure Docker Compose for local development
   - Web service (Next.js)
   - Database service (Postgres)
   - Redis service (for future job queue)
3. Optimize Docker build
   - Use `.dockerignore` to exclude unnecessary files
   - Leverage layer caching
   - Use specific base image versions
4. Create development and production configs
   - `docker-compose.yml` for local dev
   - `docker-compose.prod.yml` for production
   - Environment variable templates

**Dependencies**: Next.js app setup

**Acceptance Criteria**:

- `docker-compose up` starts all services
- Next.js app accessible in container
- Database migrations run on container start
- Hot reload works in development mode

---

### 7. CI/CD Pipeline

**Objective**: Automate testing, building, and deployment

**Tasks**:

1. Set up GitHub Actions workflows
   - Create `.github/workflows/ci.yml`
   - Run on pull requests and main branch
   - Configure NX Cloud for caching (optional)
2. Create CI checks
   - Lint: `nx affected:lint`
   - Type check: `nx affected:typecheck`
   - Test: `nx affected:test`
   - Build: `nx affected:build`
3. Set up deployment workflow
   - Build Docker image
   - Push to registry (GitHub Container Registry)
   - Deploy to staging environment (Railway/Vercel)
4. Configure branch protection
   - Require CI checks to pass
   - Require code review
   - Enforce conventional commits

**Dependencies**: Docker configuration

**Acceptance Criteria**:

- CI runs on every PR
- Failed checks block merge
- Docker image builds successfully
- Staging deployment works

---

### 8. Development Environment Setup

**Objective**: Document and streamline developer onboarding

**Tasks**:

1. Create comprehensive setup documentation
   - Update README with getting started guide
   - Document environment variables (.env.example)
   - Create CONTRIBUTING.md with workflow
2. Add developer utilities
   - Create seed script for test data
   - Add reset script for local database
   - Create user creation script
3. Set up debugging configuration
   - VS Code launch.json for debugging
   - Configure Chrome DevTools for Next.js
   - Add error boundary for better DX
4. Create development scripts
   - `pnpm dev` - Start all services
   - `pnpm db:migrate` - Run migrations
   - `pnpm db:seed` - Seed database
   - `pnpm db:reset` - Reset and reseed

**Dependencies**: All previous tasks

**Acceptance Criteria**:

- New developer can set up in <30 minutes following README
- All scripts work as documented
- VS Code debugging works
- Seed data creates test users and data

---

## Technical Approach

### Directory Structure After Setup

```
alva/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/
│       │   │   └── login/
│       │   ├── (dashboard)/
│       │   │   └── page.tsx
│       │   ├── api/
│       │   │   ├── auth/[...nextauth]/
│       │   │   └── trpc/[trpc]/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── middleware.ts
│       ├── next.config.js
│       └── tailwind.config.ts
├── libs/
│   ├── data-access/
│   │   └── src/
│   │       ├── db/
│   │       │   ├── schemas/
│   │       │   ├── client.ts
│   │       │   └── index.ts
│   │       └── trpc/
│   │           ├── routers/
│   │           ├── context.ts
│   │           └── index.ts
│   ├── ui/
│   │   └── src/
│   │       └── index.ts
│   ├── utils/
│   │   └── src/
│   │       └── index.ts
│   └── types/
│       └── src/
│           └── index.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── tools/
│   └── scripts/
│       ├── seed.ts
│       └── reset-db.ts
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── nx.json
├── package.json
└── tsconfig.base.json
```

### Key Technologies

- **NX**: Monorepo management and build system
- **Next.js 14**: App Router, Server Components, API routes
- **TypeScript 5.3+**: Strict mode, path aliases
- **PostgreSQL 16**: Primary database with JSONB support
- **Drizzle ORM**: Type-safe database queries
- **NextAuth.js v5**: Authentication with email provider
- **tRPC**: Type-safe API layer
- **Tailwind CSS 4**: Utility-first styling
- **Docker**: Containerization
- **GitHub Actions**: CI/CD

---

## Environment Variables Template

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-change-in-production

# Email (for magic links)
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your-api-key
EMAIL_FROM=noreply@alva.app

# OpenAI (not used yet, but placeholder)
OPENAI_API_KEY=sk-...
```

---

## Testing Strategy

### Unit Tests

- Test utility functions
- Test database schemas (ensure validation works)
- Test tRPC procedures with mocked context

### Integration Tests

- Test auth flow end-to-end
- Test database migrations (up and down)
- Test API routes

### E2E Tests (Minimal)

- Health check endpoint works
- Login flow works
- Protected route redirects correctly

---

## Dependencies on Other Phases

**Blocks**:

- Phase 2 (MVP) - needs this foundation to build features
- Phase 3 (Core Modules) - needs database and API layer
- Phase 4 (Polish) - needs deployment pipeline

**No Dependencies**: This is the first phase

---

## Risks & Mitigations

### Risk 1: Database Migration Issues

**Mitigation**: Test migrations in Docker environment that matches production

### Risk 2: NX Configuration Complexity

**Mitigation**: Start simple, add complexity as needed. Use NX generators for consistency.

### Risk 3: Authentication Edge Cases

**Mitigation**: Use NextAuth's battle-tested patterns, add comprehensive error handling

### Risk 4: Docker Build Time

**Mitigation**: Optimize with multi-stage builds, layer caching, and .dockerignore

---

## Definition of Done

- [ ] All tasks completed and tested
- [ ] Documentation updated (README, .env.example, CONTRIBUTING.md)
- [ ] CI/CD pipeline green
- [ ] Docker containers build and run successfully
- [ ] Database migrations run without errors
- [ ] Authentication flow works end-to-end
- [ ] Health check endpoint returns 200
- [ ] New developer can onboard following README
- [ ] All code reviewed and merged to main
- [ ] Staging deployment successful

---

## Next Steps

After this phase is complete, proceed to **Phase 2: MVP** to build:

- Email capture landing page
- 26-card onboarding flow
- Client profile JSON generation
- Basic marketing plan generation
- Summary preview page
- Simple chat interface with Alva
