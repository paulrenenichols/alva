#!/bin/bash
# @fileoverview Script to securely set Resend API key in AWS Secrets Manager.
# This script should be run locally, never commit API keys to git.

set -e

PROFILE=${AWS_PROFILE:-AdministratorAccess-520297668839}
REGION=${AWS_REGION:-us-east-1}

echo "🔐 Setting Resend API Key in AWS Secrets Manager..."
echo ""

# Prompt for API key if not provided via environment variable
if [ -z "$RESEND_API_KEY" ]; then
  echo "Enter your Resend API key (or set RESEND_API_KEY environment variable):"
  read -s RESEND_API_KEY
  echo ""
fi

if [ -z "$RESEND_API_KEY" ]; then
  echo "❌ API key is required"
  exit 1
fi

# Set the secret
echo "Setting secret in AWS Secrets Manager..."
aws secretsmanager put-secret-value \
  --secret-id alva-staging-resend-api-key \
  --secret-string "$RESEND_API_KEY" \
  --region $REGION \
  --profile $PROFILE \
  && echo "✅ Resend API Key set successfully in AWS Secrets Manager" \
  || echo "❌ Failed to set Resend API Key"

echo ""
echo "🔒 The API key is now stored securely in AWS Secrets Manager"
echo "   It will be automatically available to ECS services via environment variables"

