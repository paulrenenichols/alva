# Alva Infrastructure (AWS CDK)

**@fileoverview** CDK infrastructure for Alva staging and production deployments on AWS.

---

## Overview

This directory contains the AWS CDK (Cloud Development Kit) code for deploying Alva's infrastructure:

- **Network**: VPC, subnets, NAT Gateway, security groups
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Compute**: ECS Fargate cluster with 4 microservices
- **Load Balancing**: Application Load Balancer
- **Secrets**: AWS Secrets Manager

---

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured (or SSO)
3. **Node.js** 20+ and npm
4. **AWS CDK CLI**: `npm install -g aws-cdk`

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd infrastructure
npm install
```

### 2. Configure AWS Credentials

CDK will automatically use your AWS CLI credentials or SSO session.

**Option A: AWS CLI Profile**
```bash
aws configure --profile alva-admin
# Or use SSO: aws sso login --profile AdministratorAccess-520297668839
```

**Option B: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-1
```

### 3. Bootstrap CDK (First Time Only)

CDK needs to bootstrap resources in your AWS account:

```bash
# Get your AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Bootstrap
cdk bootstrap aws://$ACCOUNT_ID/us-east-1
```

### 4. Build and Synthesize

```bash
npm run build
cdk synth
```

### 5. Deploy

```bash
# Deploy all stacks
cdk deploy --all

# Or deploy specific stack
cdk deploy alva-staging-network
```

---

## How CDK Gets Account Information

CDK automatically discovers your AWS account ID and region through:

1. **AWS CLI Credentials** (default profile)
2. **AWS SSO Session** (if using SSO)
3. **Environment Variables**:
   - `CDK_DEFAULT_ACCOUNT` - AWS Account ID
   - `CDK_DEFAULT_REGION` - AWS Region
   - `AWS_ACCOUNT_ID` - Alternative account ID variable
   - `AWS_REGION` - Alternative region variable

**In our code** (`bin/infrastructure.ts`):
```typescript
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};
```

---

## GitHub CI/CD Deployment

### How It Works

1. **Authentication**: GitHub Actions uses the `alva-cicd-user` credentials stored in GitHub Secrets
2. **Account Discovery**: CDK gets the account ID from the authenticated AWS session:
   ```bash
   aws sts get-caller-identity --query Account --output text
   ```
3. **Environment Variables**: Set automatically by GitHub Actions workflow:
   - `CDK_DEFAULT_ACCOUNT` - From AWS credentials
   - `CDK_DEFAULT_REGION` - `us-east-1`
4. **Deployment**: CDK deploys all stacks in dependency order

### Workflow Steps

1. **Build & Push Images**: Builds Docker images and pushes to ECR
2. **Deploy Infrastructure**: 
   - Installs CDK dependencies
   - Gets AWS Account ID from credentials
   - Sets environment variables
   - Runs `cdk deploy --all`
3. **Update Services**: Forces new ECS deployments to use updated images

### GitHub Secrets Required

These are already configured:
- `AWS_ACCESS_KEY_ID` - Access key for `alva-cicd-user`
- `AWS_SECRET_ACCESS_KEY` - Secret key for `alva-cicd-user`
- `AWS_REGION` - `us-east-1`
- `AWS_ACCOUNT_ID` - (Optional) Account ID

---

## Stack Dependencies

Stacks are deployed in this order:

1. **Network Stack** - VPC, subnets, security groups
2. **Secrets Stack** - Application secrets (manually populated)
3. **Database Stack** - RDS PostgreSQL (creates its own secret)
4. **Cache Stack** - ElastiCache Redis
5. **ECS Stack** - Cluster, task definitions, services
6. **ALB Stack** - Load balancer, target groups, routing

---

## Project Structure

```
infrastructure/
├── bin/
│   └── infrastructure.ts      # CDK app entry point
├── lib/
│   ├── config/
│   │   └── services.ts        # Service definitions
│   └── stacks/
│       ├── network-stack.ts   # VPC, networking
│       ├── secrets-stack.ts   # Secrets Manager
│       ├── database-stack.ts  # RDS PostgreSQL
│       ├── cache-stack.ts     # ElastiCache Redis
│       ├── ecs-stack.ts       # ECS cluster & services
│       └── alb-stack.ts       # Application Load Balancer
├── cdk.json                   # CDK configuration
├── package.json
└── tsconfig.json
```

---

## Useful Commands

```bash
# Build TypeScript
npm run build

# Watch for changes
npm run watch

# Run tests
npm test

# Synthesize CloudFormation templates
cdk synth

# Show differences
cdk diff

# Deploy all stacks
cdk deploy --all

# Deploy specific stack
cdk deploy alva-staging-network

# List all stacks
cdk list

# Destroy stack (⚠️ be careful)
cdk destroy alva-staging-network
```

---

## Secrets Management

### Database Secret
- **Auto-generated** by RDS
- Stored in Secrets Manager
- Accessible via `databaseStack.databaseSecret`

### Application Secrets (Manual Setup)
After deploying, populate these secrets in AWS Secrets Manager:

1. **JWT Private Key**: `alva-staging-jwt-private-key`
2. **JWT Public Key**: `alva-staging-jwt-public-key`
3. **JWT Secret**: `alva-staging-jwt-secret`
4. **Cookie Secret**: `alva-staging-cookie-secret`
5. **OpenAI API Key**: `alva-staging-openai-api-key`
6. **Resend API Key**: `alva-staging-resend-api-key`

**Set secret value:**
```bash
aws secretsmanager put-secret-value \
  --secret-id alva-staging-jwt-secret \
  --secret-string "your-secret-value" \
  --region us-east-1
```

---

## Cost Estimates

**Staging Environment**: ~$136-190/month
- ECS Fargate: ~$40-82
- RDS PostgreSQL: ~$18
- ElastiCache Redis: ~$14
- Application Load Balancer: ~$16-28
- NAT Gateway: ~$33
- Other: ~$15

See `_docs/phases/phase-12-tech-decisions/12-cost-breakdown-details.md` for details.

---

## Troubleshooting

### CDK Can't Find Account/Region

**Error**: `Need to perform AWS calls for account X, but no credentials have been configured`

**Solution**:
1. Verify AWS CLI credentials: `aws sts get-caller-identity`
2. Set environment variables: `export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)`
3. Use profile: `cdk deploy --profile your-profile`

### Bootstrap Required

**Error**: `This stack uses assets, so the toolkit stack must be deployed to the environment`

**Solution**: Run `cdk bootstrap aws://ACCOUNT-ID/REGION`

### ECS Services Failing

1. Check CloudWatch logs: `/ecs/alva-staging`
2. Verify secrets are populated in Secrets Manager
3. Check security group rules
4. Verify ECR images exist and are accessible

---

## Next Steps

1. Deploy infrastructure stacks
2. Populate application secrets
3. Verify all services are running
4. Test service connectivity
5. Monitor CloudWatch logs

---

## References

- **CDK Documentation**: https://docs.aws.amazon.com/cdk/
- **Implementation Plan**: `_docs/phase-plans/12-phase-12-aws-staging-deployment-plan.md`
- **Technical Decisions**: `_docs/phases/phase-12-tech-decisions/`
