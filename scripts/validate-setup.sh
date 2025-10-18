#!/bin/bash

# Setup Validation Script
# Validates that all services are properly configured and running

set -e

echo "🔍 Validating Alva setup..."

# Check if required files exist
echo "📁 Checking required files..."
required_files=(
    "package.json"
    "docker-compose.yml"
    ".env.example"
    "apps/web/Dockerfile"
    "apps/api/Dockerfile"
    "apps/auth/Dockerfile"
    "libs/database/src/client.ts"
    "tools/scripts/generate-keys.ts"
    "tools/scripts/init-db.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        exit 1
    fi
done

# Check if .env exists
if [ -f .env ]; then
    echo "  ✅ .env file exists"
else
    echo "  ⚠️  .env file missing (run: cp .env.example .env)"
fi

# Check if Docker is running
echo "🐳 Checking Docker..."
if docker info > /dev/null 2>&1; then
    echo "  ✅ Docker is running"
else
    echo "  ❌ Docker is not running"
    exit 1
fi

# Check if services are running
echo "🔌 Checking services..."

# Check PostgreSQL
if docker compose ps postgres | grep -q "Up"; then
    echo "  ✅ PostgreSQL is running"
else
    echo "  ⚠️  PostgreSQL is not running (run: pnpm run docker:up)"
fi

# Check Redis
if docker compose ps redis | grep -q "Up"; then
    echo "  ✅ Redis is running"
else
    echo "  ⚠️  Redis is not running (run: pnpm run docker:up)"
fi

# Test service endpoints
echo "🌐 Testing service endpoints..."

# Test Auth service
if curl -s http://localhost:3002/health > /dev/null; then
    echo "  ✅ Auth service (port 3002) is responding"
else
    echo "  ⚠️  Auth service (port 3002) is not responding"
fi

# Test API service
if curl -s http://localhost:3001/health > /dev/null; then
    echo "  ✅ API service (port 3001) is responding"
else
    echo "  ⚠️  API service (port 3001) is not responding"
fi

# Test Web service
if curl -s http://localhost:3000 > /dev/null; then
    echo "  ✅ Web service (port 3000) is responding"
else
    echo "  ⚠️  Web service (port 3000) is not responding"
fi

echo ""
echo "🎉 Setup validation complete!"
echo ""
echo "If any services are not running:"
echo "  pnpm run docker:up    # Start infrastructure"
echo "  pnpm run db:init      # Initialize database"
echo "  pnpm run dev          # Start all services"
