#!/bin/bash
# @fileoverview Build and push Docker images to ECR for all Alva services.

set -e

PROFILE=${AWS_PROFILE:-AdministratorAccess-520297668839}
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
  echo "🏗️  Building alva-${service}..."
  docker build \
    -t ${ECR_REGISTRY}/alva-${service}:latest \
    -f apps/${service}/Dockerfile \
    .
  
  echo "📤 Pushing alva-${service} to ECR..."
  docker push ${ECR_REGISTRY}/alva-${service}:latest
  
  echo "✅ alva-${service} pushed successfully"
  echo ""
done

echo "🎉 All images built and pushed to ECR!"
echo ""
echo "ECS services will now be able to pull and start containers."
echo ""

