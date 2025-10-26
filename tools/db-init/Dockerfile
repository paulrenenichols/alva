FROM node:20-alpine

# Install netcat for port checking
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Install pnpm and dependencies
RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Make init script executable
RUN chmod +x tools/scripts/db-init.sh
RUN chmod +x tools/scripts/db-init.ts

# Run database initialization
CMD ["tsx", "tools/scripts/db-init.ts"]

