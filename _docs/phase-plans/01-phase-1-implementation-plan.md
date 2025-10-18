# Phase 1: Setup & Foundation - Implementation Plan

**@fileoverview** Detailed step-by-step implementation plan for Phase 1 of the Alva project, breaking down each task into actionable development steps with specific commands, file structures, and validation criteria.

---

## Implementation Overview

**Goal**: Establish a fully functional microservices foundation with 3 services (Web, API, Auth) running in Docker with proper authentication and database connectivity.

**Estimated Duration**: 1-2 weeks (40-80 hours)

**Success Criteria**: All 3 services running locally and in Docker, with authentication working end-to-end.

---

## Implementation Steps

### Step 1: NX Workspace Initialization

**Objective**: Create the monorepo foundation with proper tooling

**Estimated Time**: 4-6 hours

#### 1.1 Initialize NX Workspace
```bash
# Create NX workspace
npx create-nx-workspace@latest alva --preset=apps --packageManager=pnpm --nxCloud=false

# Navigate to workspace
cd alva

# Install additional NX generators
pnpm add -D @nx/next @nx/node @nx/js
```

#### 1.2 Configure TypeScript and Path Aliases
```bash
# Create tsconfig.base.json
cat > tsconfig.base.json << 'EOF'
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@alva/ui": ["libs/ui/src/index.ts"],
      "@alva/database": ["libs/database/src/index.ts"],
      "@alva/shared-types": ["libs/shared-types/src/index.ts"],
      "@alva/validation": ["libs/validation/src/index.ts"],
      "@alva/api-client": ["libs/api-client/src/index.ts"],
      "@alva/auth-client": ["libs/auth-client/src/index.ts"],
      "@alva/utils": ["libs/utils/src/index.ts"]
    },
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
EOF
```

#### 1.3 Create Application Structure
```bash
# Generate Next.js web app
npx nx g @nx/next:app web --directory=apps/web --style=css --appDir=true --src=false --importPath=@alva/web

# Generate Node.js API app
npx nx g @nx/node:app api --directory=apps/api --framework=express --importPath=@alva/api

# Generate Node.js Auth app
npx nx g @nx/node:app auth --directory=apps/auth --framework=express --importPath=@alva/auth
```

#### 1.4 Create Shared Libraries
```bash
# Generate shared libraries
npx nx g @nx/js:lib ui --directory=libs/ui --importPath=@alva/ui --publishable=true --buildable=true
npx nx g @nx/js:lib database --directory=libs/database --importPath=@alva/database --publishable=true --buildable=true
npx nx g @nx/js:lib shared-types --directory=libs/shared-types --importPath=@alva/shared-types --publishable=true --buildable=true
npx nx g @nx/js:lib validation --directory=libs/validation --importPath=@alva/validation --publishable=true --buildable=true
npx nx g @nx/js:lib api-client --directory=libs/api-client --importPath=@alva/api-client --publishable=true --buildable=true
npx nx g @nx/js:lib auth-client --directory=libs/auth-client --importPath=@alva/auth-client --publishable=true --buildable=true
npx nx g @nx/js:lib utils --directory=libs/utils --importPath=@alva/utils --publishable=true --buildable=true
```

#### 1.5 Configure NX Tags and Module Boundaries
```bash
# Create nx.json configuration
cat > nx.json << 'EOF'
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js"
    ],
    "sharedGlobals": []
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  },
  "generators": {
    "@nx/next": {
      "application": {
        "style": "css",
        "linter": "eslint"
      }
    },
    "@nx/node": {
      "application": {
        "linter": "eslint"
      }
    }
  },
  "plugins": [
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    }
  ]
}
EOF
```

#### 1.6 Set Up Development Tools
```bash
# Install development dependencies
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              },
              {
                "sourceTag": "type:ui",
                "onlyDependOnLibsWithTags": ["type:ui", "type:util"]
              },
              {
                "sourceTag": "type:feature",
                "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util"]
              },
              {
                "sourceTag": "type:util",
                "onlyDependOnLibsWithTags": ["type:util"]
              }
            ]
          }
        ]
      }
    }
  ]
}
EOF
```

#### 1.7 Create JWT Key Generation Script
```bash
# Create tools directory
mkdir -p tools/scripts

# Create JWT key generation script
cat > tools/scripts/generate-keys.ts << 'EOF'
import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

console.log('Generated JWT key pair:');
console.log('\n--- PUBLIC KEY ---');
console.log(publicKey);
console.log('\n--- PRIVATE KEY ---');
console.log(privateKey);

// Save to .env.example files
const publicKeyForEnv = publicKey.replace(/\n/g, '\\n');
const privateKeyForEnv = privateKey.replace(/\n/g, '\\n');

console.log('\n--- FOR .env FILES ---');
console.log(`JWT_PUBLIC_KEY=${publicKeyForEnv}`);
console.log(`JWT_PRIVATE_KEY=${privateKeyForEnv}`);
EOF
```

**Validation**: Run `npx nx serve web`, `npx nx serve api`, `npx nx serve auth` - all should start without errors.

---

### Step 2: Database Setup (PostgreSQL + Drizzle)

**Objective**: Set up PostgreSQL with Drizzle ORM and separate schemas

**Estimated Time**: 6-8 hours

#### 2.1 Create Docker Compose Configuration
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: alva
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/var/lib/redis/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF
```

#### 2.2 Install Drizzle ORM
```bash
# Install Drizzle packages
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg

# Add to shared libraries
cd libs/database
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
```

#### 2.3 Create Database Client
```bash
# Create libs/database/src/client.ts
cat > libs/database/src/client.ts << 'EOF'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as authSchema from './schemas/auth';
import * as appSchema from './schemas/app';

export const createDbPool = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return drizzle(pool, { 
    schema: { ...authSchema, ...appSchema } 
  });
};

export type Database = ReturnType<typeof createDbPool>;
export * from './schemas/auth';
export * from './schemas/app';
EOF
```

#### 2.4 Create Database Schemas
```bash
# Create auth schema
mkdir -p libs/database/src/schemas/auth
cat > libs/database/src/schemas/auth/users.ts << 'EOF'
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'auth'
});
EOF

cat > libs/database/src/schemas/auth/refresh-tokens.ts << 'EOF'
import { pgTable, uuid, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, {
  schema: 'auth'
});
EOF

cat > libs/database/src/schemas/auth/index.ts << 'EOF'
export * from './users';
export * from './refresh-tokens';
EOF

# Create app schema
mkdir -p libs/database/src/schemas/app
cat > libs/database/src/schemas/app/client-profiles.ts << 'EOF'
import { pgTable, uuid, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  profileData: jsonb('profile_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'app'
});
EOF

cat > libs/database/src/schemas/app/index.ts << 'EOF'
export * from './client-profiles';
EOF
```

#### 2.5 Configure Drizzle Kit
```bash
# Create drizzle.config.ts
cat > drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './libs/database/src/schemas/**/*.ts',
  out: './libs/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/alva'
  }
} satisfies Config;
EOF
```

#### 2.6 Create Database Initialization Script
```bash
# Create tools/scripts/init-db.ts
cat > tools/scripts/init-db.ts << 'EOF'
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/alva'
});

async function initDatabase() {
  try {
    await client.connect();
    
    // Create schemas
    await client.query('CREATE SCHEMA IF NOT EXISTS auth;');
    await client.query('CREATE SCHEMA IF NOT EXISTS app;');
    
    console.log('Database schemas created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
EOF
```

**Validation**: Run `docker-compose up -d postgres redis` and `pnpm tsx tools/scripts/init-db.ts` - schemas should be created successfully.

---

### Step 3: Next.js Frontend App (Web Service)

**Objective**: Set up Next.js as pure frontend with no API routes

**Estimated Time**: 4-6 hours

#### 3.1 Configure Next.js Application
```bash
# Remove Express from web app and configure Next.js
cd apps/web

# Update package.json
cat > package.json << 'EOF'
{
  "name": "@alva/web",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@alva/ui": "*",
    "@alva/api-client": "*",
    "@alva/auth-client": "*",
    "@alva/shared-types": "*"
  },
  "devDependencies": {
    "@nx/next": "*",
    "typescript": "^5.0.2"
  }
}
EOF

# Install dependencies
pnpm install
```

#### 3.2 Configure Next.js Settings
```bash
# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },
  images: {
    domains: ['localhost'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          500: '#f97316',
          600: '#ea580c',
          900: '#9a3412',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
EOF
```

#### 3.3 Create App Directory Structure
```bash
# Create app directory structure
mkdir -p app/{auth,dashboard,onboarding}

# Create root layout
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alva - AI Marketing Platform',
  description: 'Your AI-powered marketing assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

# Create root page
cat > app/page.tsx << 'EOF'
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-secondary-900 mb-8">
          Welcome to Alva
        </h1>
        <p className="text-center text-secondary-500 text-lg">
          Your AI-powered marketing assistant
        </p>
      </div>
    </main>
  );
}
EOF

# Create globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
EOF
```

#### 3.4 Create Route Groups
```bash
# Create auth route group
cat > app/auth/layout.tsx << 'EOF'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {children}
      </div>
    </div>
  );
}
EOF

cat > app/auth/login/page.tsx << 'EOF'
export default function LoginPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-center text-gray-600">
        Enter your email to receive a magic link
      </p>
      {/* Login form will be implemented in Phase 2 */}
    </div>
  );
}
EOF

# Create dashboard route group
cat > app/dashboard/layout.tsx << 'EOF'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold">Alva Dashboard</h1>
            {/* Navigation will be implemented in Phase 2 */}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
EOF

cat > app/dashboard/page.tsx << 'EOF'
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome to your Dashboard
      </h1>
      <p className="text-gray-600">
        Dashboard content will be implemented in Phase 2.
      </p>
    </div>
  );
}
EOF
```

**Validation**: Run `npx nx serve web` - Next.js should start on port 4200 and display the welcome page.

---

### Step 4: Auth Service Implementation (Fastify)

**Objective**: Build standalone auth service with JWT-based authentication

**Estimated Time**: 8-10 hours

#### 4.1 Configure Fastify Auth Application
```bash
cd apps/auth

# Update package.json
cat > package.json << 'EOF'
{
  "name": "@alva/auth",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "fastify": "^4.24.0",
    "@fastify/cors": "^8.4.0",
    "@fastify/cookie": "^8.3.0",
    "@fastify/rate-limit": "^8.0.3",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "@alva/database": "*",
    "@alva/shared-types": "*",
    "@alva/validation": "*"
  },
  "devDependencies": {
    "@nx/node": "*",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "typescript": "^5.0.2"
  }
}
EOF

# Install dependencies
pnpm install
```

#### 4.2 Create Auth Service Structure
```bash
# Create source directory structure
mkdir -p src/{routes,services,middleware,uh,config}

# Create main app file
cat > src/app.ts << 'EOF'
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { createDbPool } from '@alva/database';

const fastify = Fastify({
  logger: true
});

export async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin: process.env.WEB_URL || 'http://localhost:4200',
    credentials: true
  });

  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'your-secret-key'
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // Register database
  const db = createDbPool(process.env.DATABASE_URL!);
  fastify.decorate('db', db);

  // Register routes
  await fastify.register(authRoutes, { prefix: '/auth' });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'auth' };
  });

  return fastify;
}
EOF

# Create server file
cat > src/server.ts << 'EOF'
import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();
  
  try {
    const port = parseInt(process.env.PORT || '3002');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`Auth service running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
EOF
```

#### 4.3 Implement JWT Token Service
```bash
# Create token service
cat > src/services/token.service.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenService {
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY!;
    this.publicKey = process.env.JWT_PUBLIC_KEY!;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.publicKey, { algorithms: ['RS256'] }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): boolean {
    // Additional validation logic can be added here
    return token.length === 64; // 32 bytes = 64 hex characters
  }
}
EOF
```

#### 4.4 Create Auth Routes
```bash
# Create auth routes
cat > src/routes/auth.ts << 'EOF'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { TokenService } from '../services/token.service';
import { users, refreshTokens } from '@alva/database';
import { eq } from 'drizzle-orm';

const registerSchema = z.object({
  email: z.string().email()
});

const verifySchema = z.object({
  token: z.string()
});

export async function authRoutes(fastify: FastifyInstance) {
  const tokenService = new TokenService();

  // Register user
  fastify.post('/register', {
    schema: {
      body: registerSchema
    }
  }, async (request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>, reply: FastifyReply) => {
    const { email } = request.body;
    
    try {
      // Check if user already exists
      const existingUser = await fastify.db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Create user
      const [newUser] = await fastify.db.insert(users).values({
        email,
        emailVerified: false
      }).returning();

      // Generate magic link token (simplified for now)
      const magicToken = tokenService.generateRefreshToken();

      // TODO: Send email with magic link
      console.log(`Magic link for ${email}: ${magicToken}`);

      return { 
        message: 'User registered successfully. Check your email for verification link.',
        userId: newUser.id 
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Verify magic link
  fastify.post('/verify-magic-link', {
    schema: {
      body: verifySchema
    }
  }, async (request: FastifyRequest<{ Body: z.infer<typeof verifySchema> }>, reply: FastifyReply) => {
    const { token } = request.body;

    try {
      // TODO: Verify magic link token against database
      // For now, we'll create a mock verification
      
      // Generate tokens
      const accessToken = tokenService.generateAccessToken({
        userId: 'mock-user-id',
        email: 'mock@example.com'
      });

      const refreshToken = tokenService.generateRefreshToken();

      // Set refresh token as httpOnly cookie
      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return {
        accessToken,
        user: {
          id: 'mock-user-id',
          email: 'mock@example.com'
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user
  fastify.get('/me', {
    preHandler: async (request, reply) => {
      // TODO: Implement JWT validation middleware
    }
  }, async (request, reply) => {
    return {
      user: {
        id: 'mock-user-id',
        email: 'mock@example.com'
      }
    };
  });
}
EOF
```

**Validation**: Run `npx nx serve auth` - Auth service should start on port 3002 and respond to health checks.

---

### Step 5: API Server Implementation (Fastify)

**Objective**: Build API server for business logic and LLM integration

**Estimated Time**: 6-8 hours

#### 5.1 Configure Fastify API Application
```bash
cd apps/api

# Update package.json
cat > package.json << 'EOF'
{
  "name": "@alva/api",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "fastify": "^4.24.0",
    "@fastify/cors": "^8.4.0",
    "@fastify/swagger": "^8.12.0",
    "@fastify/swagger-ui": "^2.0.0",
    "openai": "^4.20.0",
    "bullmq": "^4.15.0",
    "ioredis": "^5.3.2",
    "@alva/database": "*",
    "@alva/shared-types": "*",
    "@alva/validation": "*"
  },
  "devDependencies": {
    "@nx/node": "*",
    "typescript": "^5.0.2"
  }
}
EOF

# Install dependencies
pnpm install
```

#### 5.2 Create API Service Structure
```bash
# Create source directory structure
mkdir -p src/{routes,services,middleware,uh,config,jobs}

# Create main app file
cat > src/app.ts << 'EOF'
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { authMiddleware } from './middleware/auth';
import { apiRoutes } from './routes/api';
import { createDbPool } from '@alva/database';

const fastify = Fastify({
  logger: true
});

export async function buildApp() {
  // Register plugins
  await fastify.register(cors, {
    origin: process.env.WEB_URL || 'http://localhost:4200',
    credentials: true
  });

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Alva API',
        description: 'API for Alva marketing platform',
        version: '1.0.0'
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs'
  });

  // Register database
  const db = createDbPool(process.env.DATABASE_URL!);
  fastify.decorate('db', db);

  // Register middleware
  fastify.register(authMiddleware);

  // Register routes
  await fastify.register(apiRoutes, { prefix: '/api' });

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', service: 'api' };
  });

  return fastify;
}
EOF

# Create server file
cat > src/server.ts << 'EOF'
import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();
  
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    console.log(`API service running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
EOF
```

#### 5.3 Implement Authentication Middleware
```bash
# Create auth middleware
cat > src/middleware/auth.ts << 'EOF'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7);
      const publicKey = process.env.JWT_PUBLIC_KEY!;

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
        userId: string;
        email: string;
      };

      request.user = decoded;
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });
}
EOF
```

#### 5.4 Create API Routes
```bash
# Create API routes
cat > src/routes/api.ts << 'EOF'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const generatePlanSchema = z.object({
  clientProfile: z.object({
    // Define client profile structure
    businessName: z.string(),
    industry: z.string(),
    // Add more fields as needed
  })
});

export async function apiRoutes(fastify: FastifyInstance) {
  // Generate marketing plan
  fastify.post('/plans/generate', {
    schema: {
      body: generatePlanSchema
    },
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Body: z.infer<typeof generatePlanSchema> }>, reply: FastifyReply) => {
    try {
      const { clientProfile } = request.body;
      const userId = (request as any).user.userId;

      // TODO: Implement plan generation logic
      const plan = {
        id: 'mock-plan-id',
        userId,
        clientProfile,
        generatedAt: new Date().toISOString(),
        status: 'completed'
      };

      return { plan };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get user plans
  fastify.get('/plans', {
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId;

      // TODO: Implement plan retrieval logic
      const plans = [
        {
          id: 'mock-plan-id',
          userId,
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      ];

      return { plans };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Save onboarding section
  fastify.post('/onboarding/save-section', {
    schema: {
      body: z.object({
        section: z.string(),
        data: z.any()
      })
    },
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Body: { section: string; data: any } }>, reply: FastifyReply) => {
    try {
      const { section, data } = request.body;
      const userId = (request as any).user.userId;

      // TODO: Implement onboarding data saving logic
      console.log(`Saving onboarding section ${section} for user ${userId}:`, data);

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
EOF
```

**Validation**: Run `npx nx serve api` - API service should start on port 3001 and display Swagger docs at `/docs`.

---

### Step 6: Docker Configuration

**Objective**: Containerize all 3 services for consistent deployment

**Estimated Time**: 4-6 hours

#### 6.1 Create Dockerfiles for Each Service
```bash
# Create Web Dockerfile
cat > apps/web/Dockerfile << 'EOF'
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm nx build web

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

# Create API Dockerfile
cat > apps/api/Dockerfile << 'EOF'
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm nx build api

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/api ./dist

USER nodejs

EXPOSE 3001

CMD ["node", "dist/main.js"]
EOF

# Create Auth Dockerfile
cat > apps/auth/Dockerfile << 'EOF'
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm nx build auth

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/auth ./dist

USER nodejs

EXPOSE 3002

CMD ["node", "dist/main.js"]
EOF
```

#### 6.2 Update Docker Compose for All Services
```bash
# Update docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: alva
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/var/lib/redis/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_AUTH_URL=http://localhost:3002
    depends_on:
      - api
      - auth

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - REDIS_URL=redis://redis:6379
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  auth:
    build:
      context: .
      dockerfile: apps/auth/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - COOKIE_SECRET=${COOKIE_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
EOF
```

#### 6.3 Create Environment Files
```bash
# Create .env.example files
cat > .env.example << 'EOF'
# Hook3 Keys (generate with pnpm generate:keys)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n################################
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n################################

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alva
REDIS_URL=redis://localhost:6379

# AI/LLM
OPENAI_API_KEY=sk-...

# Security
COOKIE_SECRET=your-super-secret-cookie-key

# URLs
WEB_URL=http://localhost:3000
API_URL=http://localhost:3001
AUTH_URL=http://localhost:3002
EOF
```

**Validation**: Run `docker-compose up --build` - All 5 services should start and be accessible on their respective ports.

---

### Step 7: Development Scripts and Utilities

**Objective**: Create developer-friendly scripts and documentation

**Estimated Time**: 2-3 hours

#### 7.1 Update Root Package.json
```bash
# Update package.json with development scripts
cat > package.json << 'EOF'
{
  "name": "alva",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "docker-compose up",
    "dev:web": "nx serve web",
    "dev:api": "nx serve api",
    "dev:auth": "nx serve auth",
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all",
    "lint": "nx run-many --target=lint --all",
    "generate:keys": "tsx tools/scripts/generate-keys.ts",
    "db:init": "tsx tools/scripts/init-db.ts",
    "db:migrate": "drizzle-kit migrate",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  },
  "devDependencies": {
    "@nx/eslint": "*",
    "@nx/js": "*",
    "@nx/next": "*",
    "@nx/node": "*",
    "eslint": "~8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.2",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "prettier": "^3.1.1",
    "tsx": "^4.6.0",
    "typescript": "~5.3.0"
  }
}
EOF
```

#### 7.2 Create README.md
```bash
# Create comprehensive README
cat > README.md << 'EOF'
# Alva - AI Marketing Platform

A microservices-based AI marketing platform built with Next.js, Fastify, and PostgreSQL.

## Architecture

- **Web Service** (Next.js): Frontend application on port 3000
- **API Service** (Fastify): Business logic and LLM integration on port 3001
- **Auth Service** (Fastify): Authentication and user management on port 3002
- **PostgreSQL**: Primary database with separate auth and app schemas
- **Redis**: Caching and job queue

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd alva
   pnpm install
   ```

2. **Generate JWT keys**
   ```bash
   pnpm generate:keys
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your keys and configuration
   ```

4. **Start all services**
   ```bash
   pnpm docker:up
   ```

5. **Initialize database**
   ```bash
   pnpm db:init
   ```

## Development

### Start individual services
```bash
pnpm dev:web    # Start web service only
pnpm dev:api    # Start API service only
pnpm dev:auth   # Start auth service only
```

### Docker commands
```bash
pnpm docker:up      # Start all services in Docker
pnpm docker:down    # Stop all services
pnpm docker:logs    # View logs from all services
```

### Database commands
```bash
pnpm db:migrate     # Run database migrations
pnpm db:init        # Initialize database schemas
```

## Services

### Web Service (Port 3000)
- Next.js 14 with App Router
- Tailwind CSS for styling
- No API routes (pure frontend)

### API Service (Port 3001)
- Fastify with OpenAPI documentation
- JWT authentication middleware
- LLM integration for plan generation
- Swagger docs available at `/docs`

### Auth Service (Port 3002)
- Fastify with JWT token management
- Magic link authentication
- Rate limiting and security headers
- Health check at `/health`

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

```bash
pnpm test          # Run all tests
pnpm lint          # Lint all services
pnpm build         # Build all services
```

## Contributing

1. Follow the conventional commit format
2. Ensure all tests pass
3. Update documentation as needed
4. Use the provided ESLint and Prettier configurations
EOF
```

**Validation**: Run `pnpm dev` - All services should start and be accessible.

---

## Final Validation Checklist

### ✅ Infrastructure
- [ ] NX workspace initialized with 3 applications
- [ ] All libraries created and properly configured
- [ ] TypeScript strict mode enabled
- [ ] Path aliases working correctly

### ✅ Database
- [ ] PostgreSQL running in Docker
- [ ] Redis running in Docker
- [ ] Auth and app schemas created
- [ ] Drizzle ORM configured
- [ ] Database migrations working

### ✅ Services
- [ ] Web service (Next.js) running on port 3000
- [ ] API service (Fastify) running on port 3001
- [ ] Auth service (Fastify) running on port 3002
- [ ] All health check endpoints returning 200
- [ ] Services can communicate with each other

### ✅ Authentication
- [ ] JWT keys generated and configured
- [ ] Auth service can generate tokens
- [ ] API service can validate tokens
- [ ] Magic link flow working (mock implementation)

### ✅ Docker
- [ ] All services containerized
- [ ] Docker Compose starts all services
- [ ] Services can communicate in Docker environment
- [ ] Health checks working in Docker

### ✅ Development Experience
- [ ] All development scripts working
- [ ] Hot reload working for all services
- [ ] ESLint and Prettier configured
- [ ] README documentation complete

---

## Next Steps

After completing Phase 1, proceed to **Phase 2: MVP** to implement:

1. **Email capture landing page**
2. **26-card onboarding flow**
3. **Client profile JSON generation**
4. **Basic marketing plan generation**
5. **Summary preview page**
6. **Simple chat interface with Alva**

The foundation established in Phase 1 will support all these features with proper authentication, database connectivity, and service communication.

---

**Estimated Total Time**: 40-80 hours over 1-2 weeks  
**Team Size**: 1-2 developers  
**Complexity**: Medium (microservices coordination)  
**Risk Level**: Low (proven technologies and patterns)
