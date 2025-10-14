# Phase 1: Setup & Foundation

**@fileoverview** Initial setup phase for Alva - establishing the barebones infrastructure, workspace configuration, and foundational systems needed for development.

---

## Phase Overview

**Goal**: Create a running, deployable foundation with core infrastructure in place

**Duration**: 1-2 weeks

**Deliverable**: A functional Next.js application with database, authentication scaffolding, and basic health checks

**Success Criteria**:

- ✅ NX monorepo initialized with 3 applications
- ✅ All services running locally and in Docker (Web, API, Auth)
- ✅ Database connected with schemas for auth + app
- ✅ Auth service functional with JWT generation
- ✅ API server accepts authenticated requests
- ✅ CI/CD pipeline functional for all services
- ✅ Development environment documented

---

## Features & Tasks

### 1. NX Workspace Initialization

**Objective**: Set up the monorepo structure with NX for microservices

**Tasks**:

1. Initialize NX workspace
   - Run `npx create-nx-workspace@latest alva --preset=apps`
   - Configure TypeScript strict mode
   - Set up path aliases (@alva/\*)
2. Create application structure
   - Create `apps/web` (Next.js)
   - Create `apps/api` (Fastify)
   - Create `apps/auth` (Fastify)
   - Configure each app's tsconfig.json
3. Configure workspace libraries structure
   - Create `libs/ui` (React components, web only)
   - Create `libs/database` (Drizzle schemas, shared)
   - Create `libs/shared-types` (Types used across services)
   - Create `libs/validation` (Zod schemas, shared)
   - Create `libs/api-client` (Web → API client)
   - Create `libs/auth-client` (Web → Auth client)
   - Create `libs/utils` (Shared utilities)
   - Set up NX library tags (type:ui, scope:web, scope:api, etc.)
   - Configure module boundaries in ESLint
4. Set up development tools
   - Install and configure Prettier
   - Install and configure ESLint for Next.js, Fastify, React, TypeScript
   - Set up Husky pre-commit hooks
   - Configure lint-staged for auto-formatting
5. Create JWT key generation script
   - Add `tools/scripts/generate-keys.ts`
   - Generate RS256 public/private key pair
   - Save to .env.example as template

**Dependencies**: None

**Acceptance Criteria**:

- NX commands work for all apps (`nx serve web`, `nx serve api`, `nx serve auth`)
- Libraries import correctly using path aliases
- Pre-commit hooks format code automatically
- ESLint enforces module boundaries
- JWT keys can be generated with `pnpm generate:keys`

---

### 2. Database Setup (PostgreSQL + Drizzle)

**Objective**: Establish database with separate schemas for auth and app services

**Tasks**:

1. Set up PostgreSQL with Docker Compose
   - Create `docker-compose.yml` with Postgres 16 service
   - Create Redis 7 service (for BullMQ)
   - Configure environment variables (DATABASE_URL, REDIS_URL)
   - Add volume mounts for data persistence
2. Install and configure Drizzle ORM
   - Install `drizzle-orm`, `drizzle-kit`, `pg` packages
   - Create `libs/database/src/client.ts` connection factory
   - Configure `drizzle.config.ts` for migrations
3. Create database schemas (separate namespaces)
   - **Auth Schema**: Users, refresh tokens, verification tokens
   - **App Schema**: Client profiles, marketing plans, tasks, chat messages
   - Create SQL to initialize schemas: `CREATE SCHEMA auth;` and `CREATE SCHEMA app;`
   - Create and run initial migrations for both schemas
4. Set up connection pooling
   - Configure pg pool with sensible defaults
   - Separate pools for auth vs app (or shared pool)
   - Add connection error handling
   - Create health check endpoint for each service

**Dependencies**: Docker installed

**Acceptance Criteria**:

- Database starts with `docker-compose up`
- Both auth and app schemas created
- Drizzle can connect from both API and Auth services
- Migrations run successfully for both schemas
- Health check endpoints return database status

---

### 3. Next.js Frontend App (Web Service)

**Objective**: Set up Next.js 14 as pure frontend (NO API routes)

**Tasks**:

1. Configure Next.js application
   - Initialize `apps/web` with Next.js 14
   - Set up `apps/web/app` directory structure
   - Configure `next.config.js` (image domains, env vars for API/Auth URLs)
   - Set up root `layout.tsx` and `page.tsx`
   - **Important**: No `/app/api` directory - pure frontend only
2. Create route groups
   - `(auth)` group for auth-related pages (login, verify)
   - `(dashboard)` group for protected routes
   - `onboarding` routes with dynamic segments
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
5. Create API client utilities
   - Set up `libs/api-client` for Web → API communication
   - Set up `libs/auth-client` for Web → Auth communication
   - Configure TanStack Query provider

**Dependencies**: NX workspace setup

**Acceptance Criteria**:

- Next.js dev server runs (`nx serve web`)
- All route groups accessible
- Tailwind classes work with design tokens
- Inter font loads correctly
- API client libraries functional
- No `/app/api` directory exists (frontend only)

---

### 4. Auth Service Implementation (Fastify)

**Objective**: Build standalone auth service with JWT-based authentication

**Tasks**:

1. Initialize Fastify auth application
   - Create `apps/auth` with Fastify 4.x
   - Install dependencies: `fastify`, `@fastify/cors`, `@fastify/cookie`, `@fastify/rate-limit`
   - Install auth dependencies: `jsonwebtoken`, `bcrypt` (for future passwords)
   - Set up app structure (routes, services, middleware, lib)
2. Implement JWT token service
   - Create `src/services/token.service.ts`
   - Implement access token generation (RS256, 15 min expiry)
   - Implement refresh token generation (crypto random)
   - Store refresh tokens hashed in database
   - Implement token validation methods
3. Create auth routes
   - POST `/auth/register` - Email registration
   - POST `/auth/send-magic-link` - Send verification email
   - POST `/auth/verify-magic-link` - Verify token, return JWT
   - POST `/auth/refresh` - Refresh access token using refresh token cookie
   - POST `/auth/logout` - Revoke refresh token
   - GET `/auth/me` - Get current user info
4. Set up email service
   - Configure email provider (Resend recommended)
   - Create email templates for magic links
   - Implement magic link generation with expiry
   - Add rate limiting (5 emails per hour per email)
5. Implement rate limiting and security
   - Rate limit auth endpoints (5 attempts / 15 min)
   - Add request validation with Zod
   - Set security headers
   - Configure CORS for web app origin

**Dependencies**: Database setup, JWT keys generated

**Acceptance Criteria**:

- Auth service runs on port 3002
- Can register with email
- Magic link emails send successfully
- JWT tokens generated with RS256
- Refresh tokens stored securely (hashed)
- Rate limiting prevents abuse
- Health check endpoint returns 200

---

### 5. API Server Implementation (Fastify)

**Objective**: Build API server for business logic and LLM integration

**Tasks**:

1. Initialize Fastify API application
   - Create `apps/api` with Fastify 4.x
   - Install dependencies: `fastify`, `@fastify/cors`, `@fastify/swagger`, `@fastify/swagger-ui`
   - Install business dependencies: `openai`, `bullmq`, `ioredis`
   - Set up app structure (routes, services, middleware, plugins, jobs)
2. Implement authentication middleware
   - Create `src/middleware/auth.middleware.ts`
   - Validate JWT using public key (RS256)
   - Extract user from token, attach to request
   - Return 401 for invalid/expired tokens
3. Create initial routes
   - GET `/health` - Health check (public)
   - GET `/plans` - List user plans (protected)
   - POST `/plans/generate` - Generate new plan (protected)
   - POST `/onboarding/save-section` - Save onboarding data (protected)
4. Set up OpenAPI documentation
   - Install `@fastify/swagger` and `@fastify/swagger-ui`
   - Configure schema definitions
   - Add JWT bearer auth to docs
   - Expose docs at `/docs`
5. Configure database and Redis plugins
   - Create `src/plugins/db.plugin.ts` using Drizzle
   - Create `src/plugins/redis.plugin.ts` for BullMQ
   - Register plugins in app.ts

**Dependencies**: Database setup, Auth service JWT public key

**Acceptance Criteria**:

- API server runs on port 3001
- Health check returns 200
- JWT middleware validates tokens from Auth service
- Protected endpoints require valid JWT
- OpenAPI docs accessible at `/docs`
- Can connect to Postgres and Redis

---

### 6. Docker Configuration (All Services)

**Objective**: Containerize all 3 services for consistent deployment

**Tasks**:

1. Create Dockerfiles for each service
   - `apps/web/Dockerfile` - Next.js multi-stage build
   - `apps/api/Dockerfile` - Fastify API multi-stage build
   - `apps/auth/Dockerfile` - Fastify Auth multi-stage build
   - All use Node 20 Alpine base
   - Optimize for NX builds
2. Configure Docker Compose for local development
   - Web service (port 3000)
   - API service (port 3001)
   - Auth service (port 3002)
   - Postgres service (port 5432)
   - Redis service (port 6379)
   - Configure service dependencies and health checks
   - Set up networking between services
3. Optimize Docker builds
   - Create comprehensive `.dockerignore`
   - Leverage layer caching
   - Use specific base image versions
   - Share base layers between services
4. Create development and production configs
   - `docker-compose.yml` for local dev (all services)
   - `docker-compose.prod.yml` for production
   - Environment variable templates for each service
   - Set up volume mounts for development hot reload
5. Add service health checks
   - Health check endpoints for all services
   - Docker Compose health check configuration
   - Restart policies

**Dependencies**: All services created (web, api, auth)

**Acceptance Criteria**:

- `docker-compose up` starts all 5 services (web, api, auth, postgres, redis)
- All services accessible on their respective ports
- Services can communicate with each other
- Database migrations run on startup
- Hot reload works for all services in dev mode
- Health checks pass for all services

---

### 7. CI/CD Pipeline (Multi-Service)

**Objective**: Automate testing, building, and deployment for all services

**Tasks**:

1. Set up GitHub Actions workflows
   - Create `.github/workflows/ci.yml` for all services
   - Run on pull requests and main branch
   - Configure NX Cloud for caching (optional)
   - Use matrix strategy for parallel service builds
2. Create CI checks (per service)
   - Lint: `nx affected:lint`
   - Type check: `nx affected:typecheck`
   - Test: `nx affected:test`
   - Build: `nx affected:build --target=web,api,auth`
3. Set up deployment workflows
   - Build Docker images for all 3 services
   - Push to registry (GitHub Container Registry)
   - Deploy Web to Vercel
   - Deploy API and Auth to Railway
   - Use different workflows for staging vs production
4. Configure branch protection
   - Require all CI checks to pass (web, api, auth)
   - Require code review
   - Enforce conventional commits

**Dependencies**: Docker configuration

**Acceptance Criteria**:

- CI runs on every PR for all affected services
- Failed checks block merge
- All Docker images build successfully
- Staging deployment works for all services
- Services can communicate in staging environment

---

### 8. Development Environment Setup

**Objective**: Document and streamline developer onboarding for microservices

**Tasks**:

1. Create comprehensive setup documentation
   - Update README with getting started guide for all services
   - Document environment variables (.env.example for each service)
   - Create CONTRIBUTING.md with workflow
   - Add architecture diagram showing service communication
2. Add developer utilities
   - Create `tools/scripts/generate-keys.ts` - JWT key pair generation
   - Create `tools/scripts/seed.ts` - Seed test data (users, profiles, plans)
   - Create `tools/scripts/reset-db.ts` - Reset database
   - Create `tools/scripts/create-user.ts` - Create test user
3. Set up debugging configuration
   - VS Code launch.json for all 3 services
   - Configure Chrome DevTools for Next.js
   - Configure debugging for Fastify services
   - Add error boundaries for better DX
4. Create development scripts (package.json)
   - `pnpm dev` - Start all services via Docker Compose
   - `pnpm dev:web` - Start web only (requires api/auth running)
   - `pnpm dev:api` - Start API only
   - `pnpm dev:auth` - Start Auth only
   - `pnpm generate:keys` - Generate JWT key pair
   - `pnpm db:migrate` - Run all migrations
   - `pnpm db:seed` - Seed database
   - `pnpm db:reset` - Reset and reseed
   - `pnpm test:all` - Test all services
   - `pnpm docker:up` - Start Docker Compose
   - `pnpm docker:down` - Stop Docker Compose

**Dependencies**: All previous tasks

**Acceptance Criteria**:

- New developer can set up in <30 minutes following README
- All scripts work as documented
- Docker Compose runs all services successfully
- VS Code debugging works for all services
- Seed data creates test users, profiles, and plans
- Services can communicate in local environment

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
│   ├── web/                       # Next.js Frontend (Port 3000)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   ├── onboarding/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── config/
│   │   ├── Dockerfile
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   └── tailwind.config.ts
│   ├── api/                       # Fastify API Server (Port 3001)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── plugins/
│   │   │   ├── jobs/
│   │   │   ├── lib/
│   │   │   ├── config/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   └── auth/                      # Fastify Auth Service (Port 3002)
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── lib/
│       │   ├── config/
│       │   ├── app.ts
│       │   └── server.ts
│       ├── Dockerfile
│       └── tsconfig.json
├── libs/
│   ├── database/           # Drizzle schemas (shared)
│   │   └── src/
│   │       ├── schemas/
│   │       │   ├── auth/   # Auth service tables
│   │       │   └── app/    # API service tables
│   │       ├── migrations/
│   │       └── client.ts
│   ├── shared-types/       # Types (shared across services)
│   ├── validation/         # Zod schemas (shared)
│   ├── api-client/         # Web → API client
│   ├── auth-client/        # Web → Auth client
│   ├── ui/                 # React components (web only)
│   └── utils/              # Shared utilities
├── docker/
│   └── docker-compose.yml
├── tools/
│   └── scripts/
│       ├── generate-keys.ts
│       ├── seed.ts
│       └── reset-db.ts
├── .env.example.web
├── .env.example.api
├── .env.example.auth
├── .eslintrc.json
├── .prettierrc
├── nx.json
├── package.json
└── tsconfig.base.json
```

### Key Technologies

**Web Service**:
- **Next.js 14**: App Router, Server Components (frontend only, no API routes)
- **React 18**: UI library
- **Tailwind CSS 4**: Utility-first styling
- **Shadcn/UI**: Component library

**API Service**:
- **Fastify 4.x**: High-performance Node framework
- **Drizzle ORM**: Type-safe database queries
- **OpenAI SDK**: LLM integration
- **BullMQ**: Background job processing
- **Redis**: Caching and job queue

**Auth Service**:
- **Fastify 4.x**: Lightweight auth server
- **jsonwebtoken**: JWT generation and validation (RS256)
- **Drizzle ORM**: User and token management
- **Resend**: Email delivery (magic links)

**Shared**:
- **NX**: Monorepo management and build system
- **TypeScript 5.3+**: Strict mode across all services
- **PostgreSQL 16**: Primary database (auth + app schemas)
- **Docker**: Multi-service containerization
- **GitHub Actions**: CI/CD for all services

---

## Environment Variables Template

### .env.example.web (Next.js Frontend)
```bash
# Public (exposed to browser)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### .env.example.api (API Server)
```bash
# Server
PORT=3001
NODE_ENV=development

# Database & Cache
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva
REDIS_URL=redis://localhost:6379

# Authentication
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----

# AI/LLM
OPENAI_API_KEY=sk-...

# Optional
AUTH_SERVICE_URL=http://localhost:3002  # For introspection if needed
```

### .env.example.auth (Auth Service)
```bash
# Server
PORT=3002
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva

# JWT Keys (generated with pnpm generate:keys)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Service
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_...
EMAIL_FROM=noreply@alva.app

# CORS
WEB_URL=http://localhost:3000
```

---

## Testing Strategy

### Unit Tests (Per Service)

**Web**:
- Test React components
- Test hooks (use-auth, use-api)
- Test utility functions

**API**:
- Test route handlers
- Test service layer (plan generation, governance)
- Test middleware (auth validation)

**Auth**:
- Test token generation/validation
- Test email service
- Test auth routes

**Shared**:
- Test database schemas
- Test Zod validators
- Test utility functions

### Integration Tests (Per Service)

**Web**:
- Test API client integration
- Test Auth client integration

**API**:
- Test database operations end-to-end
- Test JWT validation from Auth service
- Test LLM integration (mocked)

**Auth**:
- Test full auth flow (register → verify → login)
- Test token refresh flow
- Test database migrations

### E2E Tests (Cross-Service)

- Health checks for all services
- Full auth flow: register → magic link → verify → dashboard
- Protected routes require valid JWT
- Token refresh works automatically on 401
- Services can communicate in Docker environment

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
- [ ] Documentation updated (README, 3x .env.example, CONTRIBUTING.md)
- [ ] CI/CD pipeline green for all services
- [ ] All 3 Docker containers build and run successfully
- [ ] Database migrations run without errors (auth + app schemas)
- [ ] Auth service issues valid JWTs
- [ ] API server validates JWTs from Auth service
- [ ] Web app can communicate with both API and Auth services
- [ ] All health check endpoints return 200
- [ ] Services communicate successfully in Docker environment
- [ ] New developer can onboard in <30 min following README
- [ ] All code reviewed and merged to main
- [ ] Staging deployment successful for all services

---

## Next Steps

After this phase is complete, proceed to **Phase 2: MVP** to build:

- Email capture landing page
- 26-card onboarding flow
- Client profile JSON generation
- Basic marketing plan generation
- Summary preview page
- Simple chat interface with Alva
