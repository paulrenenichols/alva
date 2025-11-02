# Phase 12: AWS Staging Deployment - Implementation Plan

**@fileoverview** Detailed implementation plan for deploying Alva to AWS staging environment using CDK, ECS Fargate, RDS, and ElastiCache.

---

## Overview

**Goal**: Deploy all 4 Alva services (web, api, auth, admin) to AWS staging environment with automated CI/CD pipeline.

**Duration**: 2 weeks

**Deliverable**: Fully functional staging environment accessible via ALB DNS name, with automated deployment from GitHub.

---

## Architecture Summary

### Decisions Made ✅

1. **Infrastructure**: AWS CDK (TypeScript)
2. **Container Registry**: Amazon ECR
3. **Routing**: Subdomain-based (path-based initially, no domain yet)
4. **Database**: RDS PostgreSQL (db.t3.micro, Single AZ)
5. **Cache**: ElastiCache Redis (cache.t3.micro) for BullMQ
6. **Domain**: Deferred (using ALB DNS name initially)
7. **SSL**: ACM (can add later)
8. **Admin Portal**: Public initially (security deferred)

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

- [ ] **Bootstrap CDK** (required once per account/region)
  
  CDK needs to set up resources for managing deployments.
  
  ```bash
  # Get your AWS Account ID (if not already noted)
  aws sts get-caller-identity --query Account --output text
  
  # Initialize CDK project first (next step), then bootstrap
  cd infrastructure
  npm install -g aws-cdk
  cdk bootstrap aws://ACCOUNT-ID/us-east-1
  ```
  
  **Note**: 
  - Requires permissions to create S3 buckets and IAM roles
  - If using PowerUserAccess, this should work
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

- [ ] **Create ECR repositories**
  
  These will store Docker images for each service.
  
  ```bash
  # Get your AWS Account ID
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
  
  **Note**: `scanOnPush=true` enables automatic vulnerability scanning (free).

- [ ] **Configure GitHub secrets**
  
  Add the CI/CD user credentials to GitHub Secrets for automated deployments.
  
  **In GitHub**: Repository → Settings → Secrets and variables → Actions → New repository secret
  
  Add these secrets:
  - `AWS_ACCESS_KEY_ID` = Access key from `alva-cicd-user`
  - `AWS_SECRET_ACCESS_KEY` = Secret key from `alva-cicd-user`
  - `AWS_REGION` = `us-east-1`
  
  **Optional** (auto-detected, but can set explicitly):
  - `ECR_REGISTRY` = `ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com`
    (Get ACCOUNT_ID from: `aws sts get-caller-identity --query Account --output text`)
  
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

### Day 3: Load Balancer (CDK)

**Create ALB Stack** (`lib/stacks/alb-stack.ts`)

- [ ] **Application Load Balancer**
  - Internet-facing
  - Public subnets
  - Security group: Allow 80, 443

- [ ] **Target Groups** (4 groups)
  - Health check: `/health` endpoint
  - Protocol: HTTP
  - Port: Service-specific (3000, 3001, 3002, 3003)

- [ ] **Listener Rules**
  - Path-based routing initially (no domain):
    - `/` → web service
    - `/api/*` → api service
    - `/auth/*` → auth service
    - `/admin/*` → admin service
  - Ready to switch to host-header rules when domain added

- [ ] **SSL Certificate** (optional, can add later)
  - ACM certificate
  - HTTPS listener

**CDK Code Structure:**

```typescript
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class AlbStack extends Stack {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);

    // ALB
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: props.albSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // Target groups
    const webTargetGroup = new elbv2.ApplicationTargetGroup(this, 'WebTargetGroup', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      vpc: props.vpc,
      healthCheck: {
        path: '/health',
        interval: Duration.seconds(30),
      },
      targets: [props.webService],
    });

    // Listener with path-based routing
    const listener = this.loadBalancer.addListener('HttpListener', {
      port: 80,
      defaultTargetGroups: [webTargetGroup], // Default to web
    });

    // API route
    listener.addTargetGroups('ApiRule', {
      conditions: [elbv2.ListenerCondition.pathPatterns(['/api/*'])],
      targetGroups: [props.apiTargetGroup],
      priority: 1,
    });

    // Auth route
    listener.addTargetGroups('AuthRule', {
      conditions: [elbv2.ListenerCondition.pathPatterns(['/auth/*'])],
      targetGroups: [props.authTargetGroup],
      priority: 2,
    });

    // Admin route
    listener.addTargetGroups('AdminRule', {
      conditions: [elbv2.ListenerCondition.pathPatterns(['/admin/*'])],
      targetGroups: [props.adminTargetGroup],
      priority: 3,
    });
  }
}
```

**Deliverable**: ALB configured with routing rules, health checks passing.

---

### Day 4: CI/CD Pipeline

**Update GitHub Actions** (`.github/workflows/deploy-staging.yml`)

- [ ] **Create deployment workflow**
  ```yaml
  name: Deploy Staging

  on:
    push:
      branches: [staging]

  jobs:
    build-and-push:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        
        - name: Configure AWS credentials
          uses: aws-actions/configure-aws-credentials@v4
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: us-east-1

        - name: Login to Amazon ECR
          uses: aws-actions/amazon-ecr-login@v2

        - name: Build and push images
          run: |
            docker build -t $ECR_REGISTRY/alva-web:$GITHUB_SHA -f apps/web/Dockerfile .
            docker push $ECR_REGISTRY/alva-web:$GITHUB_SHA
            # Repeat for api, auth, admin

    deploy-infrastructure:
      needs: build-and-push
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        
        - name: Configure AWS credentials
          uses: aws-actions/configure-aws-credentials@v4
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: us-east-1

        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '20'

        - name: Install CDK dependencies
          run: |
            cd infrastructure
            npm install

        - name: Deploy CDK stacks
          run: |
            cd infrastructure
            npm run cdk deploy -- --all --require-approval never

    deploy-services:
      needs: [build-and-push, deploy-infrastructure]
      runs-on: ubuntu-latest
      steps:
        - name: Configure AWS credentials
          uses: aws-actions/configure-aws-credentials@v4
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: us-east-1

        - name: Run database migrations
          run: |
            aws ecs run-task \
              --cluster alva-staging-cluster \
              --task-definition alva-migrations \
              --launch-type FARGATE \
              --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
              --wait

        - name: Update ECS services
          run: |
            aws ecs update-service --cluster alva-staging-cluster --service alva-web --force-new-deployment
            aws ecs update-service --cluster alva-staging-cluster --service alva-api --force-new-deployment
            aws ecs update-service --cluster alva-staging-cluster --service alva-auth --force-new-deployment
            aws ecs update-service --cluster alva-staging-cluster --service alva-admin --force-new-deployment
  ```

- [ ] **Update existing CI workflow** to build Docker images
- [ ] **Test deployment** manually first

**Deliverable**: CI/CD pipeline working, automated deployments on push to staging branch.

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

### Infrastructure Setup

- [ ] AWS account configured
- [ ] IAM user `alva-cicd-user` created with access keys
- [ ] CDK project initialized
- [ ] CDK bootstrapped
- [ ] ECR repositories created
- [ ] Network stack deployed (VPC, subnets, security groups)
- [ ] Database stack deployed (RDS PostgreSQL)
- [ ] Cache stack deployed (ElastiCache Redis)
- [ ] Secrets Manager configured

### ECS Services

- [ ] ECS cluster created
- [ ] Task definitions created (web, api, auth, admin, migrations)
- [ ] ECS services created
- [ ] Target groups configured
- [ ] ALB configured with routing rules
- [ ] Health checks passing

### CI/CD

- [ ] GitHub Actions workflow created
- [ ] AWS credentials (`alva-cicd-user`) configured in GitHub Secrets
- [ ] Docker images building and pushing
- [ ] Automated deployment working
- [ ] Migration task running before deployments

### Testing & Documentation

- [ ] All services accessible
- [ ] Service-to-service communication working
- [ ] Database migrations successful
- [ ] Health checks verified
- [ ] Documentation complete
- [ ] Runbooks created

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
7. **Resend API Key**: `alva-staging-resend-api-key`

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

