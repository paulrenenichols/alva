#!/bin/bash

set -e

# Wait for PostgreSQL to be ready (max 30 seconds)
echo "Waiting for PostgreSQL to be ready..."
timeout=30
counter=0

while ! nc -z postgres 5432; do
  sleep 1
  counter=$((counter+1))
  if [ $counter -ge $timeout ]; then
    echo "PostgreSQL not ready after $timeout seconds"
    exit 1
  fi
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
pnpm db:migrate

# Seed the database
echo "Seeding database..."
pnpm seed:all

echo "✅ Database initialization complete!"

