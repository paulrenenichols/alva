# Alva Project Rules & Structure

**@fileoverview** Comprehensive project organization guidelines for the Alva NX monorepo, including directory structure, naming conventions, code organization patterns, and NX-specific best practices.

---

## Philosophy

### AI-First Codebase Principles

1. **Modularity**: Clear boundaries between features and concerns
2. **Navigability**: Easy to find code through semantic organization
3. **Readability**: Self-documenting code with comprehensive comments
4. **Scalability**: Patterns that work from MVP to enterprise scale
5. **Searchability**: Optimized for both semantic and grep/regex searches

### Core Constraints

- **500 Line Limit**: No file exceeds 500 lines (exceptions: generated code, config)
- **@fileoverview Required**: Every file starts with a description comment
- **Function Documentation**: All functions have JSDoc/TSDoc blocks
- **Descriptive Names**: Files, functions, and variables have clear, searchable names
- **No Enums**: Use maps or const objects instead for better compatibility

---

## Monorepo Structure

### High-Level Layout

```
alva/
├── apps/                    # Deployable applications
│   ├── web/                # Next.js web application
│   └── api/                # Standalone API (if needed, future)
├── libs/                    # Shared libraries
│   ├── ui/                 # UI components & design system
│   ├── data-access/        # Database, API clients, tRPC
│   ├── feature/            # Feature-specific logic
│   ├── utils/              # Shared utilities
│   └── types/              # Shared TypeScript types
├── tools/                   # Build tools, scripts, generators
├── _docs/                   # Project documentation
├── .github/                 # GitHub workflows, templates
├── docker/                  # Docker configurations
├── nx.json                  # NX workspace configuration
├── package.json             # Workspace dependencies
└── tsconfig.base.json       # Base TypeScript config
```

### NX Library Types

NX organizes libraries by **type** and **scope**:

**Types**:

- `feature`: Business logic, smart components, feature shells
- `ui`: Presentational components, design system
- `data-access`: API calls, state management, database access
- `util`: Pure functions, helpers, constants
- `type`: TypeScript interfaces, types, schemas

**Scopes** (examples):

- `marketing`: Marketing plan logic
- `onboarding`: Onboarding flow
- `auth`: Authentication
- `dashboard`: Dashboard features
- `shared`: Cross-cutting concerns

---

## Directory Structure

### apps/web/ (Next.js Application)

```
apps/web/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── verify/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── action-board/
│   │   ├── chat/
│   │   ├── settings/
│   │   ├── layout.tsx      # Dashboard layout with nav
│   │   └── page.tsx        # Dashboard home
│   ├── onboarding/
│   │   ├── [section]/
│   │   │   └── [card]/
│   │   │       └── page.tsx
│   │   ├── summary/
│   │   ├── welcome/
│   │   └── layout.tsx
│   ├── api/                # API routes
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── onboarding/
│   │   └── plans/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── public/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── middleware.ts           # Edge middleware (auth, redirects)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### libs/ui/ (Design System)

```
libs/ui/
├── src/
│   ├── components/         # Component library
│   │   ├── primitives/     # Atomic components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   └── index.ts
│   │   ├── patterns/       # Composed components
│   │   │   ├── FormField/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   └── features/       # Domain-specific components
│   │       ├── OnboardingCard/
│   │       ├── TaskCard/
│   │       └── index.ts
│   ├── hooks/              # Reusable React hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── stores/             # Zustand stores
│   │   ├── onboarding.store.ts
│   │   ├── theme.store.ts
│   │   └── index.ts
│   ├── styles/             # Shared styles, Tailwind utilities
│   │   ├── animations.css
│   │   ├── utilities.css
│   │   └── index.ts
│   ├── utils/              # UI-specific utilities
│   │   ├── cn.ts           # Class name merger
│   │   └── index.ts
│   └── index.ts            # Main export
├── tailwind.config.ts
└── tsconfig.json
```

### libs/data-access/ (API & Database)

```
libs/data-access/
├── src/
│   ├── trpc/               # tRPC setup
│   │   ├── routers/
│   │   │   ├── auth.router.ts
│   │   │   ├── onboarding.router.ts
│   │   │   ├── plan.router.ts
│   │   │   └── index.ts
│   │   ├── context.ts      # tRPC context
│   │   ├── middleware.ts   # Auth middleware
│   │   ├── router.ts       # App router
│   │   └── index.ts
│   ├── db/                 # Database layer
│   │   ├── schemas/        # Drizzle schemas
│   │   │   ├── user.schema.ts
│   │   │   ├── client-profile.schema.ts
│   │   │   ├── plan.schema.ts
│   │   │   └── index.ts
│   │   ├── migrations/     # SQL migrations
│   │   ├── client.ts       # DB connection
│   │   └── index.ts
│   ├── services/           # Business logic services
│   │   ├── plan-generation.service.ts
│   │   ├── onboarding.service.ts
│   │   └── index.ts
│   ├── lib/                # External API clients
│   │   ├── openai.client.ts
│   │   └── index.ts
│   └── index.ts
├── drizzle.config.ts
└── tsconfig.json
```

### libs/feature/ (Feature Libraries)

```
libs/feature/
├── onboarding/
│   └── src/
│       ├── components/     # Onboarding-specific components
│       ├── hooks/          # Onboarding hooks
│       ├── utils/          # Onboarding utilities
│       ├── constants.ts    # Onboarding constants
│       └── index.ts
├── marketing-plan/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── generators/     # Plan generation logic
│       │   ├── ppc.generator.ts
│       │   ├── blog.generator.ts
│       │   └── index.ts
│       └── index.ts
└── dashboard/
    └── src/
        ├── components/
        ├── hooks/
        └── index.ts
```

### libs/utils/ (Shared Utilities)

```
libs/utils/
└── src/
    ├── validators/         # Zod schemas
    │   ├── client-profile.validator.ts
    │   ├── plan.validator.ts
    │   └── index.ts
    ├── formatters/         # Data formatting
    │   ├── date.formatter.ts
    │   ├── currency.formatter.ts
    │   └── index.ts
    ├── helpers/            # General utilities
    │   ├── string.helpers.ts
    │   ├── array.helpers.ts
    │   └── index.ts
    ├── constants/          # App-wide constants
    │   ├── routes.constants.ts
    │   ├── config.constants.ts
    │   └── index.ts
    └── index.ts
```

### libs/types/ (Shared Types)

```
libs/types/
└── src/
    ├── models/             # Domain models
    │   ├── user.types.ts
    │   ├── client-profile.types.ts
    │   ├── plan.types.ts
    │   └── index.ts
    ├── api/                # API types
    │   ├── request.types.ts
    │   ├── response.types.ts
    │   └── index.ts
    ├── ui/                 # UI types
    │   ├── component.types.ts
    │   └── index.ts
    └── index.ts
```

---

## File Naming Conventions

### General Rules

1. **Use kebab-case for files**: `user-profile.service.ts`
2. **Use PascalCase for components**: `Button.tsx`
3. **Suffix files by type**: `.service.ts`, `.types.ts`, `.test.tsx`, `.stories.tsx`
4. **Index files re-export**: `index.ts` for barrel exports

### Component Files

```
// React Component (PascalCase)
Button.tsx

// Component test
Button.test.tsx

// Storybook story
Button.stories.tsx

// Component styles (if not using Tailwind inline)
Button.module.css

// Index for barrel export
index.ts
```

### Non-Component Files

```
// Service (kebab-case + .service.ts)
plan-generation.service.ts

// Utility (kebab-case + .ts)
format-currency.ts

// Hook (camelCase, use prefix)
useMediaQuery.ts

// Store (kebab-case + .store.ts)
onboarding.store.ts

// Type definitions (kebab-case + .types.ts)
client-profile.types.ts

// Validator/Schema (kebab-case + .validator.ts or .schema.ts)
user.validator.ts
user.schema.ts (Drizzle schema)

// Constants (kebab-case + .constants.ts)
routes.constants.ts

// Test (same name + .test.ts)
format-currency.test.ts

// Config (kebab-case + .config.ts)
tailwind.config.ts
```

### API Routes (Next.js)

```
// API route handler
apps/web/app/api/auth/route.ts

// Dynamic route
apps/web/app/api/plans/[id]/route.ts

// Route with method handlers
apps/web/app/api/onboarding/route.ts
  → export async function GET(req) {}
  → export async function POST(req) {}
```

---

## Code Organization

### File Structure Template

Every file should follow this structure:

```typescript
/**
 * @fileoverview Brief description of the file's purpose.
 *
 * Longer description if needed, explaining what this file contains,
 * its role in the application, and any important context.
 */

// 1. External imports (libraries)
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Internal imports (workspace libraries)
import { Button } from "@alva/ui/components/primitives";
import { trpc } from "@alva/data-access/trpc";

// 3. Relative imports (same library)
import { formatDate } from "../utils/date.formatter";
import type { Task } from "../types";

// 4. Type definitions (if not in separate .types.ts file)
interface TaskCardProps {
  task: Task;
  onComplete: () => void;
}

// 5. Constants (if not in separate .constants.ts file)
const TASK_STATUS_MAP = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
} as const;

// 6. Main component/function/class
/**
 * @description Displays a task card with status, description, and actions.
 *
 * @param {TaskCardProps} props - Component props
 * @param {Task} props.task - The task object to display
 * @param {Function} props.onComplete - Callback when task is marked complete
 *
 * @returns {JSX.Element} Rendered task card component
 */
export function TaskCard({ task, onComplete }: TaskCardProps) {
  // Implementation
}

// 7. Helper functions (private to this file)
/**
 * @description Calculates time remaining for a task.
 *
 * @param {Date} dueDate - The task's due date
 * @returns {string} Human-readable time remaining
 */
function calculateTimeRemaining(dueDate: Date): string {
  // Implementation
}

// 8. Exports (if using named exports at bottom)
export { TaskCard };
export type { TaskCardProps };
```

### Import Order

**1. External Dependencies** (libraries from node_modules)

```typescript
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
```

**2. Internal Workspace Libraries** (@alva/\*)

```typescript
import { Button } from "@alva/ui/components/primitives";
import { trpc } from "@alva/data-access/trpc";
import type { ClientProfile } from "@alva/types/models";
```

**3. Relative Imports** (same library)

```typescript
import { formatCurrency } from "../utils/formatters";
import { ROUTES } from "../constants";
import type { LocalType } from "./types";
```

**4. Styles** (last)

```typescript
import "./styles.css";
```

### Export Patterns

**Named Exports (Preferred)**:

```typescript
// component.tsx
export function Component() {}
export type ComponentProps = {};

// index.ts (barrel export)
export { Component } from "./Component";
export type { ComponentProps } from "./Component";
```

**Default Exports** (only for Next.js pages/layouts):

```typescript
// app/page.tsx
export default function HomePage() {}

// app/layout.tsx
export default function RootLayout({ children }) {}
```

---

## Function Documentation

### JSDoc/TSDoc Standard

Every function must have a documentation block:

```typescript
/**
 * @description Generates a marketing plan based on client profile.
 *
 * This function orchestrates the plan generation by:
 * 1. Validating the client profile
 * 2. Running module generators (PPC, Blog, etc.)
 * 3. Merging results via governance logic
 * 4. Saving to database
 *
 * @param {ClientProfile} clientProfile - The validated client profile
 * @param {PlanOptions} options - Generation options
 * @param {number} options.windowDays - Planning window in days (default: 90)
 * @param {string[]} options.enabledModules - Which modules to run
 *
 * @returns {Promise<MarketingPlan>} The generated marketing plan
 *
 * @throws {ValidationError} If client profile is invalid
 * @throws {GenerationError} If plan generation fails
 *
 * @example
 * const plan = await generatePlan(clientProfile, {
 *   windowDays: 90,
 *   enabledModules: ['ppc', 'blog', 'social'],
 * });
 */
export async function generatePlan(clientProfile: ClientProfile, options: PlanOptions): Promise<MarketingPlan> {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * @description A reusable button component with multiple variants.
 *
 * Supports primary, secondary, ghost, and destructive variants.
 * Automatically handles loading states with spinner.
 *
 * @component
 *
 * @param {ButtonProps} props - Component props
 * @param {'primary' | 'secondary' | 'ghost' | 'destructive'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {ReactNode} props.children - Button content
 *
 * @returns {JSX.Element} Rendered button component
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 */
export function Button({ variant = "primary", size = "md", loading, children, ...props }: ButtonProps) {
  // Implementation
}
```

---

## Variable Naming Conventions

### Use Descriptive Names with Auxiliary Verbs

**Boolean Variables** (is, has, can, should):

```typescript
const isLoading = true;
const hasError = false;
const canSubmit = form.isValid;
const shouldShowModal = user.isNew;
const didComplete = task.status === "completed";
```

**Arrays** (plural):

```typescript
const tasks = [];
const users = [];
const selectedItems = [];
```

**Functions** (verb + noun):

```typescript
function fetchUser() {}
function createPlan() {}
function validateForm() {}
function handleSubmit() {}
```

**Event Handlers** (handle + Event):

```typescript
function handleClick() {}
function handleInputChange() {}
function handleFormSubmit() {}
```

**Async Functions** (descriptive, implies Promise):

```typescript
async function generatePlan() {}
async function fetchUserProfile() {}
async function saveToDatabase() {}
```

### Avoid Single Letters (except iterators)

```typescript
// ❌ Bad
const u = getUser();
const p = plan.tasks;

// ✅ Good
const user = getUser();
const tasks = plan.tasks;

// ✅ OK for iterators
for (let i = 0; i < items.length; i++) {}
items.forEach((item, index) => {});
```

---

## TypeScript Patterns

### Prefer Interfaces for Objects, Types for Unions/Intersections

```typescript
// Interface for object shapes
interface User {
  id: string;
  email: string;
  name: string;
}

// Type for unions
type Status = "planned" | "in-progress" | "completed";

// Type for intersections
type AuthenticatedUser = User & {
  token: string;
  expiresAt: Date;
};
```

### Use Const Assertions Instead of Enums

```typescript
// ❌ Avoid enums
enum TaskStatus {
  Planned = "planned",
  InProgress = "in-progress",
  Completed = "completed",
}

// ✅ Use const objects with 'as const'
export const TASK_STATUS = {
  PLANNED: "planned",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
```

### Discriminated Unions for Variants

```typescript
type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; error: string } | { status: "loading" };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "success":
      return response.data; // TS knows .data exists
    case "error":
      throw new Error(response.error); // TS knows .error exists
    case "loading":
      return null;
  }
}
```

---

## NX-Specific Patterns

### Library Boundaries

Define in `nx.json`:

```json
{
  "targetDefaults": {
    "@nx/eslint:lint": {
      "options": {
        "lintFilePatterns": ["{projectRoot}/**/*.ts", "{projectRoot}/**/*.tsx"]
      }
    }
  }
}
```

Define in `.eslintrc.json`:

```json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "type:app",
                "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:data-access", "type:util"]
              },
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": ["type:ui", "type:data-access", "type:util", "type:type"]
              },
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:util", "type:type"]
              },
              {
                "sourceTag": "type:data-access",
                "onlyDependOnLibsWithTags": ["type:util", "type:type"]
              },
              {
                "sourceTag": "type:util",
                "onlyDependOnLibsWithTags": ["type:type"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### Library Tags

In `libs/ui/project.json`:

```json
{
  "name": "ui",
  "tags": ["type:ui", "scope:shared"]
}
```

In `libs/feature/onboarding/project.json`:

```json
{
  "name": "feature-onboarding",
  "tags": ["type:feature", "scope:onboarding"]
}
```

### Code Generators

Create custom generators in `tools/generators/`:

```typescript
// tools/generators/component/index.ts
import { Tree, formatFiles, generateFiles } from "@nx/devkit";

export default async function (tree: Tree, schema: any) {
  generateFiles(tree, path.join(__dirname, "files"), schema.directory, {
    ...schema,
    template: "",
  });
  await formatFiles(tree);
}
```

Run with:

```bash
nx g @alva/tools:component --name=MyComponent --directory=libs/ui/src/components
```

### Affected Commands

```bash
# Test only affected projects
nx affected:test

# Build only affected projects
nx affected:build

# Lint only affected projects
nx affected:lint

# Run custom target on affected
nx affected --target=e2e
```

---

## Testing Conventions

### File Placement

```
component.tsx
component.test.tsx     # Co-located unit tests
component.spec.tsx     # Alternative (if using .spec pattern)
```

### Test Structure

```typescript
/**
 * @fileoverview Unit tests for Button component.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("applies variant classes correctly", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-gold");

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-white");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await userEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );

      await userEvent.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("shows spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("status")).toBeInTheDocument(); // Spinner has role="status"
    });

    it("disables button when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });
});
```

### E2E Tests (Playwright)

```
apps/web-e2e/
├── src/
│   ├── fixtures/
│   │   ├── auth.fixture.ts      # Auth setup
│   │   └── data.fixture.ts      # Test data
│   ├── page-objects/
│   │   ├── onboarding.page.ts   # Page object pattern
│   │   └── dashboard.page.ts
│   └── specs/
│       ├── onboarding.spec.ts
│       └── dashboard.spec.ts
└── playwright.config.ts
```

---

## Error Handling

### Throw Errors, Don't Return Null

```typescript
// ❌ Bad
function getUser(id: string): User | null {
  if (!id) return null;
  // ...
}

// ✅ Good
function getUser(id: string): User {
  if (!id) {
    throw new Error("User ID is required");
  }
  // ...
}
```

### Use Custom Error Classes

```typescript
// libs/utils/src/errors/validation.error.ts
export class ValidationError extends Error {
  constructor(message: string, public field?: string, public code?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Usage
throw new ValidationError("Invalid email format", "email", "INVALID_FORMAT");
```

---

## Environment Variables

### Naming Convention

```bash
# .env.local (Next.js)
NEXT_PUBLIC_APP_URL=http://localhost:3000    # Public (exposed to browser)
DATABASE_URL=postgresql://...                # Private (server-only)
OPENAI_API_KEY=sk-...                        # Private
NEXT_PUBLIC_ENVIRONMENT=development          # Public
```

**Rules**:

- Prefix public vars with `NEXT_PUBLIC_`
- Use SCREAMING_SNAKE_CASE
- Never commit `.env.local` (use `.env.example` for template)

### Type-Safe Env Vars

```typescript
// libs/utils/src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "staging", "production"]),
});

export const env = envSchema.parse(process.env);
```

---

## Code Quality Enforcement

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "plugin:@nx/react", "plugin:@nx/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### Pre-commit Hooks (Husky + lint-staged)

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Git Workflow

### Branch Naming

```
feature/onboarding-flow
bugfix/login-redirect
hotfix/security-patch
refactor/component-structure
docs/api-documentation
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(onboarding): add brand clarity section
fix(auth): resolve token expiration bug
docs(readme): update installation instructions
refactor(ui): extract Button variants to config
test(dashboard): add E2E tests for task completion
chore(deps): update dependencies
```

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] Code follows project style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings
- [ ] Passes locally
```

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic import for heavy components
import dynamic from "next/dynamic";

const DashboardChart = dynamic(() => import("./DashboardChart"), {
  loading: () => <Skeleton />,
  ssr: false, // Client-only if needed
});
```

### Image Optimization

```typescript
import Image from "next/image";

<Image
  src="/images/hero.jpg"
  alt="Alva marketing director"
  width={800}
  height={600}
  priority // For above-the-fold images
/>;
```

### Bundle Analysis

```bash
# Add to package.json
"analyze": "ANALYZE=true nx build web"

# Run
pnpm analyze
```

---

## Documentation Standards

### README Files

Every library should have a README:

```markdown
# @alva/ui

UI component library and design system for Alva.

## Installation

This library is part of the Alva monorepo. No separate installation needed.

## Usage

\`\`\`typescript
import { Button } from '@alva/ui/components/primitives';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
\`\`\`

## Components

- **Primitives**: Atomic UI components (Button, Input, etc.)
- **Patterns**: Composed components (FormField, Modal, etc.)
- **Features**: Domain-specific components (TaskCard, etc.)

## Development

\`\`\`bash

# Run Storybook

nx storybook ui

# Test

nx test ui

# Build

nx build ui
\`\`\`
```

---

## Checklist for New Code

Before creating a PR:

- [ ] File has @fileoverview comment
- [ ] All functions have JSDoc documentation
- [ ] Follows naming conventions (kebab-case for files, descriptive names)
- [ ] No file exceeds 500 lines
- [ ] Uses design tokens (no hardcoded values)
- [ ] Imports are organized correctly
- [ ] TypeScript types are defined (no `any`)
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] No console.logs (use proper logging)
- [ ] Accessibility requirements met
- [ ] Responsive design implemented
- [ ] Code is DRY (no duplication)
- [ ] Performance optimized (memo, lazy loading, etc.)

---

## Future Considerations

### Scalability

- **Micro-frontends**: If apps grow, consider module federation
- **Monorepo splitting**: NX supports multiple repos synced via package versioning
- **Database sharding**: Plan for multi-tenancy at scale

### Tooling

- **Storybook**: Already planned for UI library
- **Chromatic**: Visual regression testing
- **Sentry**: Error monitoring and performance tracking
- **DataDog**: Full observability stack

### AI-Specific Optimizations

- **Prompt versioning**: Track prompt changes like migrations
- **LLM caching**: Cache identical requests to reduce costs
- **Fallback models**: Graceful degradation if primary model unavailable
