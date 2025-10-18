#!/bin/bash

# Alva Development Script
# Starts all services in the correct order

set -e

echo "🚀 Starting Alva Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

echo "📦 Starting infrastructure services..."
pnpm run docker:up

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️  Initializing database schemas..."
pnpm run db:init

echo "🔑 Checking JWT keys..."
if grep -q "your-jwt-public-key-here" .env; then
    echo "⚠️  Please generate JWT keys with: pnpm run generate:keys"
    echo "   Then update your .env file with the generated keys."
fi

echo "🎉 Development environment is ready!"
echo ""
echo "Access your applications:"
echo "  Web:    http://localhost:3000"
echo "  API:    http://localhost:3001"
echo "  Auth:   http://localhost:3002"
echo "  API Docs: http://localhost:3001/docs"
echo ""
echo "To stop all services: pnpm run docker:down"
echo "To view logs: pnpm run docker:logs"
