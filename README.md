# Alva - AI Marketing Platform

A modern, AI-first microservices application built with TypeScript, React, and Fastify.

## Architecture

**3 Independent Services:**

- **Web Service (Next.js)**: Frontend application on port 3000
- **API Service (Fastify)**: Backend API on port 3001
- **Auth Service (Fastify)**: Authentication service on port 3002

**All Services:**

- TypeScript, Docker, PostgreSQL, Redis
- NX monorepo for code sharing and management

**Web Service (Next.js):**

- React 19, Next.js 15, Tailwind CSS
- App Router, Server Components
- Zustand for state management

**API Service (Fastify):**

- Fastify 5, Drizzle ORM, PostgreSQL
- OpenAI API integration, BullMQ for background jobs
- OpenAPI/Swagger documentation

**Auth Service (Fastify):**

- JWT tokens (RS256), refresh tokens
- Magic link authentication
- Secure cookie management

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose
- PostgreSQL (for local development)

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd alva
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Generate JWT keys** (for Auth service)

   ```bash
   pnpm run generate:keys
   # Copy the generated keys to your .env file
   ```

4. **Set up environment variables**

   ```bash
   # Copy .env.example to .env and update with your values
   cp .env.example .env

   # Required variables:
   # - DATABASE_URL
   # - JWT_PUBLIC_KEY / JWT_PRIVATE_KEY
   # - COOKIE_SECRET
   # - OPENAI_API_KEY
   ```

5. **Start all services**

   ```bash
   # Start database and Redis
   pnpm run docker:up

   # Initialize database schemas
   pnpm run db:init

   # Start all services
   pnpm run dev
   ```

## Development

### Individual Services

```bash
# Start individual services (requires database running)
pnpm dev:web             # Start Web only (requires API/Auth running)
pnpm dev:api             # Start API only
pnpm dev:auth            # Start Auth only
```

### Docker Commands

```bash
pnpm docker:up           # Start all services in Docker
pnpm docker:down         # Stop all services
pnpm docker:logs         # View logs
pnpm docker:build        # Build all Docker images
pnpm docker:restart      # Restart all services
```

### Database Commands

```bash
pnpm db:init             # Initialize database schemas
pnpm db:migrate          # Run database migrations
```

### Build & Test

```bash
pnpm build               # Build all applications
pnpm test                # Run all tests
pnpm lint                # Lint all code
```

### E2E Testing

```bash
# Run E2E tests
npx nx e2e web-e2e

# Run E2E tests in headed mode (see browser)
npx nx e2e web-e2e --headed

# Run specific test file
npx nx e2e web-e2e --grep "has title"

# Run tests on specific browser
npx nx e2e web-e2e --project=chromium
```

## Project Structure

```
alva/
├── apps/                    # Deployable applications (microservices)
│   ├── web/                # Next.js Frontend (Port 3000)
│   ├── web-e2e/            # Playwright E2E tests for web app
│   ├── api/                # Fastify API Server (Port 3001)
│   └── auth/               # Fastify Auth Service (Port 3002)
├── libs/                   # Shared libraries
│   ├── database/           # Database schemas, migrations (api + auth)
│   ├── shared-types/       # Types shared across services
│   ├── validation/         # Zod schemas (shared)
│   ├── api-client/         # API client for web → api
│   ├── auth-client/        # Auth client for web → auth
│   └── utils/              # Utility functions
├── tools/                  # Development tools and scripts
│   └── scripts/            # Utility scripts
└── _docs/                  # Project documentation
    ├── project-definition/ # Architecture, tech stack, rules
    ├── phases/             # Development phases
    └── phase-plans/        # Detailed implementation plans
```

## Environment Variables

### Web Service (apps/web/.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
```

### API Service (apps/api/.env)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alva
REDIS_URL=redis://localhost:6380
JWT_PUBLIC_KEY=your-jwt-public-key
OPENAI_API_KEY=your-openai-api-key
```

### Auth Service (apps/auth/.env)

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alva
JWT_PRIVATE_KEY=your-jwt-private-key
JWT_PUBLIC_KEY=your-jwt-public-key
COOKIE_SECRET=your-cookie-secret
```

## API Documentation

- **API Service**: http://localhost:3001/docs (Swagger UI)
- **Auth Service**: http://localhost:3002/health (Health check)

## Services

### Web Service (Port 3000)

- Next.js 15 with App Router
- Tailwind CSS for styling
- Authentication integration
- Dashboard and onboarding flows

### API Service (Port 3001)

- Fastify API server
- OpenAI integration for plan generation
- BullMQ for background jobs
- Parallel module execution

### Auth Service (Port 3002)

- Proxies authentication requests
- JWT token management
- Magic link verification
- Refresh token handling

### E2E Testing (apps/web-e2e)

- Playwright-based end-to-end testing
- Multi-browser support (Chrome, Firefox, Safari)
- Automated web server startup
- Cross-platform testing capabilities
- Ready for mobile browser testing

## Development Workflow

1. **Start infrastructure**: `pnpm run docker:up`
2. **Initialize database**: `pnpm run db:init`
3. **Start services**: `pnpm run dev`
4. **Access applications**:
   - Web: http://localhost:3000
   - API: http://localhost:3001
   - Auth: http://localhost:3002

## Contributing

1. Follow the established project structure
2. Use TypeScript strict mode
3. Write tests for new features (unit tests and E2E tests)
4. Follow the coding standards in `_docs/project-definition/`
5. Work with E2E tests in `apps/web-e2e/` for user flow validation

## License

MIT
