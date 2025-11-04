# Phase 12: AWS Staging Deployment - Implementation Plan

**@fileoverview** Detailed implementation plan for deploying Alva to AWS staging environment using CDK, ECS Fargate, RDS, and ElastiCache.

---

## Overview

**Goal**: Deploy all 4 Alva services (web, api, auth, admin) to AWS staging environment with automated CI/CD pipeline.

**Duration**: 2 weeks

**Deliverable**: Fully functional staging environment accessible via ALB DNS name or custom domain, with automated deployment from GitHub.

**Status**: ✅ **COMPLETED** - Infrastructure deployed using AWS CDK, automated via GitHub Actions

---

## Architecture Summary

### Decisions Made ✅

1. **Infrastructure**: AWS CDK (TypeScript) ✅ **Implemented**
2. **Container Registry**: Amazon ECR ✅ **Implemented**
3. **Routing**: Host-header based (subdomain routing when domain configured)
4. **Database**: RDS PostgreSQL (db.t3.micro, Single AZ) ✅ **Deployed**
5. **Cache**: ElastiCache Redis (cache.t3.micro) for BullMQ ✅ **Deployed**
6. **Domain**: Optional DNS stack with cross-account Route53 support ✅ **Implemented**
7. **SSL**: ACM (can add later)
8. **Admin Portal**: Public initially (security deferred)
9. **Email Service**: Resend (configured, EmailClient auto-selects in production)
10. **Account Discovery**: Auto-discovered from AWS credentials (no hardcoded IDs) ✅ **Implemented**

### Services to Deploy

1. **web** (Next.js) - Port 3000
2. **api** (Fastify) - Port 3001  
3. **auth** (Fastify) - Port 3002
4. **admin** (Next.js) - Port 3003

### Infrastructure Components

- VPC with public/private subnets (2 AZs)
- NAT Gateway (for private subnet internet access)
- ECS Cluster (Fargate)
- Application Load Balancer
- RDS PostgreSQL (db.t3.micro)
- ElastiCache Redis (cache.t3.micro)
- ECR repositories (4 repos)
- Secrets Manager (credentials, JWT keys, API keys)
- CloudWatch Logs (all services)

---

## Week 1: Infrastructure Setup

### Day 1: AWS Account & Project Setup

**Tasks:**

- [ ] **Verify AWS account** for staging
  - Ensure you have AWS account access
  - Note your AWS Account ID (will need for CDK bootstrap)
  ```bash
  aws sts get-caller-identity --query Account --output text
  ```

- [ ] **Create IAM user for CI/CD** (`alva-cicd-user`)
  
  This user will be used by GitHub Actions for automated deployments.
  
  ```bash
  # Create the IAM user
  aws iam create-user --user-name alva-cicd-user
  
  # Attach PowerUserAccess policy (sufficient for staging)
  aws iam attach-user-policy \
    --user-name alva-cicd-user \
    --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
  
  # Create access keys (SAVE THESE - you'll need them for GitHub Secrets)
  aws iam create-access-key --user-name alva-cicd-user
  ```
  
  **Important**: Save the output securely:
  - `AccessKeyId`: `AKIA...` → Will be `AWS_ACCESS_KEY_ID` in GitHub
  - `SecretAccessKey`: `...` → Will be `AWS_SECRET_ACCESS_KEY` in GitHub
  
  **Security Note**: These credentials will be stored in GitHub Secrets. Never commit them to git.
  
  **Alternative**: If you want more restrictive permissions, see `_docs/phases/phase-12-tech-decisions/12-aws-iam-setup.md` for custom policy creation.

- [ ] **Set up AWS CLI locally** (for manual deployments)
  
  You'll use this for local CDK development and manual deployments.
  
  ```bash
  # Option A: Use default profile (if you already have one configured)
  aws configure
  # AWS Access Key ID: [your existing IAM user key]
  # AWS Secret Access Key: [your existing IAM user secret]
  # Default region: us-east-1
  # Default output format: json
  
  # Option B: Use named profile for Alva (recommended)
  aws configure --profile alva-admin
  # AWS Access Key ID: [your admin user key or reuse existing]
  # AWS Secret Access Key: [your admin user secret]
  # Default region: us-east-1
  # Default output format: json
  ```
  
  **Note**: You can use your existing IAM user for local CDK deployments, or create a separate admin user. The CI/CD user should be separate. See `_docs/phases/phase-12-tech-decisions/12-aws-iam-setup.md` for details.

- [x] **Bootstrap CDK** (required once per account/region) ✅ **Completed**
  
  CDK needs to set up resources for managing deployments.
  
  ```bash
  # Get your AWS Account ID (auto-discovered from credentials)
  aws sts get-caller-identity --query Account --output text
  
  # Bootstrap CDK (run once per account/region)
  cd infrastructure
  npm install -g aws-cdk
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  cdk bootstrap aws://${ACCOUNT_ID}/us-east-1
  ```
  
  **Note**: 
  - Account ID is automatically discovered from AWS credentials
  - Requires permissions to create S3 buckets and IAM roles
  - Run once per AWS account/region combination
  - Creates S3 bucket for CDK assets and IAM roles for deployments

- [ ] **Initialize CDK project**
  ```bash
  mkdir -p infrastructure
  cd infrastructure
  cdk init app --language typescript
  npm install aws-cdk-lib constructs
  ```

- [ ] **Set up CDK project structure**
  ```
  infrastructure/
  ├── lib/
  │   ├── stacks/
  │   │   ├── network-stack.ts
  │   │   ├── database-stack.ts
  │   │   ├── cache-stack.ts
  │   │   ├── ecs-stack.ts
  │   │   ├── alb-stack.ts
  │   │   └── secrets-stack.ts
  │   ├── constructs/
  │   │   └── ecs-service-construct.ts
  │   └── config/
  │       └── services.ts
  ├── bin/
  │   └── app.ts
  ├── cdk.json
  ├── package.json
  └── tsconfig.json
  ```

- [x] **Create ECR repositories** ✅ **Completed**
  
  These will store Docker images for each service.
  
  ```bash
  # Get AWS Account ID (auto-discovered from credentials)
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  REGION=us-east-1
  
  # Create repositories
  aws ecr create-repository \
    --repository-name alva-web \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true
  
  aws ecr create-repository \
    --repository-name alva-api \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true
  
  aws ecr create-repository \
    --repository-name alva-auth \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true
  
  aws ecr create-repository \
    --repository-name alva-admin \
    --region $REGION \
    --image-scanning-configuration scanOnPush=true
  
  # Verify repositories created
  aws ecr describe-repositories --region $REGION --query 'repositories[].repositoryName'
  ```
  
  **Note**: 
  - Account ID is automatically discovered from AWS credentials
  - `scanOnPush=true` enables automatic vulnerability scanning (free)
  - Repositories are created manually or can be managed via CDK

- [ ] **Configure GitHub secrets**
  
  Add the CI/CD user credentials to GitHub Secrets for automated deployments.
  
  **In GitHub**: Repository → Settings → Secrets and variables → Actions → New repository secret
  
  Add these secrets:
  - `AWS_ACCESS_KEY_ID` = Access key from `alva-cicd-user`
  - `AWS_SECRET_ACCESS_KEY` = Secret key from `alva-cicd-user`
  - `AWS_REGION` = `us-east-1`
  
  **Optional** (auto-detected in GitHub Actions, but can set explicitly):
  - `ECR_REGISTRY` = `YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com`
    (Account ID is auto-discovered from AWS credentials in the workflow)
  
  **Security**: 
  - Never commit these values to git
  - Rotate keys every 90 days
  - Delete keys if compromised

**Deliverable**: 
- ✅ IAM user `alva-cicd-user` created with access keys
- ✅ CDK project initialized
- ✅ ECR repositories created (4 repos)
- ✅ GitHub secrets configured
- ✅ CDK bootstrapped

---

### Day 2-3: Network Infrastructure (CDK)

**Create Network Stack** (`lib/stacks/network-stack.ts`)

**Components:**

- [ ] **VPC**
  - CIDR: 10.0.0.0/16
  - 2 Availability Zones
  - Enable DNS hostnames and support

- [ ] **Public Subnets** (2)
  - us-east-1a: 10.0.1.0/24
  - us-east-1b: 10.0.2.0/24
  - Map public IP on launch

- [ ] **Private Subnets** (2)
  - us-east-1a: 10.0.10.0/24
  - us-east-1b: 10.0.11.0/24
  - For ECS, RDS, Redis

- [ ] **Internet Gateway**
  - Attached to VPC
  - Route table for public subnets

- [ ] **NAT Gateway**
  - In public subnet (us-east-1a)
  - Route table for private subnets
  - Elastic IP address

- [ ] **Security Groups**
  - ALB SG: Allow 80, 443 from internet
  - ECS SG: Allow from ALB SG only
  - RDS SG: Allow PostgreSQL (5432) from ECS SG only
  - Redis SG: Allow Redis (6379) from ECS SG only

**CDK Code Structure:**

```typescript
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly ecsSecurityGroup: ec2.SecurityGroup;
  public readonly rdsSecurityGroup: ec2.SecurityGroup;
  public readonly redisSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create VPC
    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });

    // Create security groups...
  }
}
```

**Deliverable**: Network infrastructure deployed, security groups configured, VPC connectivity tested.

---

### Day 4-5: Database & Cache (CDK)

**Create Database Stack** (`lib/stacks/database-stack.ts`)

- [ ] **RDS PostgreSQL Instance**
  - Engine: PostgreSQL 16
  - Instance: db.t3.micro
  - Storage: 20GB gp2
  - Single AZ (for staging)
  - Backup retention: 7 days
  - Credentials: Generated secret in Secrets Manager
  - Subnet group: Private subnets
  - Security group: Allow from ECS only

**Create Cache Stack** (`lib/stacks/cache-stack.ts`)

- [ ] **ElastiCache Redis Cluster**
  - Engine: Redis 7
  - Node type: cache.t3.micro
  - Single node (no replication for staging)
  - Subnet group: Private subnets
  - Security group: Allow from ECS only

**Create Secrets Stack** (`lib/stacks/secrets-stack.ts`)

- [ ] **Database Credentials**
  - Auto-generate password
  - Store username/password in Secrets Manager

- [ ] **JWT Keys** (manual setup)
  - `JWT_PRIVATE_KEY`
  - `JWT_PUBLIC_KEY`
  - `JWT_SECRET`

- [ ] **API Keys** (manual setup)
  - `OPENAI_API_KEY`
  - `RESEND_API_KEY`

- [ ] **Cookie Secret** (manual setup)
  - `COOKIE_SECRET`

**CDK Code Structure:**

```typescript
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class DatabaseStack extends Stack {
  public readonly database: rds.DatabaseInstance;
  public readonly databaseSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Database subnet group
    const subnetGroup = new rds.SubnetGroup(this, 'DBSubnetGroup', {
      vpc: props.vpc,
      description: 'Subnet group for Alva database',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    // Generate database credentials
    this.databaseSecret = new secretsmanager.Secret(this, 'DBSecret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'alva_admin' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
      },
    });

    // RDS instance
    this.database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      databaseName: 'alva',
      credentials: rds.Credentials.fromSecret(this.databaseSecret),
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      backupRetention: Duration.days(7),
      deletionProtection: false,
      multiAz: false,
      subnetGroup,
      securityGroups: [props.rdsSecurityGroup],
    });
  }
}
```

**Deliverable**: RDS and ElastiCache deployed, Secrets Manager configured, connectivity tested.

---

## Week 2: ECS Services & Deployment

### Day 1-2: ECS Infrastructure (CDK)

**Create ECS Stack** (`lib/stacks/ecs-stack.ts`)

- [ ] **ECS Cluster**
  - Fargate capacity providers
  - CloudWatch Container Insights

- [ ] **Reusable ECS Service Construct**
  - Task definition creation
  - Service creation
  - Target group registration
  - CloudWatch logging

- [ ] **4 Task Definitions**
  - web (Next.js)
  - api (Fastify)
  - auth (Fastify)
  - admin (Next.js)
  - Migration task definition

- [ ] **4 ECS Services**
  - Desired count: 1 each (can scale later)
  - Health checks configured
  - Environment variables from Secrets Manager

**CDK Code Structure:**

```typescript
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcsStack extends Stack {
  public readonly cluster: ecs.Cluster;
  public readonly services: Map<string, ecs.FargateService>;

  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    // ECS Cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: props.vpc,
      containerInsights: true,
    });

    // Service configurations
    const services = [
      { name: 'web', port: 3000, cpu: 512, memory: 1024 },
      { name: 'api', port: 3001, cpu: 512, memory: 1024 },
      { name: 'auth', port: 3002, cpu: 512, memory: 1024 },
      { name: 'admin', port: 3003, cpu: 512, memory: 1024 },
    ];

    // Create services...
  }
}
```

**Deliverable**: ECS cluster and services created, task definitions configured.

---

### Day 3: Load Balancer & DNS (CDK)

**Create ALB Stack** (`lib/stacks/alb-stack.ts`) ✅ **Implemented**

- [x] **Application Load Balancer**
  - Internet-facing
  - Public subnets
  - Security group: Allow 80, 443

- [x] **Target Groups** (4 groups)
  - Health check: `/health` endpoint
  - Protocol: HTTP
  - Port: Service-specific (3000, 3001, 3002, 3003)

- [x] **Listener Rules**
  - Host-header based routing (when domain configured):
    - `staging.alva.paulrenenichols.com` → web service
    - `api.staging.alva.paulrenenichols.com` → api service
    - `auth.staging.alva.paulrenenichols.com` → auth service
    - `admin.staging.alva.paulrenenichols.com` → admin service
  - Fallback to ALB DNS name if no domain configured

- [ ] **SSL Certificate** (optional, can add later)
  - ACM certificate
  - HTTPS listener

**Create DNS Stack** (`lib/stacks/dns-stack.ts`) ✅ **Implemented**

- [x] **Optional Route53 Hosted Zone**
  - Creates new hosted zone if domain provided and no existing zone ID
  - Uses existing hosted zone if `HOSTED_ZONE_ID` environment variable set
  - Supports cross-account DNS via IAM role assumption

- [x] **Cross-Account DNS Support**
  - Configure via environment variables:
    - `STAGING_DOMAIN`: Domain name (e.g., `staging.alva.paulrenenichols.com`)
    - `HOSTED_ZONE_ID`: Existing hosted zone ID (optional)
    - `HOSTED_ZONE_ACCOUNT_ID`: Management account ID (for cross-account)
    - `CROSS_ACCOUNT_DNS_ROLE_ARN`: IAM role ARN (for cross-account)

**Deliverable**: ✅ ALB and DNS stacks deployed, routing configured.

---

### Day 4: CI/CD Pipeline ✅ **Implemented**

**GitHub Actions Workflow** (`.github/workflows/deploy-staging.yml`) ✅ **Operational**

The deployment workflow consists of three jobs:

1. **build-and-push-images**: ✅ **Implemented**
   - Builds Docker images for all 4 services (web, api, auth, admin)
   - Tags images with `latest` and commit SHA
   - Uses Docker Buildx with GitHub Actions cache
   - Auto-discovers AWS account ID from credentials
   - Pushes to ECR

2. **deploy-infrastructure**: ✅ **Implemented**
   - Installs CDK CLI and dependencies
   - Auto-discovers AWS account ID from credentials
   - Sets `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` environment variables
   - Runs `cdk synth --all` to verify
   - Runs `cdk deploy --all --require-approval never`

3. **update-services**: ✅ **Implemented**
   - Forces new ECS deployments for all services
   - Waits for services to stabilize using `aws ecs wait services-stable`

**Key Features**:
- ✅ Account ID auto-discovered from AWS credentials (no hardcoded values)
- ✅ Triggers on push to `staging` branch or manual workflow dispatch
- ✅ All stacks deployed in dependency order
- ✅ ECS services automatically updated with new images

**Deliverable**: ✅ CI/CD pipeline operational, automated deployments working.

---

### Day 5: Testing & Documentation

**Tasks:**

- [ ] **End-to-end testing**
  - Verify all 4 services accessible via ALB
  - Test service-to-service communication
  - Verify health checks
  - Test database connectivity
  - Test Redis connectivity

- [ ] **Monitor CloudWatch**
  - Check logs for all services
  - Verify metrics are being collected
  - Set up basic alarms (optional)

- [ ] **Documentation**
  - Update README with deployment instructions
  - Document ALB DNS name access
  - Document secrets setup process
  - Document migration process

- [ ] **Create runbooks**
  - How to update secrets
  - How to run migrations
  - How to rollback deployment
  - How to check service health

**Deliverable**: All services tested, documentation complete.

---

## Implementation Checklist

### Infrastructure Setup ✅

- [x] AWS account configured
- [x] IAM user `alva-cicd-user` created with access keys
- [x] CDK project initialized
- [x] CDK bootstrapped
- [x] ECR repositories created
- [x] Network stack deployed (VPC, subnets, security groups)
- [x] Database stack deployed (RDS PostgreSQL)
- [x] Cache stack deployed (ElastiCache Redis)
- [x] Secrets Manager configured
- [x] DNS stack implemented (optional, cross-account support)

### ECS Services ✅

- [x] ECS cluster created
- [x] Task definitions created (web, api, auth, admin)
- [x] ECS services created
- [x] Target groups configured
- [x] ALB configured with host-header routing
- [x] Health checks passing

### CI/CD ✅

- [x] GitHub Actions workflow created
- [x] AWS credentials (`alva-cicd-user`) configured in GitHub Secrets
- [x] Docker images building and pushing
- [x] Automated deployment working
- [x] Account ID auto-discovered from credentials

### Testing & Documentation

- [x] All services accessible
- [x] Service-to-service communication working
- [x] Health checks verified
- [x] Documentation updated

---

## Success Criteria

✅ **Infrastructure Deployed**
- All CDK stacks deployed successfully
- VPC, RDS, Redis, ECS, ALB all operational

✅ **All 4 Services Running**
- web, api, auth, admin accessible via ALB
- Health checks passing
- Services can communicate with each other

✅ **Database & Cache**
- RDS accessible from ECS services
- ElastiCache accessible from ECS services
- Migrations running successfully

✅ **CI/CD Pipeline**
- Staging branch triggers deployment
- Images built and pushed to ECR
- Services updated automatically
- Migrations run before service updates

✅ **Monitoring**
- CloudWatch logs configured for all services
- Basic health check monitoring
- Error tracking enabled

---

## CDK Project Structure

```
infrastructure/
├── lib/
│   ├── stacks/
│   │   ├── network-stack.ts       # VPC, subnets, security groups
│   │   ├── database-stack.ts     # RDS PostgreSQL
│   │   ├── cache-stack.ts        # ElastiCache Redis
│   │   ├── secrets-stack.ts      # Secrets Manager
│   │   ├── ecs-stack.ts          # ECS cluster and services
│   │   └── alb-stack.ts          # Application Load Balancer
│   ├── constructs/
│   │   └── ecs-service-construct.ts  # Reusable ECS service construct
│   └── config/
│       └── services.ts           # Service definitions
├── bin/
│   └── app.ts                   # CDK app entry point
├── cdk.json
├── package.json
└── tsconfig.json
```

---

## Environment Variables Reference

### Secrets Manager Secrets

1. **Database**: `alva-staging-database`
2. **JWT Private Key**: `alva-staging-jwt-private-key`
3. **JWT Public Key**: `alva-staging-jwt-public-key`
4. **JWT Secret**: `alva-staging-jwt-secret`
5. **Cookie Secret**: `alva-staging-cookie-secret`
6. **OpenAI API Key**: `alva-staging-openai-api-key`
7. **Resend API Key**: `alva-staging-resend-api-key` ✅ (Configured - EmailClient auto-selects in production/staging)

### ECS Task Environment Variables

**Web Service:**
- `NEXT_PUBLIC_API_URL` (internal service discovery)
- `NEXT_PUBLIC_AUTH_URL` (internal service discovery)
- `NODE_ENV=production`

**API Service:**
- `DATABASE_URL` (from Secrets Manager)
- `REDIS_URL` (from ElastiCache endpoint)
- `JWT_PUBLIC_KEY` (from Secrets Manager)
- `OPENAI_API_KEY` (from Secrets Manager)
- `CORS_ORIGINS` (ALB DNS name)

**Auth Service:**
- `DATABASE_URL` (from Secrets Manager)
- `JWT_PRIVATE_KEY` (from Secrets Manager)
- `JWT_PUBLIC_KEY` (from Secrets Manager)
- `RESEND_API_KEY` (from Secrets Manager)
- `CORS_ORIGINS` (ALB DNS name)
- `NODE_ENV=production` (enables ResendProvider in EmailClient)

**Admin Service:**
- `NEXT_PUBLIC_API_URL` (internal service discovery)
- `NEXT_PUBLIC_AUTH_URL` (internal service discovery)
- `NODE_ENV=production`

---

## Next Steps After Phase 12

1. **Add Domain** (when ready)
   - Register domain externally
   - Create Route 53 hosted zone
   - Update ALB listener rules (host-header based)
   - Configure SSL certificate (ACM)

2. **Optimize Costs**
   - Right-size ECS tasks based on actual usage
   - Consider NAT Instance instead of NAT Gateway
   - Monitor and optimize based on CloudWatch metrics

3. **Enhance Security**
   - Add WAF rules for admin portal
   - Implement IP whitelist if needed
   - Enable Multi-AZ for production

4. **Production Deployment**
   - Create production environment (separate stacks)
   - Enable Multi-AZ for RDS
   - Increase instance sizes
   - Add production monitoring and alerting

---

## Reference Documents

- **Technical Decisions**: `phases/phase-12-tech-decisions/`
- **IAM Setup Guide**: `phases/phase-12-tech-decisions/12-aws-iam-setup.md`
- **Cost Breakdown**: `phases/phase-12-tech-decisions/12-cost-breakdown-details.md`
- **Final Summary**: `phases/phase-12-tech-decisions/12-final-decisions-summary.md`
- **Review Document**: `phases/12-aws-staging-deployment-REVIEW.md`

---

Ready to begin implementation! 🚀

