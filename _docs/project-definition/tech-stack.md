# Alva Tech Stack

**@fileoverview** Comprehensive technology stack documentation for the Alva marketing platform, including selected technologies, alternatives considered, and implementation best practices.

---

## Stack Overview

Alva is built as a modern, AI-first application using a monorepo architecture optimized for scalability, developer experience, and maintainability.

### Core Principles

- **AI-First**: Optimized for LLM integration and JSON-based workflows
- **Type Safety**: End-to-end TypeScript for reliability
- **Modular**: NX monorepo for clear boundaries and reusability
- **Performance**: Docker containerization for consistent deployments
- **Scalable**: Postgres for robust data management

---

## Technology Decisions

### 1. Monorepo Structure

#### ✅ Selected: **NX**

**Why NX**:

- Advanced dependency graph visualization and enforcement
- Built-in code generators and workspace consistency
- Powerful caching and affected command computation
- Excellent TypeScript and React support
- Strong community and enterprise adoption

**Industry Standard Alternative: Turborepo**

- **Pros**: Simpler learning curve, faster setup, Vercel-backed
- **Cons**: Less mature plugin ecosystem, fewer built-in generators
- **Use Case**: Teams wanting minimal configuration

**Popular Alternative: Lerna**

- **Pros**: Pioneer in monorepo space, wide adoption
- **Cons**: Development has slowed, less feature-rich than NX/Turbo
- **Use Case**: Legacy projects or simple package management

**NX Best Practices**:

- Define clear library boundaries (apps/, libs/)
- Use `@nx/enforce-module-boundaries` ESLint rule
- Leverage affected commands in CI: `nx affected:test`
- Create project-specific generators for consistency
- Tag libraries by scope: `type:feature`, `scope:marketing`, etc.

**Common Pitfalls**:

- ❌ Creating too many small libraries (increases complexity)
- ❌ Circular dependencies between libraries
- ❌ Not defining proper dependency constraints
- ✅ Start with apps and feature libraries, add more granularity as needed

---

### 2. Programming Language

#### ✅ Selected: **TypeScript 5.3+**

**Configuration Approach**:

- Strict mode enabled (`strict: true`)
- Path aliases for clean imports (`@alva/*`)
- Shared tsconfig.base.json for workspace consistency

**Why TypeScript**:

- Prevents runtime errors through compile-time type checking
- Superior IDE support (autocomplete, refactoring)
- Essential for complex LLM response parsing and JSON schemas
- Industry standard for modern JavaScript development

**Best Practices**:

- Use discriminated unions for state management
- Leverage utility types (`Partial`, `Pick`, `Omit`)
- Create Zod schemas for runtime validation
- Avoid `any`, use `unknown` when type is truly unknown
- Co-locate types with implementations (e.g., `user.types.ts` with `user.service.ts`)

**Common Pitfalls**:

- ❌ Using `as` type assertions excessively (bypasses type safety)
- ❌ Defining types in global scope leading to conflicts
- ❌ Not utilizing discriminated unions for variant data
- ✅ Use type guards and Zod for runtime safety

**Configuration**:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "@alva/ui/*": ["libs/ui/src/*"],
      "@alva/data-access/*": ["libs/data-access/src/*"]
    }
  }
}
```

---

### 3. Frontend Framework

#### ✅ Selected: **React 18+**

**Why React**:

- Largest ecosystem and community
- Proven at scale (Meta, Airbnb, Netflix)
- Excellent TypeScript support
- Best-in-class developer tools
- Seamless Next.js integration

**Industry Standard Alternative: Vue 3**

- **Pros**: Gentler learning curve, excellent documentation, composition API
- **Cons**: Smaller ecosystem, fewer enterprise libraries
- **Use Case**: Teams preferring template-based development

**Popular Alternative: Svelte**

- **Pros**: No virtual DOM (faster), less boilerplate, smaller bundles
- **Cons**: Smaller community, fewer libraries, less TypeScript maturity
- **Use Case**: Performance-critical apps with simple requirements

**React Best Practices**:

- Use functional components exclusively
- Prefer composition over inheritance
- Keep components small (<250 lines)
- Use custom hooks for logic reuse
- Memoize expensive computations with `useMemo`
- Avoid inline function definitions in JSX (use `useCallback`)

**Common Pitfalls**:

- ❌ Prop drilling (use context or state management)
- ❌ Not memoizing callback props leading to re-renders
- ❌ Large components mixing logic and UI
- ✅ Extract hooks, separate concerns, use context wisely

---

### 4. Styling

#### ✅ Selected: **Tailwind CSS 4.0**

**Why Tailwind**:

- Utility-first approach matches our design system
- Eliminates CSS file management
- Built-in responsiveness and dark mode
- Excellent IntelliSense with TypeScript
- Purging ensures minimal bundle size

**Industry Standard Alternative: CSS Modules**

- **Pros**: Scoped styles, traditional CSS, no learning curve
- **Cons**: More files to manage, no design system enforcement
- **Use Case**: Teams with strong CSS expertise

**Popular Alternative: Styled Components**

- **Pros**: CSS-in-JS, dynamic styling, component-scoped
- **Cons**: Runtime overhead, larger bundles, requires babel
- **Use Case**: Highly dynamic theming requirements

**Tailwind Best Practices**:

- Use `@apply` sparingly (defeats the purpose)
- Define custom design tokens in `tailwind.config.ts`
- Use `clsx` or `cn` helper for conditional classes
- Create component variants using `cva` (class-variance-authority)
- Prefix custom utilities with project name

**Common Pitfalls**:

- ❌ Repeating long class strings (extract components)
- ❌ Not using design token variables
- ❌ Overusing `@apply` (negates utility benefits)
- ✅ Use `cn()` helper, define design tokens, extract reusable components

**Configuration**:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        "alva-blue": "#007BFF",
        "dark-text": "#1F1F1F",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
};
```

---

### 5. Component Library

#### ✅ Selected: **Shadcn/UI + Radix UI**

**Why Shadcn + Radix**:

- Copy-paste components (full ownership, no package bloat)
- Built on unstyled Radix primitives (accessibility built-in)
- Tailwind-first design
- Customizable without fighting abstractions
- Excellent TypeScript support

**Industry Standard Alternative: Material UI (MUI)**

- **Pros**: Comprehensive component set, battle-tested, strong community
- **Cons**: Opinionated design, harder to customize, larger bundle
- **Use Case**: Teams wanting complete UI framework

**Popular Alternative: Chakra UI**

- **Pros**: Great DX, built-in dark mode, composable components
- **Cons**: Emotion dependency, less customizable than Shadcn
- **Use Case**: Rapid prototyping with good defaults

**Shadcn Best Practices**:

- Install only components you need
- Customize component styles to match design system
- Use Radix primitives for complex interactions
- Extend with custom variants using CVA
- Document component variations in Storybook

**Common Pitfalls**:

- ❌ Installing all components upfront
- ❌ Not customizing to brand (defeats the purpose)
- ❌ Ignoring accessibility props from Radix
- ✅ Cherry-pick components, customize fully, maintain a11y

---

### 6. Backend Framework

#### ✅ Selected: **Next.js 14+ App Router**

**Why Next.js App Router**:

- Server Components reduce client bundle
- Built-in API routes (no separate backend)
- Streaming and Suspense support
- Edge runtime for low-latency responses
- Excellent TypeScript and React integration
- File-based routing matches our flow structure

**Industry Standard Alternative: Remix**

- **Pros**: Excellent data loading, web fundamentals focus, nested routing
- **Cons**: Smaller ecosystem, less corporate backing
- **Use Case**: Teams prioritizing web standards and progressive enhancement

**Popular Alternative: Express + Vite**

- **Pros**: Full control, minimal magic, battle-tested
- **Cons**: More boilerplate, no built-in SSR, separate frontend config
- **Use Case**: API-first applications or microservices

**Next.js Best Practices**:

- Use Server Components by default
- Mark Client Components explicitly (`'use client'`)
- Leverage route handlers for API endpoints: `/app/api/*/route.ts`
- Use Server Actions for mutations
- Implement loading.tsx and error.tsx for better UX
- Use middleware for auth checks

**Common Pitfalls**:

- ❌ Making everything a Client Component
- ❌ Not using parallel routes for complex layouts
- ❌ Fetching in Client Components when Server Components would suffice
- ✅ Default to Server Components, optimize data fetching, use streaming

**File Structure**:

```
apps/web/app/
├── (auth)/              # Auth route group
│   ├── login/
│   └── verify/
├── (dashboard)/         # Protected routes
│   ├── layout.tsx      # Auth check, sidebar
│   ├── page.tsx        # Dashboard home
│   └── action-board/
├── api/                 # API routes
│   ├── onboarding/
│   └── plans/
└── layout.tsx          # Root layout
```

---

### 7. Database

#### ✅ Selected: **PostgreSQL 16+**

**Why Postgres**:

- JSONB support perfect for `client_info.json` and plans
- Robust ACID compliance
- Excellent performance at scale
- Rich ecosystem (extensions, tools)
- Industry standard for production apps

**Industry Standard Alternative: Supabase (Postgres + Services)**

- **Pros**: Postgres + Auth + Storage + Realtime, generous free tier
- **Cons**: Vendor lock-in, less control over infrastructure
- **Use Case**: Startups wanting all-in-one solution

**Popular Alternative: MySQL**

- **Pros**: Simpler, wide hosting support, good performance
- **Cons**: Weaker JSON support, fewer advanced features
- **Use Case**: Traditional web apps with simple schemas

**Postgres Best Practices**:

- Use JSONB for flexible schemas (client profiles, plans)
- Index JSONB fields using GIN indexes: `CREATE INDEX idx_gin ON table USING GIN(jsonb_column);`
- Use proper foreign keys and constraints
- Implement row-level security for multi-tenancy
- Regular VACUUM and ANALYZE for performance

**Common Pitfalls**:

- ❌ Storing JSON as TEXT (use JSONB for queryability)
- ❌ Not indexing JSONB query paths
- ❌ Over-normalizing when JSONB would suffice
- ✅ Leverage JSONB, index smartly, use constraints

**Schema Design**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  profile JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profile_gin ON client_profiles USING GIN(profile);
```

---

### 8. ORM / Query Builder

#### ✅ Selected: **Drizzle ORM**

**Why Drizzle**:

- TypeScript-first with excellent inference
- SQL-like syntax (easier to optimize)
- Lightweight with minimal overhead
- Great migration system
- Better performance than Prisma

**Industry Standard Alternative: Prisma**

- **Pros**: Mature ecosystem, graphical studio, migrations
- **Cons**: Larger runtime overhead, generates types (slower DX)
- **Use Case**: Teams wanting batteries-included ORM

**Popular Alternative: Kysely**

- **Pros**: Type-safe SQL query builder, zero runtime overhead
- **Cons**: More verbose, no schema definition (bring your own)
- **Use Case**: Teams wanting full SQL control with type safety

**Drizzle Best Practices**:

- Define schemas in libs/data-access
- Use prepared statements for performance
- Leverage inferSelect and inferInsert types
- Use transactions for multi-step operations
- Generate migrations: `drizzle-kit generate:pg`

**Common Pitfalls**:

- ❌ Not using prepared statements for repeated queries
- ❌ N+1 queries (use joins or `with` for relations)
- ❌ Mixing raw SQL with ORM (stick to one)
- ✅ Use query builder consistently, optimize joins, prepare statements

**Example**:

```ts
// libs/data-access/src/schemas/user.schema.ts
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

### 9. Authentication

#### ✅ Selected: **NextAuth.js v5 (Auth.js)**

**Why NextAuth**:

- Seamless Next.js integration
- Multiple providers (Email, OAuth, Credentials)
- Session management built-in
- Edge runtime compatible
- Active development and community

**Industry Standard Alternative: Clerk**

- **Pros**: Beautiful UI components, user management dashboard, webhooks
- **Cons**: Paid service, vendor lock-in, limits customization
- **Use Case**: SaaS apps wanting turnkey auth

**Popular Alternative: Supabase Auth**

- **Pros**: Row-level security integration, magic links, good DX
- **Cons**: Couples you to Supabase ecosystem
- **Use Case**: Already using Supabase for database

**NextAuth Best Practices**:

- Use database sessions (not JWT) for better security
- Implement email verification flow
- Use middleware for route protection
- Store minimal data in session (ID only, fetch rest)
- Implement proper CSRF protection

**Common Pitfalls**:

- ❌ Storing sensitive data in JWT sessions
- ❌ Not implementing rate limiting on auth endpoints
- ❌ Weak password requirements
- ✅ Database sessions, rate limiting, strong validation

**Configuration**:

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import EmailProvider from "next-auth/providers/email";

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      from: "noreply@alva.app",
      // Custom email sending logic
    }),
  ],
  session: { strategy: "database" },
});
```

---

### 10. AI / LLM Integration

#### ✅ Selected: **Vercel AI SDK + OpenAI SDK**

**Why Vercel AI SDK**:

- Streaming responses out of the box
- React hooks for chat UI (`useChat`)
- Framework agnostic core
- Structured output support
- Tool/function calling built-in

**Combined with OpenAI SDK for**:

- Direct access to latest features
- Fine-grained control over requests
- Custom prompt engineering
- Deterministic JSON mode (temperature=0)

**Industry Standard Alternative: OpenAI SDK only**

- **Pros**: Official SDK, complete feature set, well-documented
- **Cons**: No React integration, manual streaming, more boilerplate
- **Use Case**: Backend-heavy AI workflows

**Popular Alternative: LangChain**

- **Pros**: Multi-provider, chains, agents, extensive tooling
- **Cons**: Heavy abstraction, steeper learning curve, overkill for many use cases
- **Use Case**: Complex agent workflows, multi-step reasoning

**Best Practices**:

- Use Vercel AI SDK for chat interfaces
- Use OpenAI SDK for JSON generation (plan modules)
- Set temperature=0 for deterministic outputs
- Implement retries with exponential backoff
- Stream responses to improve perceived performance
- Validate LLM outputs with Zod schemas

**Common Pitfalls**:

- ❌ Not validating JSON responses (LLMs can hallucinate)
- ❌ Blocking requests waiting for completions
- ❌ Not implementing rate limiting
- ✅ Validate outputs, stream responses, implement retries

**Implementation**:

```ts
// Chat UI with Vercel AI SDK
"use client";
import { useChat } from "ai/react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div>
      {messages.map((m) => (
        <Message key={m.id} {...m} />
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}

// JSON generation with OpenAI SDK
import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0,
  response_format: { type: "json_object" },
  messages: [
    /* ... */
  ],
});
```

---

### 11. API Layer

#### ✅ Selected: **tRPC**

**Why tRPC**:

- End-to-end type safety (client knows server types)
- No code generation step
- Excellent Next.js integration
- React Query built-in
- Minimal boilerplate

**Industry Standard Alternative: REST**

- **Pros**: Universal standard, cacheable, tooling everywhere
- **Cons**: No type safety, manual validation, more files
- **Use Case**: Public APIs, third-party integrations

**Popular Alternative: GraphQL**

- **Pros**: Flexible queries, strong typing, excellent tooling
- **Cons**: Complexity overhead, caching challenges, learning curve
- **Use Case**: Complex data requirements, mobile apps

**tRPC Best Practices**:

- Define routers in libs/data-access
- Use Zod for input validation
- Implement middleware for auth
- Use React Query features (invalidation, optimistic updates)
- Batch requests when possible

**Common Pitfalls**:

- ❌ Exposing too much data in single procedure
- ❌ Not implementing proper error handling
- ❌ Forgetting to invalidate queries on mutations
- ✅ Granular procedures, typed errors, proper cache invalidation

**Setup**:

```ts
// libs/data-access/src/trpc/router.ts
import { router, protectedProcedure } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getProfile: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ input, ctx }) => {
    return ctx.db.query.profiles.findFirst({
      where: eq(profiles.userId, input.userId),
    });
  }),
});

export type AppRouter = typeof appRouter;
```

---

### 12. State Management

#### ✅ Selected: **Zustand (global) + TanStack Query (server)**

**Why This Combo**:

- **Zustand**: Minimal boilerplate, no providers, great DX
- **TanStack Query**: Best-in-class server state (via tRPC)
- Clear separation: Zustand for UI state, TanStack for server state

**Industry Standard Alternative: Redux Toolkit**

- **Pros**: Mature, devtools, time travel debugging, large ecosystem
- **Cons**: More boilerplate, steeper learning curve
- **Use Case**: Complex state machines, need for middleware

**Popular Alternative: Jotai**

- **Pros**: Atomic state, bottom-up composition, great TypeScript
- **Cons**: Smaller community, more conceptual overhead
- **Use Case**: Apps with many independent state atoms

**Best Practices**:

- Use Zustand for: theme, modal state, form wizard progress
- Use TanStack Query (via tRPC) for: server data, mutations
- Keep stores small and focused
- Use selectors to prevent re-renders
- Persist critical state to localStorage

**Common Pitfalls**:

- ❌ Storing server data in Zustand (use TanStack Query)
- ❌ Creating one massive store
- ❌ Not using selectors (causes unnecessary renders)
- ✅ Separate concerns, multiple small stores, use selectors

**Example**:

```ts
// libs/ui/src/stores/onboarding.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  currentSection: string;
  currentCard: number;
  responses: Record<string, any>;
  setSection: (section: string) => void;
  setCard: (card: number) => void;
  saveResponse: (key: string, value: any) => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      currentSection: "brand-clarity",
      currentCard: 1,
      responses: {},
      setSection: (section) => set({ currentSection: section }),
      setCard: (card) => set({ currentCard: card }),
      saveResponse: (key, value) =>
        set((state) => ({
          responses: { ...state.responses, [key]: value },
        })),
    }),
    { name: "onboarding-storage" }
  )
);
```

---

### 13. Deployment & Infrastructure

#### ✅ Selected: **Docker + Vercel/Railway**

**Why Docker + Platform**:

- **Docker**: Consistent environments (dev, staging, prod)
- **Vercel**: Zero-config Next.js deployments, edge network, previews
- **Railway**: Database hosting, background jobs, full control

**Alternative**: Docker + Fly.io

- **Pros**: True multi-region, cheaper, more control
- **Cons**: More ops overhead, manual scaling
- **Use Case**: Cost-conscious teams with DevOps skills

**Alternative**: Docker + AWS (ECS/Fargate)

- **Pros**: Enterprise-grade, full AWS ecosystem, scalable
- **Cons**: Complex setup, higher costs, steeper learning curve
- **Use Case**: Enterprise deployments, compliance requirements

**Docker Best Practices**:

- Multi-stage builds for smaller images
- Use `.dockerignore` to exclude unnecessary files
- Leverage layer caching (install deps before copying code)
- Use specific base image versions (not `latest`)
- Run as non-root user

**Common Pitfalls**:

- ❌ Installing dev dependencies in production image
- ❌ Copying entire workspace (bloats image)
- ❌ Not using build caching effectively
- ✅ Multi-stage builds, specific COPY commands, cache optimization

**Dockerfile**:

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm nx build web --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/web ./
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

### 14. Testing

#### ✅ Selected: **Vitest + Testing Library + Playwright**

**Why This Combo**:

- **Vitest**: Fast, Vite-native, Jest-compatible API
- **Testing Library**: Best practices (test user behavior, not implementation)
- **Playwright**: Reliable E2E, cross-browser, great debugging

**Industry Standard Alternative: Jest + Cypress**

- **Pros**: Mature, widely adopted, extensive ecosystem
- **Cons**: Slower than Vitest, Cypress has flakiness issues
- **Use Case**: Teams with existing Jest/Cypress infrastructure

**Vitest Best Practices**:

- Co-locate tests: `component.tsx` → `component.test.tsx`
- Use `describe` for grouping, `it` for test cases
- Mock external dependencies (APIs, LLMs)
- Test user behavior, not implementation details
- Aim for >80% coverage on critical paths

**Playwright Best Practices**:

- Use Page Object Model for reusable flows
- Test critical paths only (not every variant)
- Run on CI for every PR
- Use fixtures for auth states
- Record traces for debugging

**Common Pitfalls**:

- ❌ Testing implementation (query by class/id vs role/text)
- ❌ E2E tests that are too granular (slow suite)
- ❌ Not mocking LLM calls (expensive, unpredictable)
- ✅ Test behavior, critical E2E only, mock externals

**Example**:

```ts
// libs/ui/src/components/Button.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### 15. Task Queue / Background Jobs

#### ✅ Selected: **BullMQ**

**Why BullMQ**:

- Redis-backed, reliable, persistent
- Priority queues, delayed jobs, retries
- Great TypeScript support
- Dashboard for monitoring
- Production-proven at scale

**Industry Standard Alternative: Inngest**

- **Pros**: Serverless, event-driven, great DX, durable execution
- **Cons**: Vendor lock-in, paid service beyond free tier
- **Use Case**: Serverless-first teams, complex workflows

**Popular Alternative: Trigger.dev**

- **Pros**: Built for Next.js, versioned jobs, observability
- **Cons**: Newer, smaller community, platform dependency
- **Use Case**: Next.js apps wanting native background jobs

**BullMQ Best Practices**:

- Define jobs in libs/jobs
- Use named queues: `plan-generation`, `email-sending`
- Implement retry logic with exponential backoff
- Monitor queue health (length, waiting, active)
- Use job events for observability

**Common Pitfalls**:

- ❌ Not handling job failures (no retries)
- ❌ Blocking queue workers with slow operations
- ❌ No monitoring (queues can back up silently)
- ✅ Implement retries, keep jobs fast, monitor metrics

**Setup**:

```ts
// libs/jobs/src/queues/plan-generation.queue.ts
import { Queue, Worker } from "bullmq";

export const planGenerationQueue = new Queue("plan-generation", {
  connection: { host: "localhost", port: 6379 },
});

export const planGenerationWorker = new Worker(
  "plan-generation",
  async (job) => {
    const { clientProfile } = job.data;
    // Generate plan (can take 10-30s)
    const plan = await generatePlan(clientProfile);
    return plan;
  },
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: 5,
  }
);
```

---

## Development Workflow

### Local Development

1. **Clone repo**: `git clone <repo>`
2. **Install dependencies**: `pnpm install`
3. **Start services**: `docker-compose up -d` (Postgres, Redis)
4. **Run migrations**: `pnpm nx run data-access:migrate`
5. **Start dev server**: `pnpm nx serve web`

### Code Quality

- **Linting**: ESLint with TypeScript, React, and NX rules
- **Formatting**: Prettier with 2-space indent, single quotes
- **Type Checking**: `pnpm nx run-many -t typecheck`
- **Pre-commit**: Husky + lint-staged for auto-formatting

### CI/CD Pipeline

1. **PR Checks**:
   - Lint: `nx affected:lint`
   - Type check: `nx affected:typecheck`
   - Test: `nx affected:test`
   - Build: `nx affected:build`
2. **Merge to main**:
   - Run full test suite
   - Build Docker images
   - Deploy to staging (Railway)
3. **Production Deploy**:
   - Manual approval
   - Deploy to Vercel (web)
   - Deploy to Railway (API, jobs, DB)

---

## Technology Integration Patterns

### Frontend → Backend

- **Client Components** call tRPC procedures
- **Server Components** fetch directly from database (bypassing tRPC)
- **Server Actions** handle form mutations

### Backend → Database

- **Drizzle ORM** for type-safe queries
- **Migrations** managed via `drizzle-kit`
- **Connection pooling** via `pg-pool`

### Backend → LLM

- **Chat UI**: Vercel AI SDK → API route → OpenAI streaming
- **Plan Generation**: API route → BullMQ job → OpenAI (JSON mode) → Validate with Zod → Store in Postgres

### State Flow

1. User interacts with UI (Zustand for local state)
2. Mutation via tRPC (optimistic update)
3. Server validates, processes, stores
4. TanStack Query invalidates, refetches
5. UI updates reactively

---

## Performance Considerations

### Frontend

- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image with Vercel CDN
- **Font Optimization**: Next.js Font with subset preloading
- **Bundle Size**: Analyze with `@next/bundle-analyzer`

### Backend

- **Database**: Connection pooling, prepared statements, indexes
- **Caching**: Redis for session, LLM responses (on identical inputs)
- **Edge Runtime**: Deploy API routes to edge where possible

### Monitoring

- **Vercel Analytics**: Web vitals, page performance
- **Sentry**: Error tracking, performance monitoring
- **Postgres**: pg_stat_statements for slow queries
- **BullMQ**: Queue metrics dashboard

---

## Security Best Practices

### Authentication

- Email verification required before full access
- Rate limiting on auth endpoints (5 attempts / 15 min)
- Secure session cookies (httpOnly, secure, sameSite)
- CSRF protection via NextAuth

### Data Protection

- Input validation with Zod on all endpoints
- SQL injection prevention via Drizzle (parameterized queries)
- XSS protection via React (escaped by default)
- Sensitive data encrypted at rest (Postgres + pgcrypto)

### API Security

- tRPC middleware for authentication checks
- Rate limiting on LLM endpoints (prevent abuse)
- API key rotation for third-party services
- Environment variables for secrets (never commit)

---

## Scaling Strategy

### Horizontal Scaling

- **Web**: Vercel auto-scales
- **API**: Railway scales containers based on CPU/memory
- **Workers**: BullMQ workers scale independently
- **Database**: Postgres read replicas for heavy reads

### Vertical Scaling

- Start: 1 web, 1 API, 1 worker, 1 DB (shared Postgres)
- Growth: Scale workers first (plan generation is bottleneck)
- Scale: Separate databases per concern (analytics, transactional)

### Cost Optimization

- Use edge runtime for cacheable endpoints
- Batch LLM requests where possible
- Implement tiered caching (Redis → Postgres → LLM)
- Monitor usage, set budget alerts

---

## Migration Path (If Needed)

### From Prisma to Drizzle

1. Export Prisma schema
2. Generate Drizzle schema from SQL
3. Update queries incrementally
4. Test thoroughly, deploy

### From REST to tRPC

1. Create tRPC router alongside REST
2. Migrate endpoints one by one
3. Update client to use tRPC hooks
4. Deprecate REST once migration complete

### From Vercel to Self-Hosted

1. Dockerfile already supports any platform
2. Move to Railway/Fly.io
3. Configure CDN (Cloudflare) for static assets
4. Update environment variables

---

## Recommended VS Code Extensions

- **ESLint**: Auto-fix on save
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Class autocomplete
- **Nx Console**: Visual project graph
- **Error Lens**: Inline error display
- **Pretty TypeScript Errors**: Readable TS errors

---

## Final Stack Summary

| Category       | Technology               | Why                                     |
| -------------- | ------------------------ | --------------------------------------- |
| **Monorepo**   | NX                       | Advanced tooling, caching, generators   |
| **Language**   | TypeScript 5.3+          | Type safety, essential for AI workflows |
| **Frontend**   | React 18                 | Largest ecosystem, proven at scale      |
| **Styling**    | Tailwind CSS 4.0         | Utility-first, matches design system    |
| **Components** | Shadcn/UI + Radix        | Full control, accessible, customizable  |
| **Backend**    | Next.js 14 App Router    | Server Components, built-in API         |
| **Database**   | PostgreSQL 16            | JSONB support, robust, scalable         |
| **ORM**        | Drizzle                  | TypeScript-first, performant            |
| **Auth**       | NextAuth.js v5           | Seamless Next.js integration            |
| **AI/LLM**     | Vercel AI SDK + OpenAI   | Streaming, React hooks, JSON mode       |
| **API**        | tRPC                     | End-to-end type safety                  |
| **State**      | Zustand + TanStack Query | Minimal for UI, powerful for server     |
| **Deploy**     | Docker + Vercel/Railway  | Consistent, scalable, DX-first          |
| **Testing**    | Vitest + Playwright      | Fast, reliable, modern                  |
| **Jobs**       | BullMQ                   | Redis-backed, production-ready          |

This stack provides a solid foundation for building Alva as a scalable, maintainable, AI-first marketing platform.
