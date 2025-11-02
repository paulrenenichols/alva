#!/bin/bash
# @fileoverview Script to rotate JWT keys after security exposure in public repository.

set -e

echo "🔐 JWT Key Rotation Script"
echo "=========================="
echo ""
echo "⚠️  This script will update local .env files with newly generated JWT keys."
echo "   The old keys were exposed in git history and must be replaced."
echo ""

# Generate new keys
echo "1️⃣ Generating new JWT key pair..."
JWT_OUTPUT=$(pnpm run generate:keys 2>&1)

# Extract keys from output
JWT_PRIVATE_KEY=$(echo "$JWT_OUTPUT" | grep -A 100 "BEGIN PRIVATE KEY" | grep -B 100 "END PRIVATE KEY" | tr '\n' '\\n' | sed 's/\\n$//')
JWT_PUBLIC_KEY=$(echo "$JWT_OUTPUT" | grep -A 50 "BEGIN PUBLIC KEY" | grep -B 50 "END PUBLIC KEY" | tr '\n' '\\n' | sed 's/\\n$//')

# Extract formatted keys for .env files
JWT_PRIVATE_KEY_ENV=$(echo "$JWT_OUTPUT" | grep "^JWT_PRIVATE_KEY=" | cut -d'=' -f2-)
JWT_PUBLIC_KEY_ENV=$(echo "$JWT_OUTPUT" | grep "^JWT_PUBLIC_KEY=" | cut -d'=' -f2-)

if [ -z "$JWT_PRIVATE_KEY_ENV" ] || [ -z "$JWT_PUBLIC_KEY_ENV" ]; then
  echo "❌ Failed to extract keys from output"
  exit 1
fi

echo "✅ New keys generated"
echo ""

# Update root .env file
if [ -f .env ]; then
  echo "2️⃣ Updating root .env file..."
  if grep -q "JWT_PRIVATE_KEY=" .env; then
    sed -i.bak "s|JWT_PRIVATE_KEY=.*|JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY_ENV|" .env
    sed -i.bak "s|JWT_PUBLIC_KEY=.*|JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY_ENV|" .env
    rm -f .env.bak
    echo "✅ Root .env updated"
  else
    echo "⚠️  JWT keys not found in root .env, adding them..."
    echo "JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY_ENV" >> .env
    echo "JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY_ENV" >> .env
    echo "✅ Keys added to root .env"
  fi
else
  echo "⚠️  Root .env file not found (will be created on next setup)"
fi

# Update app-specific .env files
echo ""
echo "3️⃣ Updating app-specific .env files..."

# API service
if [ -f apps/api/.env ]; then
  if grep -q "JWT_PUBLIC_KEY=" apps/api/.env; then
    sed -i.bak "s|JWT_PUBLIC_KEY=.*|JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY_ENV|" apps/api/.env
    rm -f apps/api/.env.bak
    echo "✅ apps/api/.env updated"
  fi
else
  echo "⚠️  apps/api/.env not found (will be created when needed)"
fi

# Auth service
if [ -f apps/auth/.env ]; then
  if grep -q "JWT_PRIVATE_KEY=" apps/auth/.env; then
    sed -i.bak "s|JWT_PRIVATE_KEY=.*|JWT_PRIVATE_KEY=$JWT_PRIVATE_KEY_ENV|" apps/auth/.env
    sed -i.bak "s|JWT_PUBLIC_KEY=.*|JWT_PUBLIC_KEY=$JWT_PUBLIC_KEY_ENV|" apps/auth/.env
    rm -f apps/auth/.env.bak
    echo "✅ apps/auth/.env updated"
  fi
else
  echo "⚠️  apps/auth/.env not found (will be created when needed)"
fi

echo ""
echo "✅ JWT key rotation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. ✅ Local .env files updated"
echo "2. ⏳ Update AWS Secrets Manager (run: ./scripts/setup-aws-secrets.sh)"
echo "3. ⚠️  Invalidate existing JWT tokens (users will need to log in again)"
echo "4. 🔄 Restart all services to use new keys"
echo ""
echo "⚠️  IMPORTANT: All existing authentication tokens are now invalid!"
echo "   Users will need to log in again after services are restarted."
echo ""

