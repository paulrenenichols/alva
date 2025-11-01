# Phase 9: Docker Compose Local Development Optimization

**@fileoverview** Phase 9 implementation for optimizing local development with separate production and development Docker Compose configurations, including hot reload capabilities.

---

## Overview

This phase implements:
1. **Separate Docker Compose configurations** for production and development
2. **Hot reload Dockerfiles** for each application service
3. **Development-focused package.json scripts** for local workflow
4. **Optimized build processes** for faster iteration

**Estimated Duration**: 1 week

**Builds On**: Phase 8 - requires completed invite system and working local development environment

---

## Current State

### ✅ Already Implemented

1. **Docker Compose Setup**: Single `docker-compose.yml` for all services ✅
2. **Production Dockerfiles**: Existing Dockerfiles for web, api, auth, and admin apps ✅
3. **Local Development**: All services running in containers ✅
4. **Package Scripts**: Basic docker scripts in package.json ✅

### ❌ What's Missing

1. **Development-focused Docker Compose**: No separate dev configuration
2. **Hot Reload Support**: Dockerfiles don't support hot reload/rebuild on code changes
3. **Development Dockerfiles**: No dev-specific Dockerfiles with volume mounts
4. **Script Organization**: Package scripts mix production and development concerns

---

## Goals

### 1. Separate Production and Development Configurations

- **`docker-compose.yml`**: Production-focused build
  - Optimized, multi-stage builds
  - Minimal image sizes
  - No volume mounts
  - Production-ready configuration

- **`docker-compose.dev.yml`**: Development-focused build
  - Hot reload enabled
  - Volume mounts for live code changes
  - Development tooling included
  - Faster iteration cycles

### 2. Dual Dockerfile Strategy

Each application (web, api, auth, admin) will have:
- **`Dockerfile`**: Production-optimized build
- **`Dockerfile.dev`**: Development build with hot reload

### 3. Updated Package Scripts

Package.json scripts will be organized around development workflow:
- Default scripts target development environment
- Production scripts explicitly marked
- Clear separation between dev and prod operations

---

## Implementation Plan

### Day 1-2: Create Development Dockerfiles

#### Web App Development Dockerfile

**File**: `apps/web/Dockerfile.dev`

- Node.js base image
- Volume mounts for source code
- Development dependencies included
- Next.js dev server with hot reload
- Watch mode for file changes

#### API Service Development Dockerfile

**File**: `apps/api/Dockerfile.dev`

- Node.js base image
- Volume mounts for source code
- Development dependencies included
- Nodemon or similar for auto-restart
- Source maps enabled
- Debug port exposed

#### Auth Service Development Dockerfile

**File**: `apps/auth/Dockerfile.dev`

- Node.js base image
- Volume mounts for source code
- Development dependencies included
- Auto-restart on file changes
- Debug capabilities

#### Admin App Development Dockerfile

**File**: `apps/admin/Dockerfile.dev`

- Node.js base image
- Volume mounts for source code
- Development dependencies included
- Next.js dev server with hot reload

### Day 3: Create docker-compose.dev.yml

**File**: `docker-compose.dev.yml`

- Override or extend base docker-compose.yml
- Use `Dockerfile.dev` for all application services
- Volume mounts for live code reload
- Development environment variables
- Additional debugging tools (if needed)

### Day 4: Update docker-compose.yml for Production

**File**: `docker-compose.yml`

- Ensure production-optimized builds
- Remove development tooling
- Optimize for production deployment
- Security best practices

### Day 5: Update Package.json Scripts

**File**: `package.json`

- Default docker scripts target dev environment
- Clear naming convention (dev: vs prod:)
- Update existing scripts to use docker-compose.dev.yml
- Add production-specific scripts

---

## Technical Details

### Development Dockerfile Pattern

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Mount source code as volume (handled by docker-compose)
# No COPY of source code - uses volume mount instead

# Expose ports
EXPOSE <APP_PORT>

# Development command (hot reload)
CMD ["pnpm", "nx", "serve", "<app-name>"]
```

### Development Docker Compose Pattern

```yaml
services:
  web-dev:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    volumes:
      - ./apps/web:/app/apps/web
      - ./libs:/app/libs
      - /app/node_modules
    environment:
      - NODE_ENV=development
    ports:
      - '3000:3000'
```

### Package.json Script Updates

- `docker:dev` → Uses docker-compose.dev.yml
- `docker:up` → Development environment by default
- `docker:prod` → Production environment explicitly
- `docker:dev:build` → Build dev containers
- `docker:prod:build` → Build production containers

---

## Success Criteria

✅ **Separate configurations**
- docker-compose.yml optimized for production
- docker-compose.dev.yml optimized for development
- Clear separation of concerns

✅ **Hot reload working**
- Code changes trigger automatic rebuilds
- Fast iteration cycles
- No manual container restarts needed

✅ **Scripts updated**
- Development scripts default to dev environment
- Production scripts explicitly marked
- Clear, intuitive naming

✅ **All services support dev mode**
- Web app hot reloads
- API service auto-restarts
- Auth service auto-restarts
- Admin app hot reloads

---

## Files to Create

1. `apps/web/Dockerfile.dev`
2. `apps/api/Dockerfile.dev`
3. `apps/auth/Dockerfile.dev`
4. `apps/admin/Dockerfile.dev`
5. `docker-compose.dev.yml`

## Files to Modify

1. `docker-compose.yml` (ensure production optimization)
2. `package.json` (update docker scripts)

---

## Next Steps

After Phase 9 completion:
- Move to Phase 10: AWS Staging Deployment
- Use production docker-compose.yml for staging/production deployments
- Continue using docker-compose.dev.yml for local development

