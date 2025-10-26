# Database Initialization in Docker

**@fileoverview** Documentation for automatic database migrations and seeding in Docker Compose.

---

## Overview

The `docker-compose.yml` now includes a `db-init` service that automatically runs database migrations and seeds initial data when starting the environment.

---

## How It Works

### Startup Flow

1. **PostgreSQL starts** and becomes healthy
2. **db-init service** starts after PostgreSQL is ready
3. **db-init** runs:
   - Waits for PostgreSQL to accept connections
   - Runs `pnpm db:migrate` to apply migrations
   - Runs `pnpm seed:all` to seed roles and admin users
4. **API and Auth services** wait for db-init to complete successfully
5. **All services start** with a ready database

### Service Dependencies

```
postgres (healthy)
  ↓
db-init (completed)
  ↓
api, auth (started)
  ↓
web, admin (started)
```

---

## Usage

### First Time Setup

```bash
# Start all services (db-init runs automatically)
docker compose up

# Or start in detached mode
docker compose up -d
```

### Viewing Database Init Logs

```bash
# View db-init logs
docker compose logs db-init

# Follow logs in real-time
docker compose logs -f db-init
```

### Re-running Migrations

If you need to re-run migrations without restarting everything:

```bash
# Rebuild and restart just the db-init service
docker compose up --build db-init

# Or run migrations manually
docker compose exec postgres psql -U postgres -d alva
# Then run: \d to see tables
```

---

## Files

### `tools/scripts/db-init.sh`
Bash script that:
- Waits for PostgreSQL to be ready (using netcat)
- Runs database migrations
- Seeds initial data (roles and admin users)
- Exits with error code if any step fails

### `tools/db-init/Dockerfile`
Minimal Docker image:
- Based on `node:20-alpine`
- Installs netcat for port checking
- Installs pnpm and project dependencies
- Runs the initialization script

### `docker-compose.yml`
Updated to include:
- `db-init` service definition
- API and Auth services now depend on `db-init` completion
- Proper network configuration

---

## Environment Variables

The db-init service uses:
- `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/alva`

Set in docker-compose, no additional configuration needed.

---

## Manual Override

If you want to skip automatic initialization:

```bash
# Start services without db-init
docker compose up postgres redis mailhog

# Then manually initialize
docker compose run --rm db-init
```

---

## Troubleshooting

### Database Not Ready
If db-init fails, check PostgreSQL logs:
```bash
docker compose logs postgres
```

### Migrations Failed
Check migration files:
```bash
docker compose logs db-init
```

### Seed Scripts Failed
Verify seed scripts:
```bash
docker compose exec db-init pnpm seed:all
```

---

## Benefits

✅ **Automatic Setup** - Database ready on first startup  
✅ **Idempotent** - Safe to run multiple times  
✅ **Fast Failures** - Services don't start if DB init fails  
✅ **Easy Debugging** - View logs to see what happened  
✅ **No Manual Steps** - Just `docker compose up`

