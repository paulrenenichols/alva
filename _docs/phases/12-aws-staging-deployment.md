# Phase 12: AWS Staging Deployment

**@fileoverview** Implementation plan for AWS infrastructure setup and staging environment deployment.

---

## Overview

This phase implements:
1. **AWS infrastructure** using AWS CDK (TypeScript)
2. **Staging environment** setup
3. **CI/CD pipeline** for automated deployment via GitHub Actions
4. **ECS Fargate** container deployment
5. **Database and cache** (RDS + ElastiCache)
6. **DNS** (optional Route53 with cross-account support)

**Estimated Duration**: 1-2 weeks

**Builds On**: Phase 11 - requires shared email library and separated user tables

**Status**: ✅ **COMPLETED** - Infrastructure deployed using CDK, automated via GitHub Actions

---

## Current State

### ✅ Already Implemented

1. **Local Development**: MailHog, Docker Compose, all services running locally ✅
2. **Invite System**: Database schema, invite service, registration flow ✅
3. **Admin App**: Invite management interface ✅
4. **Email Service**: Centralized email library with Mailpit + Resend integration ✅

### ✅ What's Implemented

1. **AWS infrastructure**: CDK stacks deployed (Network, Database, Cache, ECS, ALB, DNS)
2. **Staging environment**: Fully deployed and operational
3. **CI/CD pipeline**: GitHub Actions workflow for automated deployment
4. **Database & cache**: RDS PostgreSQL and ElastiCache Redis operational
5. **DNS**: Optional DNS stack with cross-account Route53 support

---

## Implementation Summary

### Infrastructure as Code: AWS CDK

The infrastructure is implemented using **AWS CDK (Cloud Development Kit)** in TypeScript, not raw CloudFormation templates. This provides:
- Type-safe infrastructure definitions
- Better code reuse and modularity
- Automatic dependency management
- Easier testing and validation

#### Infrastructure Structure

```
infrastructure/
  ├── bin/
  │   └── infrastructure.ts    # CDK app entry point
  ├── lib/
  │   ├── stacks/
  │   │   ├── network-stack.ts   # VPC, subnets, security groups
  │   │   ├── database-stack.ts  # RDS PostgreSQL
  │   │   ├── cache-stack.ts     # ElastiCache Redis
  │   │   ├── secrets-stack.ts   # Secrets Manager
  │   │   ├── ecs-stack.ts       # ECS cluster and services
  │   │   ├── alb-stack.ts       # Application Load Balancer
  │   │   └── dns-stack.ts       # Route53 DNS (optional)
  │   └── config/
  │       └── services.ts       # Service definitions
  ├── cdk.json
  ├── package.json
  └── tsconfig.json
```

**Key Features**:
- ✅ All stacks deployed and operational
- ✅ Account ID auto-discovered from AWS credentials
- ✅ Cross-account DNS support for Route53
- ✅ Secrets Manager integration
- ✅ CloudWatch logging for all services

#### Network Stack

**File**: `infrastructure/lib/stacks/network-stack.ts`

The network stack creates:
- VPC with CIDR 10.0.0.0/16
- 2 Public subnets (us-east-1a, us-east-1b)
- 2 Private subnets with egress (us-east-1a, us-east-1b)
- NAT Gateway for private subnet internet access
- Security groups for ALB, ECS, RDS, and Redis

**Status**: ✅ Deployed

### Database & Cache

#### RDS PostgreSQL

**File**: `infrastructure/lib/stacks/database-stack.ts`

The database stack creates:
- RDS PostgreSQL 16 instance (db.t3.micro)
- Auto-generated credentials stored in Secrets Manager
- Database subnet group in private subnets
- Security group allowing access from ECS only

**Status**: ✅ Deployed

#### ElastiCache Redis

**File**: `infrastructure/lib/stacks/cache-stack.ts`

The cache stack creates:
- ElastiCache Redis cluster (cache.t3.micro)
- Subnet group in private subnets
- Security group allowing access from ECS only

**Status**: ✅ Deployed

### ECS & Load Balancer

#### ECS Stack

**File**: `infrastructure/lib/stacks/ecs-stack.ts`

The ECS stack creates:
- ECS Fargate cluster with Container Insights
- 4 task definitions (web, api, auth, admin)
- 4 ECS services with health checks
- CloudWatch logging for all services
- Environment variables from Secrets Manager

**Status**: ✅ Deployed

#### ALB Stack

**File**: `infrastructure/lib/stacks/alb-stack.ts`

The ALB stack creates:
- Application Load Balancer (internet-facing)
- 4 target groups (one per service)
- Listener with host-header routing (when domain configured)
- Health checks configured for all services

**Status**: ✅ Deployed

#### DNS Stack (Optional)

**File**: `infrastructure/lib/stacks/dns-stack.ts`

The DNS stack supports:
- Creating new Route53 hosted zone (if domain provided)
- Using existing hosted zone (cross-account support)
- Cross-account DNS via IAM role assumption

**Status**: ✅ Implemented (optional, enabled via environment variables)

---

## Deployment & CI/CD

### GitHub Actions Workflow

**File**: `.github/workflows/deploy-staging.yml`

The deployment workflow consists of three jobs:

1. **build-and-push-images**: Builds and pushes Docker images to ECR
   - Builds all 4 services (web, api, auth, admin)
   - Tags images with `latest` and commit SHA
   - Uses Docker Buildx with caching

2. **deploy-infrastructure**: Deploys CDK stacks
   - Installs CDK CLI and dependencies
   - Auto-discovers AWS account ID from credentials
   - Runs `cdk deploy --all` to deploy all stacks

3. **update-services**: Forces ECS service updates
   - Triggers new deployments for all services
   - Waits for services to stabilize

**Status**: ✅ Operational

**Trigger**: Pushes to `staging` branch or manual workflow dispatch

### Manual Deployment

For local deployments, use CDK directly:

```bash
cd infrastructure
npm install
npm run build

# Get AWS account ID from credentials
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION=us-east-1

# Deploy all stacks
cdk deploy --all

# Or deploy specific stack
cdk deploy alva-staging-network
```

**Account Discovery**: CDK automatically discovers AWS account ID from:
- AWS CLI credentials (default profile)
- AWS SSO session
- Environment variables (`CDK_DEFAULT_ACCOUNT`, `AWS_ACCOUNT_ID`)

See `infrastructure/README.md` for detailed deployment instructions.

---

## Implementation Checklist

### Infrastructure ✅

- [x] Create CDK stacks (Network, Database, Cache, ECS, ALB, DNS)
- [x] Set up VPC and networking
- [x] Configure RDS for PostgreSQL
- [x] Configure ElastiCache for Redis
- [x] Set up ECS cluster with 4 services
- [x] Create Application Load Balancer
- [x] Implement DNS stack with cross-account support

### Deployment ✅

- [x] Create GitHub Actions workflow
- [x] Configure GitHub secrets (AWS credentials)
- [x] Set up automated Docker builds
- [x] Configure CDK deployment
- [x] Deploy to staging
- [x] Verify staging environment

---

## Success Criteria

✅ **AWS infrastructure deployed**
- Staging environment live
- All services running on ECS
- Database and cache accessible
- Load balancer configured

✅ **CI/CD pipeline working**
- Staging branch triggers deployment
- Automated builds and deploys
- Health checks passing
- Rollback mechanism in place

✅ **Services accessible**
- Web app accessible at staging URL
- API service responding
- Auth service working
- Email delivery functional

✅ **Monitoring & logging**
- CloudWatch logs configured
- Error tracking set up
- Performance monitoring active
- Alerts configured

---

## Next Steps

After Phase 12 completion:
- Move to Phase 13: Critical User Flow Completion
- Implement chat functionality
- Complete email verification flow
- Enhance task management

