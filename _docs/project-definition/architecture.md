# Architecture Recommendations - Microservices Approach

**@fileoverview** Recommendations for Alva's microservices architecture including auth service, API server, and authentication strategies.

---

## Overview

Based on your requirements for a **separate auth service** and **separate API server** from the Next.js frontend, here are my recommendations.

---

## Recommended Architecture

### Service Structure

```
┌─────────────────┐
│   Next.js Web   │  Port 3000 - Frontend (React, SSR, UI)
│   Application   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ↓                 ↓
┌─────────────────┐  ┌─────────────────┐
│   API Server    │  │  Auth Service   │  Port 3002 - Authentication
│   (Fastify)     │  │   (Fastify)     │
│   Port 3001     │  └─────────────────┘
└─────────────────┘         │
         │                  │
         └──────────┬───────┘
                    ↓
         ┌─────────────────┐
         │   PostgreSQL    │  Database (shared or separate DBs)
         │     + Redis     │  Redis (sessions, cache, jobs)
         └─────────────────┘
```

---

## 1. Auth Service Framework

### ✅ Recommended: **Fastify**

**Why Fastify for Auth**:

- **Fast**: 2-3x faster than Express (critical for auth bottleneck)
- **TypeScript-First**: Excellent type inference and validation
- **JSON Schema Validation**: Built-in, perfect for validating auth requests
- **Plugin System**: Clean separation of concerns
- **Async/Await Native**: Modern, cleaner error handling
- **Low Overhead**: Minimal footprint for dedicated service

**Alternative 1: Express.js**

- **Pros**: Most popular, huge ecosystem, familiar to everyone
- **Cons**: Slower, callback-based (though async works), less modern
- **Use Case**: If team is already expert in Express

**Alternative 2: Hono**

- **Pros**: Fastest Node framework, edge-compatible, ultra-modern
- **Cons**: Smaller ecosystem, newer (less mature)
- **Use Case**: If deploying auth to edge (Cloudflare Workers)

**Alternative 3: NestJS**

- **Pros**: Enterprise structure, dependency injection, decorators
- **Cons**: Heavier, more boilerplate, overkill for focused service
- **Use Case**: Large team wanting Java/Spring-like structure

---

## 2. API Server Framework

### ✅ Recommended: **Fastify**

**Why Fastify for API**:

- **Performance**: Handle high throughput (plan generation, LLM requests)
- **Type Safety**: End-to-end with TypeScript
- **Schema Validation**: Automatic request/response validation
- **Plugin Ecosystem**: Auth, CORS, rate limiting, etc.
- **Consistency**: Same stack as auth service (shared patterns)

**Alternative 1: Express.js**

- **Pros**: Battle-tested, massive ecosystem
- **Cons**: Slower, more middleware needed
- **Use Case**: Conservative choice, proven at scale

**Alternative 2: Hono**

- **Pros**: Extremely fast, modern DX, edge-ready
- **Cons**: Newer, smaller community
- **Use Case**: Performance-critical, edge deployment

**Alternative 3: NestJS**

- **Pros**: Built-in modules for everything, structured, testable
- **Cons**: Heavy, steep learning curve, more code
- **Use Case**: Complex domain logic, large team

---

## 3. Authentication Strategy

### ✅ Recommended: **Hybrid JWT + Refresh Token**

**Architecture**:

```typescript
// Short-lived access token (JWT)
{
  type: 'access',
  userId: 'uuid',
  email: 'user@example.com',
  exp: 15 * 60, // 15 minutes
}

// Long-lived refresh token (stored in DB)
{
  type: 'refresh',
  userId: 'uuid',
  tokenHash: 'sha256...',
  exp: 7 * 24 * 60 * 60, // 7 days
  device: 'Chrome on MacOS',
}
```

**Flow**:

1. **Login**: Email magic link → Auth service validates → Returns access + refresh tokens
2. **API Calls**: Frontend sends access JWT → API validates signature
3. **Token Refresh**: When access expires, use refresh token → Get new access token
4. **Logout**: Revoke refresh token from database

**Why This Approach**:

- **Stateless Access**: No DB lookup for every request (fast)
- **Revocable**: Can revoke refresh tokens (security)
- **Scalable**: JWTs work across multiple API instances
- **Secure**: Short-lived access tokens limit exposure

**Alternative 1: Pure JWT (Not Recommended)**

- **Pros**: Fully stateless, no database needed
- **Cons**: Cannot revoke tokens, must wait for expiration
- **Risk**: Compromised token valid until expiry

**Alternative 2: Session Tokens (Database)**

- **Pros**: Full control, easy to revoke
- **Cons**: Database lookup on every request (slower)
- **Use Case**: Simple apps with low traffic

**Alternative 3: OAuth2 with External Provider**

- **Pros**: Offload complexity, proven security
- **Cons**: Vendor lock-in, less control
- **Use Case**: If you want Google/GitHub login

---

## 4. Auth Service vs. Monolithic API

### ✅ Recommended: **Separate Auth Service**

**Why Separate**:

1. **Security Isolation**: Auth logic isolated, easier to audit
2. **Independent Scaling**: Auth can scale separately from API
3. **Technology Choice**: Can use different security measures
4. **Blast Radius**: Compromise doesn't affect main API
5. **Clear Ownership**: Auth team owns auth service

**Service Responsibilities**:

**Auth Service** (Port 3002):

- POST `/auth/register` - Email registration
- POST `/auth/send-magic-link` - Send login email
- POST `/auth/verify-magic-link` - Verify token, return tokens
- POST `/auth/refresh` - Refresh access token
- POST `/auth/logout` - Revoke refresh token
- GET `/auth/me` - Get current user (for testing)

**API Server** (Port 3001):

- All business logic (plans, tasks, chat, etc.)
- Validates JWT from Auth Service
- No auth logic (delegates to Auth Service)

**Why NOT Monolithic** (but valid):

- If you want simplicity and have low traffic
- Fewer services to deploy and monitor
- Easier local development
- Valid for MVP phase, can split later

---

## 5. Token Storage & Security

### Access Token (JWT)

- **Storage**: Memory only (never localStorage)
- **Transport**: Authorization header: `Bearer <token>`
- **Expiry**: 15 minutes
- **Size**: ~200-300 bytes

### Refresh Token

- **Storage**: httpOnly cookie (cannot be accessed by JS)
- **Transport**: Automatic with requests to auth service
- **Expiry**: 7 days (configurable)
- **Database**: Store hash in `refresh_tokens` table

### Security Best Practices

```typescript
// Auth Service generates tokens
const accessToken = jwt.sign({ userId, email, type: "access" }, process.env.JWT_SECRET, {
  expiresIn: "15m",
  algorithm: "HS256",
});

const refreshToken = crypto.randomBytes(32).toString("hex");
await db.insert(refreshTokens).values({
  userId,
  tokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  device: req.headers["user-agent"],
});

// Set refresh token as httpOnly cookie
reply.setCookie("refresh_token", refreshToken, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60,
  path: "/auth/refresh",
});

return { accessToken };
```

---

## 6. Service Communication

### Frontend → API Server

```typescript
// Frontend sends JWT in header
const response = await fetch("http://api:3001/plans/generate", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ clientProfile }),
});
```

### API Server → Auth Service (Token Validation)

```typescript
// Option 1: JWT Validation (No Network Call)
// API server has public key, validates signature locally
const decoded = jwt.verify(token, publicKey);

// Option 2: Introspection Endpoint (Centralized)
// API calls auth service to validate token
const isValid = await authService.validateToken(token);
```

**Recommendation**: Use **Option 1 (JWT Validation)** for performance. Auth service signs with private key, API validates with public key (no network call needed).

---

## 7. Updated NX Workspace Structure

```
alva/
├── apps/
│   ├── web/                 # Next.js Frontend (Port 3000)
│   ├── api/                 # API Server - Fastify (Port 3001)
│   └── auth/                # Auth Service - Fastify (Port 3002)
├── libs/
│   ├── ui/                  # React components (web only)
│   ├── api-client/          # API client for web → api
│   ├── auth-client/         # Auth client for web → auth
│   ├── shared-types/        # Types shared across services
│   ├── validation/          # Zod schemas (shared)
│   ├── database/            # Database schemas, migrations
│   └── utils/               # Shared utilities
```

---

## 8. Technology Recommendations

### For Auth Service

- **Framework**: Fastify 4.x
- **JWT Library**: `jsonwebtoken` or `jose` (more modern)
- **Password Hashing**: `bcrypt` or `argon2` (Argon2 recommended)
- **Rate Limiting**: `@fastify/rate-limit`
- **Email**: Resend or SendGrid
- **Validation**: Fastify's built-in JSON Schema

### For API Server

- **Framework**: Fastify 4.x
- **ORM**: Drizzle (as planned)
- **Validation**: Zod + `fastify-type-provider-zod`
- **LLM**: OpenAI SDK
- **Jobs**: BullMQ
- **Redis**: ioredis

### For Next.js Web

- **Auth Client**: Custom hook using fetch/axios
- **State**: Zustand for auth state
- **Token Refresh**: Automatic on 401, refresh in background

---

## 9. Development Workflow

### Docker Compose (Local Dev)

```yaml
# docker-compose.yml
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    environment:
      - API_URL=http://api:3001
      - AUTH_URL=http://auth:3002

  api:
    build: ./apps/api
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgresql://...
      - AUTH_SERVICE_URL=http://auth:3002
      - JWT_PUBLIC_KEY=...

  auth:
    build: ./apps/auth
    ports: ["3002:3002"]
    environment:
      - DATABASE_URL=postgresql://...
      - JWT_PRIVATE_KEY=...
      - JWT_PUBLIC_KEY=...

  postgres:
    image: postgres:16

  redis:
    image: redis:7
```

---

## 10. Pros & Cons of Microservices Approach

### Pros ✅

- **Separation of Concerns**: Each service has single responsibility
- **Independent Scaling**: Scale auth vs API independently
- **Technology Flexibility**: Can use different frameworks per service
- **Security Isolation**: Auth breach doesn't compromise API
- **Independent Deployment**: Deploy services separately
- **Clear Boundaries**: Easier to understand and maintain

### Cons ⚠️

- **Operational Complexity**: More services to deploy and monitor
- **Network Latency**: Service-to-service calls add overhead
- **Development Overhead**: More boilerplate, more configs
- **Debugging**: Distributed tracing needed
- **Data Consistency**: Need to handle eventual consistency
- **Local Development**: Docker Compose required

### Recommended Approach

**For Alva**: ✅ **Separate Services is Good**

**Why**:

1. You're already planning Docker deployment
2. Auth is critical - isolation makes sense
3. API will be heavy (LLM calls) - should scale independently
4. Clear service boundaries align with your modules (PPC, Blog, etc.)
5. NX monorepo makes multi-app development smooth

---

## 11. Migration from Current Docs

### What Changes

**Remove**:

- ❌ NextAuth.js v5 (no longer using integrated auth)
- ❌ tRPC (requires sharing TS types, harder with separate services)
- ❌ Next.js API routes for business logic

**Add**:

- ✅ Fastify for auth service
- ✅ Fastify for API server
- ✅ REST API with OpenAPI/Swagger
- ✅ JWT authentication flow
- ✅ Custom auth client for web
- ✅ Service discovery/communication patterns

**Keep**:

- ✅ Next.js for web (frontend only)
- ✅ PostgreSQL + Drizzle
- ✅ Tailwind + Shadcn/UI
- ✅ OpenAI + Vercel AI SDK
- ✅ BullMQ + Redis
- ✅ Docker deployment

---

## 12. Recommended Final Stack

| Service           | Technology           | Purpose                         |
| ----------------- | -------------------- | ------------------------------- |
| **Web**           | Next.js 14           | Frontend, SSR, UI               |
| **API**           | Fastify 4.x          | Business logic, LLM, jobs       |
| **Auth**          | Fastify 4.x          | Authentication, user management |
| **Database**      | PostgreSQL 16        | Primary data store              |
| **ORM**           | Drizzle              | Type-safe queries               |
| **Cache/Jobs**    | Redis 7              | Sessions, cache, BullMQ         |
| **Auth Strategy** | JWT + Refresh Token  | Hybrid approach                 |
| **Validation**    | Zod                  | Shared schemas                  |
| **API Docs**      | OpenAPI/Swagger      | Auto-generated docs             |
| **Deployment**    | Docker + K8s/Railway | Containerized services          |

---

## 13. Implementation Recommendations

### Phase 1 Updates

1. Create `apps/auth` - Auth service with Fastify
2. Create `apps/api` - API server with Fastify
3. Update `apps/web` - Remove API routes, consume external APIs
4. Create `libs/shared-types` - Types used across services
5. Update Docker setup for 3 services

### Auth Service Implementation

```typescript
// apps/auth/src/routes/auth.routes.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function authRoutes(app: FastifyInstance) {
  // Register with email
  app.post(
    "/auth/register",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (req, reply) => {
      // Send magic link email
    }
  );

  // Verify magic link
  app.post(
    "/auth/verify",
    {
      schema: {
        body: z.object({
          token: z.string(),
        }),
      },
    },
    async (req, reply) => {
      // Validate token, return JWT + refresh token
    }
  );

  // Refresh access token
  app.post("/auth/refresh", async (req, reply) => {
    const refreshToken = req.cookies.refresh_token;
    // Validate refresh token, return new access token
  });
}
```

### API Server Auth Middleware

```typescript
// apps/api/src/middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.user = decoded; // Attach user to request
  } catch (err) {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
```

---

## 14. Questions to Finalize

Before I update all the docs, please confirm:

1. **Auth Service**: Separate service (Fastify) ✓ or include in API?
2. **API Framework**: Fastify ✓ or Express or NestJS?
3. **Auth Strategy**: Hybrid JWT + Refresh ✓ or pure JWT or sessions?
4. **Database**: Shared Postgres ✓ or separate DBs per service?
5. **Service Communication**: REST ✓ or keep tRPC (requires shared code) or GraphQL?

---

## 15. My Recommendation Summary

Based on your requirements and Alva's needs:

### ✅ **Separate Auth Service** (Fastify)

- Clean separation
- Security isolation
- Independent scaling
- Simpler than you think with Fastify

### ✅ **Separate API Server** (Fastify)

- Handle heavy LLM workloads
- Scale workers independently
- Business logic isolated from frontend

### ✅ **Hybrid JWT + Refresh Tokens**

- Best of both worlds (performance + security)
- Industry standard pattern
- Revocable when needed

### ✅ **Shared PostgreSQL** (Initially)

- Start simple with one database
- Use separate schemas per service
- Can split databases later if needed

### ✅ **REST APIs with OpenAPI**

- Since services are separate, REST makes sense
- OpenAPI docs auto-generated
- Standard, easy to consume from Next.js
- Can add tRPC later if you want type-safety

---

Once you confirm this approach, I'll update:

1. `tech-stack.md` - Replace NextAuth with Fastify + JWT auth
2. `project-rules.md` - Add service-specific structure
3. `user-flow.md` - Update auth flow to use separate service
4. All phase documents - Reflect new architecture
5. `README.md` - Update stack summary

Let me know if you want me to proceed with these recommendations, or if you'd like to adjust any of the choices!
