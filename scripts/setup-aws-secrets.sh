#!/bin/bash
# @fileoverview Script to generate JWT keys and populate AWS Secrets Manager for staging deployment.

set -e

echo "🔐 Setting up AWS Secrets Manager for Alva staging..."

# Get AWS account and region
ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}
REGION=${AWS_REGION:-us-east-1}
PROFILE=${AWS_PROFILE:-AdministratorAccess-520297668839}

echo "Account: $ACCOUNT_ID"
echo "Region: $REGION"
echo ""

# Generate JWT keys (or use existing from local .env)
echo "🔑 Extracting JWT keys from local .env or generating new ones..."

if [ -f .env ] && grep -q "JWT_PRIVATE_KEY=" .env && grep -q "JWT_PUBLIC_KEY=" .env; then
  echo "   Using existing keys from .env file..."
  JWT_PRIVATE_KEY=$(grep "^JWT_PRIVATE_KEY=" .env | cut -d'=' -f2-)
  JWT_PUBLIC_KEY=$(grep "^JWT_PUBLIC_KEY=" .env | cut -d'=' -f2-)
  
  if [ -z "$JWT_PRIVATE_KEY" ] || [ -z "$JWT_PUBLIC_KEY" ]; then
    echo "   Keys found but empty, generating new ones..."
    JWT_OUTPUT=$(pnpm run generate:keys 2>&1)
    JWT_PRIVATE_KEY=$(echo "$JWT_OUTPUT" | grep "^JWT_PRIVATE_KEY=" | cut -d'=' -f2-)
    JWT_PUBLIC_KEY=$(echo "$JWT_OUTPUT" | grep "^JWT_PUBLIC_KEY=" | cut -d'=' -f2-)
  fi
else
  echo "   No keys found in .env, generating new ones..."
  JWT_OUTPUT=$(pnpm run generate:keys 2>&1)
  JWT_PRIVATE_KEY=$(echo "$JWT_OUTPUT" | grep "^JWT_PRIVATE_KEY=" | cut -d'=' -f2-)
  JWT_PUBLIC_KEY=$(echo "$JWT_OUTPUT" | grep "^JWT_PUBLIC_KEY=" | cut -d'=' -f2-)
fi

if [ -z "$JWT_PRIVATE_KEY" ] || [ -z "$JWT_PUBLIC_KEY" ]; then
  echo "❌ Failed to extract/generate JWT keys"
  exit 1
fi

echo "✅ JWT keys ready"

# Generate cookie secret
COOKIE_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

echo "✅ Cookie secret and JWT secret generated"
echo ""

# Secrets to set (prompt for API keys, with defaults)
echo "📝 Please provide the following API keys:"
read -p "OpenAI API Key: " OPENAI_API_KEY

# Use provided Resend API key (default from environment or hardcoded)
RESEND_API_KEY=${RESEND_API_KEY:-"re_3figf35c_C6FcBzwbpiiRxHXN1hhALavx"}
echo "📧 Using Resend API Key: ${RESEND_API_KEY:0:10}..." # Show first 10 chars for verification

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  Warning: OpenAI API key is empty. You can set it later."
fi

echo ""
echo "🔐 Setting secrets in AWS Secrets Manager..."

# Set JWT Private Key
aws secretsmanager put-secret-value \
  --secret-id alva-staging-jwt-private-key \
  --secret-string "$JWT_PRIVATE_KEY" \
  --region $REGION \
  --profile $PROFILE \
  && echo "✅ JWT Private Key set" || echo "❌ Failed to set JWT Private Key"

# Set JWT Public Key
aws secretsmanager put-secret-value \
  --secret-id alva-staging-jwt-public-key \
  --secret-string "$JWT_PUBLIC_KEY" \
  --region $REGION \
  --profile $PROFILE \
  && echo "✅ JWT Public Key set" || echo "❌ Failed to set JWT Public Key"

# Set JWT Secret
aws secretsmanager put-secret-value \
  --secret-id alva-staging-jwt-secret \
  --secret-string "$JWT_SECRET" \
  --region $REGION \
  --profile $PROFILE \
  && echo "✅ JWT Secret set" || echo "❌ Failed to set JWT Secret"

# Set Cookie Secret
aws secretsmanager put-secret-value \
  --secret-id alva-staging-cookie-secret \
  --secret-string "$COOKIE_SECRET" \
  --region $REGION \
  --profile $PROFILE \
  && echo "✅ Cookie Secret set" || echo "❌ Failed to set Cookie Secret"

# Set OpenAI API Key
if [ -n "$OPENAI_API_KEY" ]; then
  aws secretsmanager put-secret-value \
    --secret-id alva-staging-openai-api-key \
    --secret-string "$OPENAI_API_KEY" \
    --region $REGION \
    --profile $PROFILE \
    && echo "✅ OpenAI API Key set" || echo "❌ Failed to set OpenAI API Key"
fi

# Set Resend API Key
if [ -n "$RESEND_API_KEY" ]; then
  aws secretsmanager put-secret-value \
    --secret-id alva-staging-resend-api-key \
    --secret-string "$RESEND_API_KEY" \
    --region $REGION \
    --profile $PROFILE \
    && echo "✅ Resend API Key set" || echo "❌ Failed to set Resend API Key"
fi

echo ""
echo "✅ All secrets configured!"
echo ""
echo "📋 Secret ARNs:"
aws secretsmanager list-secrets \
  --region $REGION \
  --profile $PROFILE \
  --filters Key=name,Values=alva-staging \
  --query 'SecretList[].{Name:Name,ARN:ARN}' \
  --output table

