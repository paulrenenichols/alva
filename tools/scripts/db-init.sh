#!/bin/sh

set -e

echo "Starting database initialization..."

# Wait for PostgreSQL by attempting connection
echo "Checking PostgreSQL connection..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  # Try to connect using psql (in postgres container)
  if nc -z "$POSTGRES_HOST" "${POSTGRES_PORT:-5432}" 2>/dev/null || 
     echo "SELECT 1" | psql "$DATABASE_URL" >/dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  
  attempt=$((attempt+1))
  echo "Waiting for PostgreSQL... ($attempt/$max_attempts)"
  sleep 1
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ PostgreSQL not ready after $max_attempts attempts"
  exit 1
fi

# Run migrations
echo "Running database migrations..."
pnpm db:migrate

# Seed the database
echo "Seeding database..."
pnpm seed:all

echo "✅ Database initialization complete!"
