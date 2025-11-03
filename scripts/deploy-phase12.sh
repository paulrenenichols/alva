#!/bin/bash
# @fileoverview Complete Phase 12 deployment script - deploys infrastructure and sets up secrets.

set -e

PROFILE=${AWS_PROFILE:-default}
REGION=${AWS_REGION:-us-east-1}

echo "🚀 Phase 12 Deployment Script"
echo "================================"
echo ""

# Step 1: Deploy CDK Infrastructure
echo "Step 1: Deploying CDK Infrastructure..."
cd infrastructure

ACCOUNT_ID=$(aws sts get-caller-identity --profile $PROFILE --query Account --output text)
export CDK_DEFAULT_ACCOUNT=$ACCOUNT_ID
export CDK_DEFAULT_REGION=$REGION

echo "Account: $ACCOUNT_ID"
echo "Region: $REGION"
echo ""

cdk deploy --all --require-approval never --profile $PROFILE

echo ""
echo "✅ Infrastructure deployed!"
echo ""

# Step 2: Generate and set secrets
cd ..
echo "Step 2: Setting up secrets..."
echo "⚠️  This will prompt for API keys (OpenAI and Resend)"
echo ""

./scripts/setup-aws-secrets.sh

echo ""
echo "✅ Secrets configured!"
echo ""

# Step 3: Get deployment outputs
echo "Step 3: Retrieving deployment information..."
cd infrastructure

ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name alva-staging-alb \
  --profile $PROFILE \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text 2>/dev/null || echo "Not available yet")

DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name alva-staging-database \
  --profile $PROFILE \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
  --output text 2>/dev/null || echo "Not available yet")

REDIS_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name alva-staging-cache \
  --profile $PROFILE \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`RedisEndpoint`].OutputValue' \
  --output text 2>/dev/null || echo "Not available yet")

echo ""
echo "📋 Deployment Information:"
echo "================================"
echo "Application Load Balancer: http://$ALB_DNS"
echo "Database Endpoint: $DB_ENDPOINT"
echo "Redis Endpoint: $REDIS_ENDPOINT"
echo ""
echo "✅ Phase 12 deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Build and push Docker images to ECR"
echo "2. ECS services will pull images automatically"
echo "3. Test endpoints at: http://$ALB_DNS"

