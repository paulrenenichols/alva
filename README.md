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

- React 19, Next.js 15, Tailwind CSS v4
- App Router, Server Components
- Zustand for state management
- Storybook 9 for component development

**API Service (Fastify):**

- Fastify 5, Drizzle ORM, PostgreSQL
- OpenAI API integration, BullMQ for background jobs
- OpenAPI/Swagger documentation

**Auth Service (Fastify):**

- JWT tokens (RS256), refresh tokens
- Magic link authentication
- Secure cookie management

## 🎨 Component Library (Storybook 9)

Our component library is automatically deployed and updated with each merge to provide a live, interactive documentation of all UI components using Storybook 9 with Tailwind CSS v4 and semantic design system.

### 📖 Live Documentation

- **Production Storybook**: [View Live Component Library](https://paulrenenichols.github.io/alva/)
- **Staging Storybook**: [View Development Components](https://paulrenenichols.github.io/alva/develop/)

### 🚀 Quick Start

1. **View Components**: Visit the live Storybook links above
2. **Local Development**: Run `pnpm nx run web:storybook` to start local Storybook
3. **Build Storybook**: Run `cd apps/web && npx storybook build` to build static version
4. **Theme Testing**: Use the theme toggle in Storybook toolbar to test light/dark modes

### 📚 What's Included

- **Interactive Component Playground**: Test components with live controls
- **Semantic Design System**: Complete color, typography, and spacing guides with CSS custom properties
- **Dark Mode Support**: Full theme switching with semantic color tokens
- **Accessibility Testing**: Built-in a11y testing for all components
- **Responsive Testing**: Test components across different screen sizes
- **Component Stories**: Comprehensive examples and use cases
- **Storybook 9 Features**: Latest addons and performance improvements

### 🎨 Design System Features

#### Semantic Color System

- **Primary**: Gold (#ffd700) - Primary actions and highlights
- **Secondary**: Blue (#007bff) - Secondary actions and navigation
- **Success**: Green (#28a745) - Success states and positive feedback
- **Danger**: Red (#d32f2f) - Error states and destructive actions
- **Warning**: Yellow (#ffc107) - Warning states and cautions
- **Info**: Cyan (#17a2b8) - Informational content

#### Dark Mode Support

- Automatic system preference detection
- Manual theme toggle with persistence
- Semantic color tokens that adapt to theme
- Consistent brand colors across themes

#### CSS Custom Properties

All design tokens are defined as CSS custom properties for easy theming:

```css
--color-primary: #ffd700;
--color-text-primary: #1f1f1f;
--color-bg-primary: #ffffff;
```

### 🔧 Development Workflow

1. **Create/Update Component**: Make changes to component files using semantic classes
2. **Update Stories**: Add or modify component stories in `.stories.tsx` files
3. **Test Locally**: Run Storybook locally to verify changes
4. **Test Themes**: Verify components work in both light and dark modes
5. **Deploy**: Merge to main/develop branch for automatic deployment

### 📖 Component Documentation

Each component includes:

- Interactive controls for all props
- Multiple variants and states
- Light and dark mode examples
- Accessibility testing results
- Responsive behavior examples
- Usage guidelines and best practices
- Semantic class usage examples

### 🛠️ Troubleshooting

**Storybook won't start locally?**

```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
pnpm nx run web:storybook
```

**Components not styling correctly?**

- Check Tailwind CSS v4 integration in `.storybook/preview.ts`
- Verify global CSS import includes `@import "tailwindcss"`
- Ensure semantic color classes are being used
- Check CSS custom properties are defined in `global.css`

**Dark mode not working?**

- Verify `darkMode: 'class'` is set in `tailwind.config.js`
- Check that `.dark` class is being applied to document
- Ensure CSS custom properties have dark mode variants
- Test theme toggle component functionality

**Deployment issues?**

- Check GitHub Actions logs for build errors
- Verify GitHub Pages settings in repository Settings → Pages
- Ensure proper permissions for deployment workflow
- Check Storybook 9 compatibility with deployment platform

### 🔗 Useful Links

- [Storybook 9 Documentation](https://storybook.js.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Component Development Guide](./_docs/component-development-guide.md)
- [Storybook Usage Guide](./_docs/storybook-usage-guide.md)
- [Design System Guidelines](./_docs/project-definition/ui-rules.md)
- [Theme Implementation](./_docs/project-definition/theme-rules.md)

### 🆕 What's New in Phase 6

- **Storybook 9**: Latest version with integrated addons and improved performance
- **Tailwind CSS v4**: CSS-first configuration with semantic design tokens
- **Dark Mode**: Complete theme system with automatic and manual switching
- **Semantic Design System**: CSS custom properties for consistent theming
- **Enhanced Accessibility**: Improved a11y testing and compliance
- **Better Performance**: Optimized build times and runtime performance

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

### Component Development

```bash
# Start Storybook for component development
pnpm nx run web:storybook

# Build Storybook for deployment
pnpm nx run web:build-storybook
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
│   │   ├── .storybook/     # Storybook configuration
│   │   ├── components/     # React components
│   │   ├── stories/        # Storybook stories
│   │   └── storybook-static/ # Built Storybook (deployed)
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
├── _docs/                  # Project documentation
│   ├── project-definition/ # Architecture, tech stack, rules
│   ├── phases/             # Development phases
│   ├── phase-plans/        # Detailed implementation plans
│   ├── storybook-usage-guide.md # Storybook usage guide
│   └── component-development-guide.md # Component development guide
└── .github/workflows/      # CI/CD pipelines including Storybook deployment
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
- Tailwind CSS v4 for styling with semantic design system
- Storybook 9 for component development and documentation
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
   - Storybook: http://localhost:4400

## Contributing

1. Follow the established project structure
2. Use TypeScript strict mode
3. Write tests for new features (unit tests and E2E tests)
4. Follow the coding standards in `_docs/project-definition/`
5. Work with E2E tests in `apps/web-e2e/` for user flow validation
6. Use Storybook for component development and documentation
7. Follow the semantic design system guidelines
8. Test components in both light and dark modes

## License

MIT
