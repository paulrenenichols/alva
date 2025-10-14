# Alva Tech Stack

**@fileoverview** Comprehensive technology stack documentation for the Alva marketing platform, including selected technologies, alternatives considered, and implementation best practices.

---

## Stack Overview

Alva is built as a modern, AI-first microservices application using a monorepo architecture optimized for scalability, developer experience, and maintainability.

### Architecture

- **3 Services**: Web (Next.js), API (Fastify), Auth (Fastify)
- **Microservices**: Independent deployment and scaling per service
- **Shared Database**: PostgreSQL with service-specific schemas
- **Service Communication**: REST APIs with JWT authentication

### Core Principles

- **AI-First**: Optimized for LLM integration and JSON-based workflows
- **Type Safety**: End-to-end TypeScript across all services
- **Modular**: NX monorepo for clear boundaries and reusability
- **Performance**: Docker containerization and independent service scaling
- **Scalable**: Microservices architecture with Postgres for robust data management
- **Secure**: Isolated auth service with JWT-based authentication

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

### 6. Frontend Framework

#### ✅ Selected: **Next.js 14+ App Router**

**Why Next.js for Frontend**:

- Server Components reduce client bundle
- Excellent SSR and SEO capabilities
- Streaming and Suspense support
- Edge runtime for low-latency page delivery
- Best-in-class React and TypeScript integration
- File-based routing matches our flow structure
- **No API routes** - Pure frontend, calls external API/Auth services

**Industry Standard Alternative: Remix**

- **Pros**: Excellent data loading, web fundamentals focus, nested routing
- **Cons**: Smaller ecosystem, less corporate backing
- **Use Case**: Teams prioritizing web standards and progressive enhancement

**Popular Alternative: Vite + React**

- **Pros**: Fast build times, minimal config, pure SPA
- **Cons**: No SSR out of the box, manual routing setup
- **Use Case**: Client-heavy apps not needing SEO

**Next.js Best Practices**:

- Use Server Components by default for better performance
- Mark Client Components explicitly (`'use client'`)
- **No API routes** - Use separate API server instead
- Fetch data from API server in Server Components
- Use Server Actions sparingly (prefer API calls)
- Implement loading.tsx and error.tsx for better UX

**Common Pitfalls**:

- ❌ Making everything a Client Component
- ❌ Adding API routes (use dedicated API server instead)
- ❌ Fetching in Client Components when Server Components would suffice
- ✅ Default to Server Components, call external APIs, use streaming

**File Structure**:

```
apps/web/app/
├── (auth)/              # Auth-related pages
│   ├── login/
│   └── verify/
├── (dashboard)/         # Protected routes
│   ├── layout.tsx      # Dashboard layout with nav
│   ├── page.tsx        # Dashboard home
│   ├── action-board/
│   ├── chat/
│   └── settings/
├── onboarding/          # Onboarding flow
│   └── [section]/[card]/
├── layout.tsx          # Root layout
├── page.tsx            # Landing page
└── globals.css         # Global styles
```

---

### 7. API Server Framework

#### ✅ Selected: **Fastify 4.x**

**Why Fastify for API Server**:

- **Performance**: 2-3x faster than Express (critical for LLM-heavy workloads)
- **TypeScript-First**: Excellent type inference throughout
- **Schema Validation**: Built-in JSON Schema, integrates with Zod
- **Plugin System**: Clean, modular architecture
- **Async/Await Native**: Modern error handling and control flow
- **Lightweight**: Minimal overhead, fast startup
- **Production-Ready**: Used by major companies (Microsoft, PayPal)

**Industry Standard Alternative: Express.js**

- **Pros**: Most popular, massive ecosystem, familiar to all Node developers
- **Cons**: Slower, middleware-heavy, less modern TypeScript support
- **Use Case**: Teams with deep Express expertise

**Popular Alternative: NestJS**

- **Pros**: Enterprise-grade structure, dependency injection, built-in modules
- **Cons**: Heavy framework, steep learning curve, more boilerplate
- **Use Case**: Large teams wanting Java/Spring-like patterns

**Popular Alternative: Hono**

- **Pros**: Fastest Node framework, edge-compatible, ultra-modern
- **Cons**: Newer, smaller ecosystem, less mature
- **Use Case**: Edge deployment or extreme performance needs

**Fastify Best Practices**:

- Use plugins for feature modularity (auth plugin, routes plugin, etc.)
- Leverage Fastify's schema validation for all routes
- Use `fastify-type-provider-zod` for Zod integration
- Implement error handler plugin globally
- Use hooks for cross-cutting concerns (logging, timing)
- Organize routes by domain/feature

**Common Pitfalls**:

- ❌ Not registering plugins in correct order
- ❌ Forgetting to await plugin registration
- ❌ Not using schema validation (defeats Fastify's purpose)
- ✅ Use async/await consistently, validate all inputs, organize plugins

**API Structure**:

```
apps/api/
├── src/
│   ├── routes/              # API routes
│   │   ├── plans.routes.ts
│   │   ├── onboarding.routes.ts
│   │   ├── tasks.routes.ts
│   │   └── index.ts
│   ├── services/            # Business logic
│   │   ├── plan-generation.service.ts
│   │   ├── governance.service.ts
│   │   └── index.ts
│   ├── middleware/          # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── index.ts
│   ├── plugins/             # Fastify plugins
│   │   ├── db.plugin.ts
│   │   ├── redis.plugin.ts
│   │   └── index.ts
│   ├── app.ts               # Fastify app setup
│   └── server.ts            # Server entry point
├── Dockerfile
└── tsconfig.json
```

**Example Setup**:

```typescript
// apps/api/src/app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { authMiddleware } from "./middleware/auth.middleware";
import { planRoutes } from "./routes/plans.routes";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register plugins
  await app.register(cors, {
    origin: process.env.WEB_URL,
    credentials: true,
  });

  // Auth middleware
  app.addHook("onRequest", authMiddleware);

  // Register routes
  await app.register(planRoutes, { prefix: "/plans" });

  return app;
}
```

---

### 8. Auth Service Framework

#### ✅ Selected: **Fastify 4.x**

**Why Fastify for Auth Service**:

- **Performance**: Fast token generation and validation
- **TypeScript-First**: Type-safe auth logic critical for security
- **Minimal**: Focused service, no unnecessary bloat
- **Secure**: Easy to audit small, focused codebase
- **Plugin Ecosystem**: JWT, rate limiting, cookies built-in
- **Consistency**: Same stack as API server

**Why Separate Auth Service**:

1. **Security Isolation**: Auth breach doesn't compromise API
2. **Independent Scaling**: Auth scales differently than business logic
3. **Clear Responsibility**: Single purpose - authentication
4. **Easier Auditing**: Small, focused codebase for security reviews
5. **Technology Independence**: Can add different auth methods without touching API

**Auth Service Responsibilities**:

- Email-based registration
- Magic link generation and verification
- JWT access token generation (15 min expiry)
- Refresh token management (7 day expiry)
- Token validation and introspection
- User session management
- Password reset (if adding passwords)

**Auth Service Structure**:

```
apps/auth/
├── src/
│   ├── routes/
│   │   ├── auth.routes.ts      # Login, register, verify
│   │   ├── token.routes.ts     # Refresh, revoke
│   │   └── user.routes.ts      # User management
│   ├── services/
│   │   ├── token.service.ts    # JWT generation/validation
│   │   ├── email.service.ts    # Magic link emails
│   │   └── user.service.ts     # User CRUD
│   ├── middleware/
│   │   ├── rate-limit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── lib/
│   │   ├── jwt.ts              # JWT utilities
│   │   └── crypto.ts           # Hashing, tokens
│   ├── app.ts
│   └── server.ts
├── Dockerfile
└── tsconfig.json
```

**Auth Strategy: Hybrid JWT + Refresh Token**:

```typescript
// apps/auth/src/services/token.service.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

export class TokenService {
  generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email, type: "access" },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "15m", algorithm: "RS256" } // RSA for public/private key
    );
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async storeRefreshToken(userId: string, token: string, device: string) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await db.insert(refreshTokens).values({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      device,
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_PUBLIC_KEY);
  }
}
```

**Best Practices**:

- Use RS256 (RSA) not HS256 for multi-service architecture
- Auth service has private key (signs tokens)
- API service has public key (validates tokens, no network call needed)
- Store refresh tokens hashed in database
- Use httpOnly cookies for refresh tokens (XSS protection)
- Implement token rotation on refresh
- Add device tracking for security

**Common Pitfalls**:

- ❌ Using HS256 with shared secret across services (less secure)
- ❌ Storing refresh tokens in plain text
- ❌ Making access tokens long-lived (defeats purpose)
- ❌ Not implementing rate limiting on auth endpoints
- ✅ Use RS256, hash refresh tokens, short access tokens, rate limit

---

### 9. Database

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

### 10. ORM / Query Builder

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

### 11. API Communication

#### ✅ Selected: **REST APIs with OpenAPI**

**Why REST for Microservices**:

- **Universal**: Every language/platform can consume
- **Stateless**: Perfect for JWT authentication
- **Cacheable**: HTTP caching works out of the box
- **Documented**: OpenAPI/Swagger auto-generates docs
- **Tooling**: Excellent testing, monitoring, debugging tools
- **Independent**: Services don't share code (true microservices)

**REST API Design**:

```typescript
// API Server Routes
GET    /plans                    # List user's plans
POST   /plans/generate           # Generate new plan
GET    /plans/:id                # Get specific plan
PATCH  /plans/:id                # Update plan
DELETE /plans/:id                # Delete plan

GET    /tasks                    # List tasks (with filters)
PATCH  /tasks/:id/complete       # Mark task complete
PATCH  /tasks/:id/defer          # Defer task

POST   /chat/message             # Send chat message (streaming)

// Auth Service Routes
POST   /auth/register            # Register with email
POST   /auth/send-magic-link     # Send login email
POST   /auth/verify-magic-link   # Verify token, return JWT
POST   /auth/refresh             # Refresh access token
POST   /auth/logout              # Revoke refresh token
GET    /auth/me                  # Get current user
```

**OpenAPI Documentation**:

```typescript
// apps/api/src/app.ts
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

await app.register(swagger, {
  openapi: {
    info: {
      title: "Alva API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

await app.register(swaggerUi, {
  routePrefix: "/docs",
});
```

**Alternative: tRPC**

- **Pros**: End-to-end type safety, no code generation
- **Cons**: Requires shared TypeScript code, harder with separate services
- **Decision**: Not suitable for true microservices architecture

**Alternative: GraphQL**

- **Pros**: Flexible queries, strong typing, single endpoint
- **Cons**: Added complexity, caching harder, overkill for internal APIs
- **Use Case**: Complex data requirements, mobile apps

**REST Best Practices**:

- Use standard HTTP methods (GET, POST, PATCH, DELETE)
- Return appropriate status codes (200, 201, 400, 401, 404, 500)
- Use JSON for request/response bodies
- Version your API (/v1/plans)
- Implement CORS properly
- Add rate limiting per endpoint

**Common Pitfalls**:

- ❌ Using GET for mutations
- ❌ Returning 200 for errors
- ❌ Not versioning API
- ❌ Inconsistent response formats
- ✅ Follow REST conventions, use status codes correctly, version API

---

### 12. AI / LLM Integration

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

### 13. State Management

#### ✅ Selected: **Zustand (global) + TanStack Query (server)**

**Why This Combo**:

- **Zustand**: Minimal boilerplate, no providers, great DX for UI state
- **TanStack Query**: Best-in-class server state management with caching
- Clear separation: Zustand for UI state, TanStack Query for API calls
- Works perfectly with REST APIs (no tRPC needed)

**Industry Standard Alternative: Redux Toolkit**

- **Pros**: Mature, devtools, time travel debugging, large ecosystem
- **Cons**: More boilerplate, steeper learning curve
- **Use Case**: Complex state machines, need for middleware

**Popular Alternative: Jotai**

- **Pros**: Atomic state, bottom-up composition, great TypeScript
- **Cons**: Smaller community, more conceptual overhead
- **Use Case**: Apps with many independent state atoms

**Best Practices**:

- Use Zustand for: theme, auth tokens, modal state, form wizard progress
- Use TanStack Query for: API calls, server data, caching
- Keep stores small and focused
- Use selectors to prevent re-renders
- Persist critical state to localStorage (auth tokens, onboarding progress)

**Common Pitfalls**:

- ❌ Storing server data in Zustand (use TanStack Query)
- ❌ Creating one massive store
- ❌ Not using selectors (causes unnecessary renders)
- ✅ Separate concerns, multiple small stores, use selectors

**Zustand Example (UI State)**:

```ts
// libs/ui/src/stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null }),
    }),
    { name: "auth-storage" }
  )
);
```

**TanStack Query Example (REST API Calls)**:

```ts
// apps/web/src/hooks/use-plans.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@alva/ui/stores";

export function usePlans() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
    enabled: !!accessToken,
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (clientProfile) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientProfile }),
      });
      if (!response.ok) throw new Error("Failed to generate plan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
```

---

### 14. Deployment & Infrastructure

#### ✅ Selected: **Docker + Multi-Platform**

**Why Docker + Platform**:

- **Docker**: Consistent environments for all 3 services (web, api, auth)
- **Vercel**: Optimized for Next.js (web app only)
- **Railway**: Perfect for Fastify services (api + auth), database, Redis
- **Independent Scaling**: Each service scales based on its needs

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

**Dockerfile Examples**:

```dockerfile
# apps/web/Dockerfile (Next.js Frontend)
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

```dockerfile
# apps/api/Dockerfile (Fastify API Server)
FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm nx build api --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/api ./
COPY --from=builder /app/node_modules ./node_modules
USER nodejs
EXPOSE 3001
CMD ["node", "main.js"]
```

```dockerfile
# apps/auth/Dockerfile (Fastify Auth Service)
FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm nx build auth --prod

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/auth ./
COPY --from=builder /app/node_modules ./node_modules
USER nodejs
EXPOSE 3002
CMD ["node", "main.js"]
```

**Docker Compose**:

```yaml
# docker-compose.yml (Local Development)
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_AUTH_URL=http://localhost:3002
    depends_on: [api, auth]

  api:
    build: ./apps/api
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - REDIS_URL=redis://redis:6379
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on: [postgres, redis]

  auth:
    build: ./apps/auth
    ports: ["3002:3002"]
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - EMAIL_SERVER_HOST=${EMAIL_SERVER_HOST}
    depends_on: [postgres]

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=alva
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

### 15. Testing

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

### 16. Task Queue / Background Jobs

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
3. **Generate JWT keys**: `pnpm generate:keys` (creates public/private key pair)
4. **Start all services**: `docker-compose up` (Web, API, Auth, Postgres, Redis)
5. **Run migrations**: `pnpm db:migrate`

**Individual Service Development**:

- Web only: `pnpm nx serve web` (requires API & Auth running)
- API only: `pnpm nx serve api` (requires Postgres & Redis)
- Auth only: `pnpm nx serve auth` (requires Postgres)

**Recommended**: Use Docker Compose to run all services together for full-stack development.

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

### Web (Next.js) → API Server (Fastify)

- **Client Components** use TanStack Query to call REST endpoints
- **Server Components** call REST API directly (SSR with auth token)
- **Authentication**: JWT in Authorization header
- **State**: TanStack Query handles caching, refetching, optimistic updates

```typescript
// Server Component (SSR)
async function DashboardPage() {
  const session = await getServerSession(); // From cookie
  const plans = await fetch(`${process.env.API_URL}/plans`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  }).then((res) => res.json());

  return <Dashboard plans={plans} />;
}

// Client Component
function GeneratePlanButton() {
  const { mutate, isLoading } = useGeneratePlan();
  return (
    <Button onClick={() => mutate(profile)} loading={isLoading}>
      Generate
    </Button>
  );
}
```

### Web (Next.js) → Auth Service (Fastify)

- **Login Flow**: Web calls auth service for magic link
- **Token Management**: Auth service returns JWT + sets httpOnly cookie
- **Token Storage**: Access token in Zustand, refresh token in httpOnly cookie
- **Token Refresh**: Automatic refresh on 401 responses

```typescript
// Auto-refresh on 401
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Auto-refresh on 401
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    useAuthStore.getState().setAccessToken(newToken);
    // Retry original request
    return fetchWithAuth(url, options);
  }

  return response;
}
```

### API Server → Database

- **Drizzle ORM** for type-safe queries
- **Migrations** managed via `drizzle-kit`
- **Connection pooling** via `pg-pool`
- **Service Schemas**: Each service has its own schema namespace

```typescript
// Shared database with schemas
CREATE SCHEMA auth;  -- Auth service tables
CREATE SCHEMA app;   -- API server tables

// Drizzle config per service
export const users = pgTable("users", { ... }, { schema: "auth" });
export const plans = pgTable("plans", { ... }, { schema: "app" });
```

### API Server → LLM

- **Chat UI**: Web → API `/chat/message` → OpenAI streaming → Stream to client
- **Plan Generation**: Web → API `/plans/generate` → BullMQ job → OpenAI (JSON mode) → Validate → Store

### Auth Service → Database

- **User Management**: CRUD operations on users table
- **Token Storage**: Refresh tokens table with hashed values
- **Session Tracking**: Optional session table for auditing

### State Flow (Complete)

1. User interacts with UI (Next.js)
2. UI calls API/Auth via REST (TanStack Query)
3. JWT validates in API middleware
4. API service processes (may queue job, call LLM, etc.)
5. Response returned to client
6. TanStack Query updates cache
7. UI re-renders with new data

---

## Performance Considerations

### Web (Next.js Frontend)

- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image with Vercel CDN
- **Font Optimization**: Next.js Font with subset preloading
- **Bundle Size**: Analyze with `@next/bundle-analyzer`
- **SSR**: Use Server Components for faster initial load
- **Edge**: Deploy to Vercel Edge for global CDN

### API Server (Fastify)

- **Database**: Connection pooling, prepared statements, indexes
- **Caching**: Redis for LLM responses, expensive queries
- **Async Processing**: BullMQ for long-running tasks
- **Clustering**: Run multiple workers for CPU-intensive tasks
- **Compression**: Enable gzip/brotli for responses

### Auth Service (Fastify)

- **Token Caching**: Cache public key for validation
- **Rate Limiting**: Prevent brute force attacks
- **Connection Pooling**: Efficient database connections
- **Lightweight**: Minimal dependencies for fast startup

### Cross-Service

- **Service Mesh**: Consider Istio/Linkerd for advanced routing (future)
- **Load Balancing**: Nginx or cloud load balancer for multiple instances
- **Circuit Breaker**: Prevent cascading failures between services

### Monitoring

- **Vercel Analytics**: Web vitals, page performance (Web service)
- **Fastify Metrics**: Prometheus metrics for API & Auth services
- **Sentry**: Error tracking across all services (with service tags)
- **Postgres**: pg_stat_statements for slow queries
- **BullMQ**: Queue metrics dashboard
- **Distributed Tracing**: Consider Jaeger or Datadog APM

---

## Security Best Practices

### Authentication (Auth Service)

- Email verification required before full access
- Rate limiting on auth endpoints (5 attempts / 15 min)
- Secure httpOnly cookies for refresh tokens
- JWT access tokens with RS256 (public/private key)
- Token rotation on refresh
- Device tracking for security auditing

### API Security (API Server)

- JWT validation on all protected endpoints
- Rate limiting per user and per endpoint
- CORS configured for specific origins only
- Input validation with Zod on all endpoints
- Request size limits to prevent DoS
- Helmet.js for security headers

### Data Protection (All Services)

- Input validation with Zod on all endpoints
- SQL injection prevention via Drizzle (parameterized queries)
- XSS protection via React (escaped by default)
- Sensitive data encrypted at rest (Postgres + pgcrypto)
- Environment variables for secrets (never commit)
- Secrets rotation (JWT keys, API keys)

---

## Scaling Strategy

### Horizontal Scaling (By Service)

- **Web (Next.js)**: Vercel auto-scales globally via edge network
- **API (Fastify)**: Railway scales containers based on load
  - Plan generation endpoints scale most
  - Can run multiple instances behind load balancer
- **Auth (Fastify)**: Lightweight, 1-2 instances usually sufficient
  - Scale during high sign-up periods
- **BullMQ Workers**: Scale independently from API
- **Database**: Postgres read replicas for heavy read workloads

### Vertical Scaling

**Start (MVP)**:

- 1 web instance (Vercel)
- 1 API instance
- 1 Auth instance
- 1 Postgres instance
- 1 Redis instance

**Growth (1000+ users)**:

- Auto-scaled web (Vercel handles)
- 3-5 API instances (behind load balancer)
- 2 Auth instances (with session affinity for refresh tokens)
- 5-10 BullMQ workers
- Postgres with read replicas

**Scale (10,000+ users)**:

- Global web deployment (Vercel edge)
- 10-20 API instances (regional)
- 5 Auth instances
- 20+ BullMQ workers
- Separate databases: auth DB, app DB, analytics DB

### Service-Specific Scaling

**Auth Service** scales by:

- Login frequency (peaks during launches)
- Token refreshes (15-min intervals create predictable load)

**API Service** scales by:

- Plan generation requests (most expensive)
- Chat message volume
- Task updates

**Web Service** scales by:

- User traffic
- Page views

### Cost Optimization

- **Caching**: Redis for LLM responses (huge savings)
- **Batching**: Group similar plan generation requests
- **Edge Caching**: Static assets and pages on Vercel Edge
- **Database**: Optimize queries, use indexes, connection pooling
- **LLM**: Use gpt-4o-mini for most tasks, gpt-4 only when necessary
- **Monitoring**: Set budget alerts per service

---

## Migration Path (If Needed)

### From Monolith to Microservices (Current Plan)

We're starting with microservices, but if you wanted to start simpler:

1. **Phase 1**: Build as monolith (Next.js with API routes)
2. **Phase 2**: Extract API routes to Fastify service
3. **Phase 3**: Extract auth to separate service
4. **Phase 4**: Independent deployment

### From Microservices to Monolith (If Scaling Down)

1. Move Auth routes into API server
2. Move API into Next.js API routes
3. Simplify deployment to single service
4. Keep Docker for consistency

### From Shared DB to Separate DBs

1. Create separate Postgres instances (auth-db, app-db)
2. Extract auth schema to auth-db
3. Update connection strings per service
4. Implement cross-database consistency patterns

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

| Category          | Technology               | Why                                     | Service    |
| ----------------- | ------------------------ | --------------------------------------- | ---------- |
| **Monorepo**      | NX                       | Advanced tooling, caching, generators   | All        |
| **Language**      | TypeScript 5.3+          | Type safety, essential for AI workflows | All        |
| **Frontend**      | React 18 + Next.js 14    | SSR, Server Components, proven at scale | Web        |
| **Styling**       | Tailwind CSS 4.0         | Utility-first, matches design system    | Web        |
| **Components**    | Shadcn/UI + Radix        | Full control, accessible, customizable  | Web        |
| **API Server**    | Fastify 4.x              | High performance, TypeScript-first      | API        |
| **Auth Server**   | Fastify 4.x              | Fast, secure, focused service           | Auth       |
| **Database**      | PostgreSQL 16            | JSONB support, robust, scalable         | API + Auth |
| **ORM**           | Drizzle                  | TypeScript-first, performant            | API + Auth |
| **Auth Strategy** | JWT + Refresh Token      | Stateless + revocable hybrid            | Auth       |
| **AI/LLM**        | Vercel AI SDK + OpenAI   | Streaming, React hooks, JSON mode       | Web + API  |
| **API Layer**     | REST + OpenAPI           | Universal, documented, stateless        | API + Auth |
| **State**         | Zustand + TanStack Query | UI state + server state                 | Web        |
| **Deploy**        | Docker + Vercel/Railway  | Multi-service, independent scaling      | All        |
| **Testing**       | Vitest + Playwright      | Fast, reliable, modern                  | All        |
| **Jobs**          | BullMQ                   | Redis-backed, production-ready          | API        |

This stack provides a solid foundation for building Alva as a scalable, maintainable, AI-first microservices marketing platform with clear service boundaries and independent deployment.
