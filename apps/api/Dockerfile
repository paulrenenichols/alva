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
# Build shared libraries first, then the API service with all dependencies
RUN corepack enable pnpm && pnpm nx reset && pnpm nx build database shared-types validation utils api --configuration=production --skip-nx-cache

# Verify the build output exists and show structure
RUN echo "Checking build output..." && \
    ls -la /app/dist/ || echo "dist directory not found" && \
    ls -la /app/dist/apps/ 2>/dev/null || echo "dist/apps not found" && \
    ls -la /app/dist/apps/api/ 2>/dev/null || echo "dist/apps/api not found" && \
    find /app/dist -name "main.js" -type f 2>/dev/null | head -5 || echo "No main.js files found"

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist/apps/api ./dist
COPY --from=builder --chown=nodejs:nodejs /app/dist/libs ./dist/libs
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Generate runtime package.json with module aliases
COPY tools/scripts/generate-runtime-package.json.js ./tools/scripts/
RUN node tools/scripts/generate-runtime-package.json.js

USER nodejs

EXPOSE 3001

CMD ["node", "dist/main.js"]
