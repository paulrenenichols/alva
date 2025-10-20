#!/bin/bash

set -e

echo "🚀 Deploying Alva to production..."

# Check environment variables
required_vars=("DATABASE_URL" "JWT_PRIVATE_KEY" "JWT_PUBLIC_KEY" "OPENAI_API_KEY" "RESEND_API_KEY")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done

# Run database migrations
echo "📊 Running database migrations..."
pnpm db:migrate

# Start services
echo "🐳 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check health
echo "🏥 Checking service health..."
curl -f http://localhost:3000/api/health || exit 1
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3002/health || exit 1

echo "✅ Deployment successful!"
echo "🌐 Web: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo "🔐 Auth: http://localhost:3002"
