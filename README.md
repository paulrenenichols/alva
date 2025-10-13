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

Alva is built as a modern, AI-first monorepo optimized for scalability and developer experience.

### Core Technologies

- **Monorepo**: NX for advanced dependency management and caching
- **Language**: TypeScript 5.3+ (strict mode)
- **Frontend**: React 18 + Next.js 14 App Router
- **Styling**: Tailwind CSS 4.0 with custom design system
- **Components**: Shadcn/UI + Radix UI
- **Database**: PostgreSQL 16 with JSONB support
- **ORM**: Drizzle for type-safe queries
- **Authentication**: NextAuth.js v5 (Auth.js)
- **API**: tRPC for end-to-end type safety
- **AI/LLM**: OpenAI SDK + Vercel AI SDK
- **State Management**: Zustand (UI) + TanStack Query (server)
- **Job Queue**: BullMQ with Redis
- **Deployment**: Docker + Vercel/Railway

[Full tech stack documentation →](_docs/project-definition/tech-stack.md)

---

## Project Structure

```
alva/
├── apps/                    # Deployable applications
│   └── web/                # Next.js web application
├── libs/                    # Shared libraries
│   ├── ui/                 # Design system & components
│   ├── data-access/        # Database, API, tRPC
│   ├── feature/            # Feature-specific logic
│   ├── utils/              # Shared utilities
│   └── types/              # TypeScript types
├── tools/                   # Build tools, generators
├── _docs/                   # Project documentation
│   ├── overview/           # Project overview
│   ├── project-definition/ # Core specifications
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

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Docker services** (PostgreSQL, Redis)

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

6. **Seed database** (optional, for development)

   ```bash
   pnpm db:seed
   ```

7. **Start development server**

   ```bash
   pnpm dev
   ```

8. **Open browser**
   ```
   http://localhost:3000
   ```

### Development Scripts

```bash
# Start all services
pnpm dev

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Reset database
pnpm db:reset

# Run tests
pnpm test

# Run linting
pnpm lint

# Build for production
pnpm build

# Serve production build
pnpm start
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

Required environment variables (see `.env.example`):

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alva

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Email
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@alva.app

# AI
OPENAI_API_KEY=sk-...

# Redis (optional, for job queue)
REDIS_URL=redis://localhost:6379
```

---

## Troubleshooting

### Common Issues

**Database connection fails**

- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in .env.local
- Verify database exists

**Next.js build fails**

- Clear .next folder: `rm -rf apps/web/.next`
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `nx typecheck web`

**Tests failing**

- Ensure test database is set up
- Check for port conflicts
- Run tests in isolation: `nx test <project> --watch=false`

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
