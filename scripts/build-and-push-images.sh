#!/bin/bash
# @fileoverview Build and push Docker images to ECR for all Alva services.

set -e

PROFILE=${AWS_PROFILE:-default}
REGION=${AWS_REGION:-us-east-1}

echo "🐳 Building and pushing Docker images to ECR..."
echo ""

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --profile $PROFILE --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "Account: $ACCOUNT_ID"
echo "Region: $REGION"
echo "ECR Registry: $ECR_REGISTRY"
echo ""

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --profile $PROFILE --region $REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

echo "✅ Logged into ECR"
echo ""

# Services to build
SERVICES=("web" "api" "auth" "admin")

for service in "${SERVICES[@]}"; do
  echo "🏗️  Building alva-${service} for linux/amd64 (ECS Fargate architecture)..."
  
  # Build args for Next.js apps (admin, web)
  BUILD_ARGS=""
  if [ "$service" == "admin" ] || [ "$service" == "web" ]; then
    # Use environment variables if set, otherwise use defaults based on STAGING_DOMAIN
    STAGING_DOMAIN=${STAGING_DOMAIN:-staging.alva.paulrenenichols.com}
    
    if [ "$service" == "admin" ]; then
      AUTH_URL=${NEXT_PUBLIC_AUTH_URL:-http://auth.${STAGING_DOMAIN}}
      API_URL=${NEXT_PUBLIC_API_URL:-http://api.${STAGING_DOMAIN}}
      BUILD_ARGS="--build-arg NEXT_PUBLIC_AUTH_URL=${AUTH_URL} --build-arg NEXT_PUBLIC_API_URL=${API_URL}"
    elif [ "$service" == "web" ]; then
      AUTH_URL=${NEXT_PUBLIC_AUTH_URL:-http://auth.${STAGING_DOMAIN}}
      API_URL=${NEXT_PUBLIC_API_URL:-http://api.${STAGING_DOMAIN}}
      BUILD_ARGS="--build-arg NEXT_PUBLIC_AUTH_URL=${AUTH_URL} --build-arg NEXT_PUBLIC_API_URL=${API_URL}"
    fi
  fi
  
  docker buildx build \
    --platform linux/amd64 \
    -t ${ECR_REGISTRY}/alva-${service}:latest \
    -f apps/${service}/Dockerfile \
    ${BUILD_ARGS} \
    --push \
    .
  
  echo "✅ alva-${service} built and pushed successfully"
  echo ""
done

echo "🎉 All images built and pushed to ECR!"
echo ""
echo "ECS services will now be able to pull and start containers."
echo ""

