# Alva

**Bringing your marketing into the light.**

Alva is an AI-powered marketing platform that provides small business owners with a custom marketing plan and a skilled, always-on marketing director at a fraction of traditional costs.

---

## Overview

Alva combines intelligent automation with personalized strategy to deliver:

- **Custom Marketing Plans**: Tailored strategies generated from comprehensive business insights
- **Always-On Direction**: 24/7 access to strategic marketing guidance
- **Multi-Channel Coverage**: PPC, Blog, Email, and Social media modules
- **Intelligent Scheduling**: Task management based on your capacity and priorities
- **Actionable Insights**: Daily Quick Wins and progress tracking

### Core Values

- **Clarity**: Eliminate confusion, provide direction
- **Precision**: Targeted strategies, not generic advice
- **Empowerment**: Users feel in control, not dependent
- **Adaptation**: Evolves with business needs

---

## Tech Stack

Alva is built as a modern, AI-first microservices monorepo optimized for scalability and developer experience.

### Architecture

**3 Independent Services**:
- **Web** (Next.js) - Frontend UI, port 3000
- **API** (Fastify) - Business logic, LLM integration, port 3001
- **Auth** (Fastify) - Authentication & user management, port 3002

### Core Technologies

**All Services**:
- **Monorepo**: NX for advanced dependency management and caching
- **Language**: TypeScript 5.3+ (strict mode)
- **Database**: PostgreSQL 16 with JSONB support (shared, separate schemas)
- **ORM**: Drizzle for type-safe queries
- **Deployment**: Docker + multi-platform (Vercel for Web, Railway for API/Auth)

**Web Service (Next.js)**:
- **Frontend**: React 18 + Next.js 14 App Router (no API routes)
- **Styling**: Tailwind CSS 4.0 with custom design system
- **Components**: Shadcn/UI + Radix UI
- **State Management**: Zustand (UI) + TanStack Query (server)

**API Service (Fastify)**:
- **Framework**: Fastify 4.x (high performance)
- **AI/LLM**: OpenAI SDK + Vercel AI SDK
- **Job Queue**: BullMQ with Redis
- **API Docs**: OpenAPI/Swagger

**Auth Service (Fastify)**:
- **Framework**: Fastify 4.x (lightweight)
- **Auth Strategy**: JWT (RS256) + Refresh Tokens
- **Email**: Resend for magic links

[Full tech stack documentation →](_docs/project-definition/tech-stack.md)  
[Architecture details →](_docs/project-definition/architecture.md)

---

## Project Structure

```
alva/
├── apps/                    # Deployable applications (microservices)
│   ├── web/                # Next.js Frontend (Port 3000)
│   ├── api/                # Fastify API Server (Port 3001)
│   └── auth/               # Fastify Auth Service (Port 3002)
├── libs/                    # Shared libraries
│   ├── ui/                 # React components (web only)
│   ├── database/           # Database schemas (shared)
│   ├── shared-types/       # Types across services
│   ├── validation/         # Zod schemas (shared)
│   ├── api-client/         # Web → API client
│   ├── auth-client/        # Web → Auth client
│   ├── feature/            # Feature-specific logic
│   └── utils/              # Shared utilities
├── tools/                   # Build tools, generators
├── _docs/                   # Project documentation
│   ├── overview/           # Project overview
│   ├── project-definition/ # Core specifications & architecture
│   └── phases/             # Development phases
├── docker/                  # Docker configurations
└── nx.json                  # NX configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm 8+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alva
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Generate JWT keys** (for Auth service)

   ```bash
   pnpm generate:keys
   # Generates RS256 public/private key pair
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example.web apps/web/.env.local
   cp .env.example.api apps/api/.env
   cp .env.example.auth apps/auth/.env
   # Edit each .env file with your configuration
   ```

5. **Start all services** (Docker Compose)

   ```bash
   pnpm docker:up
   # or: docker-compose up
   # Starts: Web, API, Auth, Postgres, Redis
   ```

6. **Run database migrations**

   ```bash
   pnpm db:migrate
   # Runs migrations for both auth and app schemas
   ```

7. **Seed database** (optional, for development)

   ```bash
   pnpm db:seed
   ```

8. **Open browser**
   ```
   Web:  http://localhost:3000
   API:  http://localhost:3001/docs (OpenAPI docs)
   Auth: http://localhost:3002/health
   ```

### Development Scripts

```bash
# Docker & Services
pnpm docker:up           # Start all services in Docker
pnpm docker:down         # Stop all services

# Development (individual services)
pnpm dev                 # Start all services (Docker Compose)
pnpm dev:web             # Start Web only (requires API/Auth running)
pnpm dev:api             # Start API only
pnpm dev:auth            # Start Auth only

# Database
pnpm db:migrate          # Run all migrations (auth + app schemas)
pnpm db:seed             # Seed database with test data
pnpm db:reset            # Reset and reseed

# Auth
pnpm generate:keys       # Generate JWT key pair

# Testing
pnpm test                # Test all services
pnpm test:web            # Test web only
pnpm test:api            # Test API only
pnpm test:auth           # Test Auth only
pnpm test:e2e            # E2E tests (all services)

# Linting
pnpm lint                # Lint all services

# Building
pnpm build               # Build all services
pnpm build:web           # Build web only
pnpm build:api           # Build API only
pnpm build:auth          # Build Auth only
```

---

## Development Workflow

### Code Organization

This is an **AI-first codebase** optimized for:

- **Modularity**: Clear boundaries between features
- **Navigability**: Easy to find code through semantic organization
- **Readability**: Self-documenting with comprehensive comments
- **Searchability**: Optimized for semantic and grep/regex searches

### Key Conventions

1. **File Size**: Max 500 lines per file
2. **File Headers**: Every file starts with `@fileoverview` comment
3. **Documentation**: All functions have JSDoc/TSDoc blocks
4. **Naming**: Descriptive names for files, functions, variables
5. **No Enums**: Use const objects with `as const` instead

[Full project rules →](_docs/project-definition/project-rules.md)

### Code Style

- **Functional Programming**: Avoid classes, prefer functions
- **Type Safety**: No `any`, use `unknown` when type is uncertain
- **Error Handling**: Throw errors, don't return null
- **Descriptive Variables**: Use auxiliary verbs (isLoading, hasError)

---

## Documentation

### Core Documentation

- **[Project Overview](_docs/overview/project-overview.md)**: Complete project vision, brand guide, and technical specifications
- **[User Flow](_docs/project-definition/user-flow.md)**: Complete user journey through the application
- **[Tech Stack](_docs/project-definition/tech-stack.md)**: Technology decisions and best practices
- **[UI Rules](_docs/project-definition/ui-rules.md)**: Design principles and component guidelines
- **[Theme Rules](_docs/project-definition/theme-rules.md)**: Design system, colors, typography
- **[Project Rules](_docs/project-definition/project-rules.md)**: Structure, naming conventions, patterns

### Development Phases

Alva is built in iterative phases, each delivering a functional product:

1. **[Setup Phase](_docs/phases/01-setup-phase.md)**: Foundation and infrastructure
2. **[MVP Phase](_docs/phases/02-mvp-phase.md)**: Core onboarding and plan generation
3. **[Core Modules Phase](_docs/phases/03-core-modules-phase.md)**: Multi-channel marketing intelligence
4. **[Polish Phase](_docs/phases/04-polish-phase.md)**: Production hardening and optimization

---

## Design System

Alva uses a carefully crafted design system for consistency and premium feel:

### Colors

- **Gold** (#FFD700): Primary actions, highlights
- **Blue** (#007BFF): Navigation, informational
- **Green** (#28A745): Success states
- **Red** (#D32F2F): Errors, warnings
- **Neutrals**: #1F1F1F (text) to #FAFAFA (backgrounds)

### Typography

- **Font**: Inter (all headings and body)
- **Scale**: 12px to 36px with consistent line heights
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing

- **Base Unit**: 4px
- **Scale**: All spacing in 4px increments
- **Responsive**: Adjusts for mobile, tablet, desktop

[Complete theme documentation →](_docs/project-definition/theme-rules.md)

---

## Testing

### Test Coverage Goals

- **Unit Tests**: 85%+ on libs/
- **Integration Tests**: All tRPC procedures and services
- **E2E Tests**: All critical user paths
- **Visual Regression**: All pages and components

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

---

## Deployment

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t alva:latest .

# Run container
docker run -p 3000:3000 alva:latest

# Or use docker-compose
docker-compose up
```

### Production

Alva is deployed using:

- **Web App**: Vercel (Next.js) or Docker on Railway
- **Database**: Managed PostgreSQL (Railway/Supabase)
- **Redis**: Upstash Redis (job queue)
- **CDN**: Vercel Edge Network

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Code Style**: Follow project conventions in [project-rules.md](_docs/project-definition/project-rules.md)
2. **Testing**: Add tests for new features
3. **Documentation**: Update relevant docs
4. **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
5. **PRs**: Keep changes focused, provide clear description

### Branch Naming

```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
refactor/what-is-refactored
docs/documentation-update
```

### Commit Messages

```
feat(onboarding): add brand clarity section
fix(auth): resolve token expiration bug
docs(readme): update installation instructions
refactor(ui): extract Button variants to config
test(dashboard): add E2E tests for task completion
```

---

## Architecture Highlights

### AI-First Design

- **Deterministic Outputs**: Temperature=0, JSON mode for consistency
- **Validation**: Zod schemas validate all LLM responses
- **Fallbacks**: Graceful degradation when AI unavailable
- **Caching**: Reduce costs by caching identical requests

### Type Safety

- **End-to-End**: TypeScript everywhere with strict mode
- **tRPC**: Client automatically knows server types
- **Drizzle**: Type-safe database queries
- **Zod**: Runtime validation aligns with types

### Performance

- **Server Components**: Reduce client bundle size
- **Code Splitting**: Dynamic imports for heavy features
- **Image Optimization**: Next.js Image with WebP/AVIF
- **Caching**: Redis for sessions and expensive computations

---

## Monorepo Commands

### NX Commands

```bash
# Serve web app
nx serve web

# Build web app
nx build web

# Test specific library
nx test ui

# Lint all affected projects
nx affected:lint

# Run affected tests (based on git changes)
nx affected:test

# View dependency graph
nx graph

# Generate component
nx g @nx/react:component --name=MyComponent --project=ui
```

---

## Environment Variables

Required environment variables per service:

### Web Service (apps/web/.env.local)
```bash
# Public (exposed to browser)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### API Service (apps/api/.env)
```bash
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva
REDIS_URL=redis://localhost:6379
JWT_PUBLIC_KEY=<from pnpm generate:keys>
OPENAI_API_KEY=sk-...
```

### Auth Service (apps/auth/.env)
```bash
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva
JWT_PRIVATE_KEY=<from pnpm generate:keys>
JWT_PUBLIC_KEY=<from pnpm generate:keys>
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_FROM=noreply@alva.app
WEB_URL=http://localhost:3000
```

See `.env.example.web`, `.env.example.api`, and `.env.example.auth` for complete templates.

---

## Troubleshooting

### Common Issues

**Database connection fails**

- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in each service's .env file
- Verify database and schemas exist
- Check network connectivity between services

**Service won't start**

- Check port conflicts: `lsof -i :3000` (or 3001, 3002)
- Check environment variables are set
- Check Docker containers: `docker-compose ps`
- Check logs: `docker-compose logs <service>`

**Auth issues (401 errors)**

- Verify JWT_PUBLIC_KEY matches in both API and Auth .env files
- Check access token is being sent in Authorization header
- Try refreshing token: `/auth/refresh`
- Verify token hasn't expired (15 min)

**Next.js build fails**

- Clear .next folder: `rm -rf apps/web/.next`
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `nx typecheck web`

**Fastify service fails**

- Check TypeScript errors: `nx typecheck api` or `nx typecheck auth`
- Verify all dependencies installed
- Check plugin registration order

**Tests failing**

- Ensure test database is set up
- Ensure all services running for E2E tests
- Check for port conflicts
- Run tests in isolation: `nx test <project> --watch=false`

**Services can't communicate**

- Check Docker network: `docker network inspect alva_default`
- Verify service URLs in environment variables
- Check CORS configuration in API and Auth
- Check firewall rules

### Getting Help

- Check [documentation](_docs/)
- Review [project overview](_docs/overview/project-overview.md)
- Open an issue on GitHub
- Contact the development team

---

## License

[License type to be determined]

---

## Acknowledgments

Built with modern open-source technologies:

- [Next.js](https://nextjs.org/) - React framework
- [NX](https://nx.dev/) - Monorepo tools
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/UI](https://ui.shadcn.com/) - Component library
- [Drizzle ORM](https://orm.drizzle.team/) - Database toolkit
- [tRPC](https://trpc.io/) - Type-safe APIs
- [OpenAI](https://openai.com/) - AI capabilities
- [Vercel](https://vercel.com/) - Deployment platform

---

## Project Status

**Current Phase**: Setup & Planning ✓

**Next Steps**:

1. ✓ Complete project planning documentation
2. → Initialize NX workspace
3. → Set up development environment
4. → Begin MVP development

[View detailed roadmap →](_docs/phases/)

---

**Alva** - _Bringing your marketing into the light._
