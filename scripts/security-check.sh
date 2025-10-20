#!/bin/bash

echo "🔒 Running security checks..."

# Check for exposed secrets
echo "Checking for exposed secrets..."
if grep -r "password\|secret\|key" --include="*.ts" --include="*.tsx" --include="*.js" apps/ libs/ | grep -v "process.env"; then
  echo "❌ Potential secrets found in code"
  exit 1
fi

# Check for vulnerable dependencies
echo "Checking for vulnerable dependencies..."
npm audit --audit-level=moderate

# Check environment variables
echo "Checking environment configuration..."
if [ ! -f ".env.production" ]; then
  echo "❌ Production environment file missing"
  exit 1
fi

echo "✅ Security checks passed"
