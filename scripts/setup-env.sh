#!/bin/bash

# Environment Setup Script
# Generates .env files for all services

set -e

echo "🔧 Setting up environment files..."

# Create .env from .env.example if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Generate JWT keys if not already done
if grep -q "your-jwt-public-key-here" .env; then
    echo "🔑 Generating JWT keys..."
    pnpm run generate:keys
    echo "✅ JWT keys generated. Please update your .env file with the generated keys."
else
    echo "✅ JWT keys already configured."
fi

# Create service-specific .env files
echo "📁 Creating service-specific environment files..."

# Web service .env.local
if [ ! -f apps/web/.env.local ]; then
    cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
EOF
    echo "✅ Created apps/web/.env.local"
fi

# API service .env
if [ ! -f apps/api/.env ]; then
    cat > apps/api/.env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alva
REDIS_URL=redis://localhost:6380
JWT_PUBLIC_KEY=your-jwt-public-key-here
OPENAI_API_KEY=your-openai-api-key-here
EOF
    echo "✅ Created apps/api/.env"
fi

# Auth service .env
if [ ! -f apps/auth/.env ]; then
    cat > apps/auth/.env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/alva
JWT_PRIVATE_KEY=your-jwt-private-key-here
JWT_PUBLIC_KEY=your-jwt-public-key-here
COOKIE_SECRET=your-cookie-secret-here
EOF
    echo "✅ Created apps/auth/.env"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Update service-specific .env files with your keys"
echo "3. Run: pnpm run dev"
