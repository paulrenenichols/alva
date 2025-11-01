# Phase 9 Implementation Plan: Docker Compose Local Development Optimization

**@fileoverview** Detailed implementation plan for Phase 9 - optimizing Docker Compose setup for local development with hot reload capabilities and separate production/development configurations.

---

## Implementation Overview

**Goal**: Create a seamless local development experience with hot reload while maintaining production-ready Docker configurations.

**Duration**: 1 week (5 days)

**Success Criteria**:
- ✅ Separate docker-compose.yml (production) and docker-compose.dev.yml (development)
- ✅ Development Dockerfiles (Dockerfile.dev) for all apps with hot reload
- ✅ Updated package.json scripts focused on development workflow
- ✅ Code changes trigger automatic rebuilds without manual container restarts
- ✅ Fast iteration cycles for all services (web, api, auth, admin)

**Builds On**: Phase 8 - requires completed invite system and working local development environment

---

## Day 1: Web & Admin App Development Dockerfiles

### Task 1.1: Create apps/web/Dockerfile.dev

**Objective**: Create development Dockerfile for Next.js web app with hot reload

**File**: `apps/web/Dockerfile.dev`

**Key Features**:
- Node.js 20 Alpine base image
- Development dependencies included
- Volume mount support (source code mounted externally)
- Next.js dev server with hot reload
- Watch mode enabled

**Implementation**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Source code will be mounted as volume in docker-compose.dev.yml
# No COPY of source - handled by volume mount

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Run Next.js dev server with hot reload
CMD ["pnpm", "nx", "serve", "web"]
```

**Tasks**:
- [ ] Create Dockerfile.dev in apps/web directory
- [ ] Test build locally
- [ ] Verify hot reload functionality

### Task 1.2: Create apps/admin/Dockerfile.dev

**Objective**: Create development Dockerfile for Next.js admin app with hot reload

**File**: `apps/admin/Dockerfile.dev`

**Key Features**:
- Same pattern as web app
- Admin-specific port (3003)
- Next.js dev server configuration

**Implementation**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Source code will be mounted as volume in docker-compose.dev.yml

ENV NODE_ENV=development
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

EXPOSE 3003

# Run Next.js dev server with hot reload
CMD ["pnpm", "nx", "serve", "admin"]
```

**Tasks**:
- [ ] Create Dockerfile.dev in apps/admin directory
- [ ] Test build locally
- [ ] Verify hot reload functionality

---

## Day 2: API & Auth Service Development Dockerfiles

### Task 2.1: Create apps/api/Dockerfile.dev

**Objective**: Create development Dockerfile for API service with auto-restart

**File**: `apps/api/Dockerfile.dev`

**Key Features**:
- Node.js 20 Alpine base image
- Development dependencies included
- Volume mount support
- Auto-restart on file changes (using nodemon or tsx watch)
- Source maps enabled for debugging
- Debug port exposed

**Implementation**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Install nodemon globally for auto-restart (or use tsx watch)
RUN npm install -g nodemon

# Source code will be mounted as volume in docker-compose.dev.yml

ENV NODE_ENV=development

EXPOSE 3001
EXPOSE 9229  # Debug port

# Run API with nodemon for auto-restart on file changes
CMD ["pnpm", "nx", "serve", "api"]
```

**Alternative Approach** (if using tsx directly):
```dockerfile
# Use tsx watch mode if supported by nx serve
CMD ["pnpm", "nx", "serve", "api", "--watch"]
```

**Tasks**:
- [ ] Create Dockerfile.dev in apps/api directory
- [ ] Configure auto-restart mechanism
- [ ] Test build and verify auto-restart on code changes
- [ ] Verify source maps work correctly

### Task 2.2: Create apps/auth/Dockerfile.dev

**Objective**: Create development Dockerfile for Auth service with auto-restart

**File**: `apps/auth/Dockerfile.dev`

**Key Features**:
- Same pattern as API service
- Auth-specific port (3002)
- Auto-restart capabilities

**Implementation**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Install nodemon globally for auto-restart
RUN npm install -g nodemon

# Source code will be mounted as volume in docker-compose.dev.yml

ENV NODE_ENV=development

EXPOSE 3002
EXPOSE 9229  # Debug port

# Run Auth service with auto-restart on file changes
CMD ["pnpm", "nx", "serve", "auth"]
```

**Tasks**:
- [ ] Create Dockerfile.dev in apps/auth directory
- [ ] Test build and verify auto-restart on code changes
- [ ] Verify debugging capabilities

---

## Day 3: Create docker-compose.dev.yml

### Task 3.1: Design Development Compose Configuration

**Objective**: Create development-focused docker-compose configuration

**File**: `docker-compose.dev.yml`

**Key Features**:
- Extends base services (postgres, redis, mailpit) from docker-compose.yml
- Overrides application services to use Dockerfile.dev
- Volume mounts for live code reload
- Development environment variables
- Optimized for fast iteration

**Implementation Structure**:
```yaml
services:
  # Inherit base services from docker-compose.yml (postgres, redis, mailpit, db-init)
  # Override application services with dev configuration

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    volumes:
      - ./apps/web:/app/apps/web
      - ./libs:/app/libs
      - ./package.json:/app/package.json
      - ./pnpm-lock.yaml:/app/pnpm-lock.yaml
      - ./nx.json:/app/nx.json
      - ./tsconfig.base.json:/app/tsconfig.base.json
      - /app/node_modules
      - /app/dist
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_AUTH_URL=http://localhost:3002
      - NODE_ENV=development
    depends_on:
      - api
      - auth
    networks:
      - alva-network

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile.dev
    volumes:
      - ./apps/api:/app/apps/api
      - ./libs:/app/libs
      - ./package.json:/app/package.json
      - ./pnpm-lock.yaml:/app/pnpm-lock.yaml
      - ./nx.json:/app/nx.json
      - ./tsconfig.base.json:/app/tsconfig.base.json
      - /app/node_modules
      - /app/dist
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - REDIS_URL=redis://redis:6379
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=development
      - CORS_ORIGINS=http://localhost:3000,http://localhost:3003
    depends_on:
      db-init:
        condition: service_completed_successfully
      redis:
        condition: service_healthy
    networks:
      - alva-network

  auth:
    build:
      context: .
      dockerfile: apps/auth/Dockerfile.dev
    volumes:
      - ./apps/auth:/app/apps/auth
      - ./libs:/app/libs
      - ./package.json:/app/package.json
      - ./pnpm-lock.yaml:/app/pnpm-lock.yaml
      - ./nx.json:/app/nx.json
      - ./tsconfig.base.json:/app/tsconfig.base.json
      - /app/node_modules
      - /app/dist
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - NODE_ENV=development
      - CORS_ORIGINS=http://localhost:3000,http://localhost:3003
    depends_on:
      db-init:
        condition: service_completed_successfully
    networks:
      - alva-network

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile.dev
    volumes:
      - ./apps/admin:/app/apps/admin
      - ./libs:/app/libs
      - ./package.json:/app/package.json
      - ./pnpm-lock.yaml:/app/pnpm-lock.yaml
      - ./nx.json:/app/nx.json
      - ./tsconfig.base.json:/app/tsconfig.base.json
      - /app/node_modules
      - /app/dist
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_AUTH_URL=http://localhost:3002
      - NODE_ENV=development
    depends_on:
      - api
      - auth
    networks:
      - alva-network
```

**Tasks**:
- [ ] Create docker-compose.dev.yml file
- [ ] Configure volume mounts for all application services
- [ ] Set up proper dependency chains
- [ ] Test service startup
- [ ] Verify volume mounts work correctly
- [ ] Test code changes trigger rebuilds

---

## Day 4: Update docker-compose.yml for Production

### Task 4.1: Optimize Production Configuration

**Objective**: Ensure docker-compose.yml is optimized for production use

**File**: `docker-compose.yml`

**Review Checklist**:
- [ ] All services use production Dockerfiles (not .dev)
- [ ] No volume mounts for source code
- [ ] Production environment variables
- [ ] Security best practices
- [ ] Optimized build processes
- [ ] Minimal image sizes
- [ ] Proper health checks
- [ ] Resource limits (if needed)

**Tasks**:
- [ ] Review current docker-compose.yml
- [ ] Ensure all builds use production Dockerfiles
- [ ] Remove any development-specific configurations
- [ ] Verify production optimizations are in place
- [ ] Document production-specific settings

---

## Day 5: Update Package.json Scripts

### Task 5.1: Reorganize Docker Scripts

**Objective**: Update package.json scripts to focus on development workflow

**File**: `package.json`

**Script Organization**:

**Development Scripts** (default - use docker-compose.dev.yml):
- `docker:dev` → `docker compose -f docker-compose.dev.yml up`
- `docker:dev:build` → `docker compose -f docker-compose.dev.yml build`
- `docker:dev:down` → `docker compose -f docker-compose.dev.yml down`
- `docker:dev:logs` → `docker compose -f docker-compose.dev.yml logs -f`
- `docker:dev:restart` → `docker compose -f docker-compose.dev.yml restart`

**Production Scripts** (explicit - use docker-compose.yml):
- `docker:prod` → `docker compose up`
- `docker:prod:build` → `docker compose build`
- `docker:prod:down` → `docker compose down`
- `docker:prod:logs` → `docker compose logs -f`

**Legacy Scripts** (update to use dev):
- `docker:up` → Alias to `docker:dev`
- `docker:down` → Alias to `docker:dev:down`
- `docker:logs` → Alias to `docker:dev:logs`
- `docker:build` → Alias to `docker:dev:build`
- `docker:restart` → Alias to `docker:dev:restart`

**Convenience Scripts**:
- `dev` → `pnpm docker:dev` (main development command)
- `docker:services` → Start only infrastructure (postgres, redis, mailpit)

**Implementation**:
```json
{
  "scripts": {
    "dev": "pnpm docker:dev",
    "docker:dev": "docker compose -f docker-compose.dev.yml up",
    "docker:dev:build": "docker compose -f docker-compose.dev.yml build",
    "docker:dev:down": "docker compose -f docker-compose.dev.yml down",
    "docker:dev:logs": "docker compose -f docker-compose.dev.yml logs -f",
    "docker:dev:restart": "docker compose -f docker-compose.dev.yml restart",
    "docker:prod": "docker compose up",
    "docker:prod:build": "docker compose build",
    "docker:prod:down": "docker compose down",
    "docker:prod:logs": "docker compose logs -f",
    "docker:up": "pnpm docker:dev",
    "docker:down": "pnpm docker:dev:down",
    "docker:logs": "pnpm docker:dev:logs",
    "docker:build": "pnpm docker:dev:build",
    "docker:restart": "pnpm docker:dev:restart",
    "docker:services": "docker compose -f docker-compose.dev.yml up postgres redis mailpit -d"
  }
}
```

**Tasks**:
- [ ] Update package.json scripts
- [ ] Test all development scripts
- [ ] Test all production scripts
- [ ] Update documentation if needed
- [ ] Verify backward compatibility (legacy scripts)

---

## Testing Checklist

### Development Environment Testing

- [ ] All services start successfully with docker-compose.dev.yml
- [ ] Code changes in apps/web trigger hot reload
- [ ] Code changes in apps/admin trigger hot reload
- [ ] Code changes in apps/api trigger auto-restart
- [ ] Code changes in apps/auth trigger auto-restart
- [ ] Volume mounts work correctly (no permission issues)
- [ ] Node modules are properly cached (not overwritten by volume mounts)
- [ ] Build output (dist) is properly handled
- [ ] All environment variables are correctly set
- [ ] Service dependencies work (api/auth for web/admin)
- [ ] Database initialization runs correctly
- [ ] Network connectivity works between services

### Production Environment Testing

- [ ] All services build successfully with docker-compose.yml
- [ ] Production builds are optimized (smaller images)
- [ ] No development dependencies in production images
- [ ] All services start correctly
- [ ] Production environment variables work
- [ ] Health checks pass

### Script Testing

- [ ] `pnpm dev` starts development environment
- [ ] All `docker:dev:*` scripts work correctly
- [ ] All `docker:prod:*` scripts work correctly
- [ ] Legacy scripts still work (backward compatibility)
- [ ] `docker:services` starts only infrastructure

---

## Documentation Updates

### Files to Update/Create

1. **README.md**
   - Document new development workflow
   - Explain docker-compose.dev.yml usage
   - Update getting started instructions

2. **docker-compose.dev.yml**
   - Add comments explaining volume mounts
   - Document any special configurations

3. **Development Dockerfiles**
   - Add comments explaining development-specific settings
   - Document hot reload mechanisms

---

## Success Metrics

### Development Experience

- ✅ Code changes trigger rebuilds within 2-5 seconds
- ✅ No manual container restarts needed during development
- ✅ Fast iteration cycles (edit → save → see changes)
- ✅ All services support hot reload/auto-restart

### Build Performance

- ✅ Development builds are faster (no production optimizations)
- ✅ Production builds remain optimized
- ✅ Clear separation between dev and prod configurations

### Developer Workflow

- ✅ Single command to start development (`pnpm dev`)
- ✅ Clear, intuitive script names
- ✅ Backward compatibility maintained

---

## Risk Mitigation

### Potential Issues

1. **Volume Mount Performance**
   - **Risk**: Slow file system on some platforms (especially Windows)
   - **Mitigation**: Use Docker's optimized volume mounts, consider WSL2 on Windows

2. **Node Modules Conflicts**
   - **Risk**: Volume mounts might conflict with node_modules
   - **Mitigation**: Use anonymous volumes for node_modules (`/app/node_modules`)

3. **Build Output Conflicts**
   - **Risk**: dist directory conflicts between host and container
   - **Mitigation**: Use anonymous volumes or ensure proper .dockerignore

4. **Hot Reload Not Working**
   - **Risk**: File watching might not work in Docker
   - **Mitigation**: Configure proper polling for file changes, test thoroughly

5. **Port Conflicts**
   - **Risk**: Ports already in use on host machine
   - **Mitigation**: Clear error messages, document port requirements

---

## Phase 9 Deliverables

1. ✅ **Development Dockerfiles**
   - apps/web/Dockerfile.dev
   - apps/admin/Dockerfile.dev
   - apps/api/Dockerfile.dev
   - apps/auth/Dockerfile.dev

2. ✅ **Development Docker Compose**
   - docker-compose.dev.yml with hot reload support

3. ✅ **Production Docker Compose**
   - docker-compose.yml optimized for production

4. ✅ **Updated Scripts**
   - Development-focused package.json scripts
   - Clear dev/prod separation
   - Backward compatible legacy scripts

5. ✅ **Documentation**
   - Updated README with new workflow
   - Comments in configuration files

---

## Next Steps

After Phase 9 completion:
- Move to Phase 10: AWS Staging Deployment
- Use production docker-compose.yml as reference for staging/production deployments
- Continue using docker-compose.dev.yml for all local development

