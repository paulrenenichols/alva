# Phase 12: Final Decisions Summary

**@fileoverview** Complete summary of all architectural decisions for AWS staging deployment, ready for implementation.

---

## All Decisions Finalized ✅

### 1. Infrastructure Tool
**✅ AWS CDK (TypeScript)**
- TypeScript-native infrastructure code
- Matches application stack
- Best developer experience for TypeScript teams

### 2. Container Registry
**✅ Amazon ECR (Elastic Container Registry)**
- Native AWS integration
- IAM-based authentication (no token management)
- Automatic vulnerability scanning
- Best for AWS-native deployments

### 3. Routing Strategy
**✅ Subdomain-Based Routing**
- Structure: `staging.alva.app`, `api-staging.alva.app`, etc.
- Initially using path-based routing (no domain yet)
- Ready to switch to subdomains when domain is added

### 4. Domain & DNS
**✅ Deferred - Using ALB DNS Name Initially**
- Deploy with: `alva-staging-xxx.us-east-1.elb.amazonaws.com`
- Add domain later (Route 53 DNS + external `.app` registration)
- CDK will support both scenarios

### 5. Admin Portal Access
**✅ Deferred - Public for Now**
- Publicly accessible initially
- Authentication gate already in app
- Can add IP whitelist/WAF later

### 6. Database Deployment
**✅ AWS RDS PostgreSQL**
- Managed service (automatic backups, patching, monitoring)
- Instance: `db.t3.micro`
- Storage: 20GB gp2
- Single AZ for staging
- Cost: ~$18/month

### 7. Multi-AZ Deployment
**✅ Single AZ**
- Sufficient for staging
- Cost-effective
- Can enable Multi-AZ for production

### 8. SSL Certificates
**✅ ACM (AWS Certificate Manager)**
- AWS-native certificate management
- Free certificates
- Can skip HTTPS initially or add domain later

---

## Complete Architecture

### Services (4 Total)

1. **web** (Next.js) - Port 3000
   - User-facing application
   - ECS Fargate: 0.5 vCPU, 1GB RAM

2. **api** (Fastify) - Port 3001
   - Business logic API
   - ECS Fargate: 0.5 vCPU, 1GB RAM

3. **auth** (Fastify) - Port 3002
   - Authentication service
   - ECS Fargate: 0.5 vCPU, 1GB RAM

4. **admin** (Next.js) - Port 3003
   - Admin portal
   - ECS Fargate: 0.5 vCPU, 1GB RAM

### Infrastructure Components

**Networking:**
- VPC with public/private subnets (2 AZs)
- Internet Gateway
- NAT Gateway (for private subnets)
- Security Groups (ALB, ECS, RDS, Redis)

**Compute:**
- ECS Cluster (Fargate)
- 4 ECS Services (one per app)
- Application Load Balancer (ALB)

**Data:**
- RDS PostgreSQL (db.t3.micro, Single AZ)
- ElastiCache Redis (cache.t3.micro)

**Container Registry:**
- ECR repositories (4 repos: web, api, auth, admin)

**Security:**
- AWS Secrets Manager (credentials, JWT keys, API keys)
- ACM certificates (when domain added)
- IAM roles for ECS tasks

**Monitoring:**
- CloudWatch Logs (all services)
- CloudWatch Metrics
- CloudWatch Alarms

---

## Cost Breakdown (Staging)

| Service | Monthly Cost |
|---------|--------------|
| ECS Fargate (4 tasks × 0.5 vCPU, 1GB) | ~$40 |
| RDS PostgreSQL (db.t3.micro, 20GB) | ~$18 |
| ElastiCache Redis (cache.t3.micro) | ~$10 |
| Application Load Balancer | ~$16 |
| NAT Gateway | ~$32 |
| ECR (storage + scanning) | ~$2 |
| Route 53 (when domain added) | ~$0.50 |
| Data Transfer | ~$10 |
| **Total** | **~$128/month** |

**Note**: Can start smaller and scale up. Costs vary based on actual usage.

---

## Implementation Roadmap

### Week 1: Infrastructure Setup

#### Day 1-2: AWS Account & ECR Setup
- [ ] Create AWS account/sub-account for staging
- [ ] Configure AWS CLI credentials
- [ ] Create ECR repositories (4 repos)
- [ ] Set up GitHub Actions AWS credentials
- [ ] Initialize CDK project structure

#### Day 3-4: Network Infrastructure (CDK)
- [ ] Create VPC with public/private subnets
- [ ] Create Internet Gateway & NAT Gateway
- [ ] Create Security Groups:
  - ALB security group (ports 80, 443)
  - ECS security group (internal)
  - RDS security group (ECS only)
  - Redis security group (ECS only)
- [ ] Test network connectivity

#### Day 5: Database & Cache (CDK)
- [ ] Create RDS PostgreSQL instance
  - db.t3.micro, Single AZ
  - 20GB storage
  - 7-day backup retention
- [ ] Create ElastiCache Redis cluster
  - cache.t3.micro
  - Single node
- [ ] Store database credentials in Secrets Manager
- [ ] Test database connectivity

### Week 2: ECS Services & Deployment

#### Day 1-2: ECS Setup (CDK)
- [ ] Create ECS Cluster (Fargate)
- [ ] Create ECR repositories (if not done)
- [ ] Create Task Definitions for all 4 services:
  - web, api, auth, admin
  - Environment variables from Secrets Manager
  - CloudWatch logging
  - Health checks
- [ ] Create ECS Services (1 task each initially)

#### Day 3: Load Balancer (CDK)
- [ ] Create Application Load Balancer
- [ ] Create Target Groups (4 groups)
- [ ] Configure Listener Rules:
  - Path-based routing initially (no domain)
  - Ready for subdomain-based when domain added
- [ ] Configure Health Checks
- [ ] Test ALB routing

#### Day 4: CI/CD Pipeline
- [ ] Update GitHub Actions workflow:
  - Build and push to ECR
  - Deploy to ECS staging
  - Run database migrations
- [ ] Configure GitHub secrets (AWS credentials)
- [ ] Test automated deployment

#### Day 5: Testing & Documentation
- [ ] Test end-to-end deployment
- [ ] Verify all 4 services accessible
- [ ] Test service-to-service communication
- [ ] Verify health checks
- [ ] Test database migrations
- [ ] Document deployment process
- [ ] Set up CloudWatch alarms

---

## CDK Project Structure

```
infrastructure/
├── lib/
│   ├── stacks/
│   │   ├── network-stack.ts       # VPC, subnets, gateways
│   │   ├── database-stack.ts     # RDS PostgreSQL
│   │   ├── cache-stack.ts        # ElastiCache Redis
│   │   ├── ecs-stack.ts          # ECS cluster, services, tasks
│   │   ├── alb-stack.ts          # Application Load Balancer
│   │   └── secrets-stack.ts      # Secrets Manager setup
│   ├── constructs/
│   │   ├── ecs-service.ts       # Reusable ECS service construct
│   │   └── service-config.ts     # Service configuration types
│   └── config/
│       └── services.ts           # Service definitions (4 services)
├── bin/
│   └── app.ts                   # CDK app entry point
├── cdk.json
├── package.json
└── tsconfig.json
```

---

## Environment Variables

### Secrets Manager Secrets

1. **Database Credentials**
   - `alva-staging-database` (RDS username/password)

2. **JWT Keys**
   - `alva-staging-jwt-private-key`
   - `alva-staging-jwt-public-key`
   - `alva-staging-jwt-secret`

3. **API Keys**
   - `alva-staging-openai-api-key`
   - `alva-staging-resend-api-key`

4. **Cookie Secret**
   - `alva-staging-cookie-secret`

### ECS Task Environment Variables

**Web Service:**
```env
NEXT_PUBLIC_API_URL=http://api-service:3001  # Internal
NEXT_PUBLIC_AUTH_URL=http://auth-service:3002  # Internal
NODE_ENV=production
```

**API Service:**
```env
DATABASE_URL=<from Secrets Manager>
REDIS_URL=redis://redis-cluster:6379
JWT_PUBLIC_KEY=<from Secrets Manager>
CORS_ORIGINS=<ALB DNS name>
NODE_ENV=production
```

**Auth Service:**
```env
DATABASE_URL=<from Secrets Manager>
JWT_PRIVATE_KEY=<from Secrets Manager>
JWT_PUBLIC_KEY=<from Secrets Manager>
RESEND_API_KEY=<from Secrets Manager>
CORS_ORIGINS=<ALB DNS name>
NODE_ENV=production
```

**Admin Service:**
```env
NEXT_PUBLIC_API_URL=http://api-service:3001  # Internal
NEXT_PUBLIC_AUTH_URL=http://auth-service:3002  # Internal
NODE_ENV=production
```

---

## Service Communication

### Internal Communication (ECS Service Discovery)

**Option A: ECS Service Discovery** ⭐ **RECOMMENDED**
```typescript
// Service discovery creates DNS names:
http://api.alva-staging.local:3001
http://auth.alva-staging.local:3002
```

**Option B: ALB Internal Endpoints**
```
http://internal-alb-xxx.elb.amazonaws.com/api
http://internal-alb-xxx.elb.amazonaws.com/auth
```

**Recommendation**: Use ECS Service Discovery for internal communication.

### External Communication (via ALB)

```
https://alva-staging-xxx.elb.amazonaws.com/        → web
https://alva-staging-xxx.elb.amazonaws.com/api/*   → api
https://alva-staging-xxx.elb.amazonaws.com/auth/*  → auth
https://alva-staging-xxx.elb.amazonaws.com/admin/* → admin
```

**Note**: When domain is added, will switch to subdomain-based routing.

---

## Database Migration Strategy

### ECS Migration Task

Create a one-off ECS task definition for migrations:

```typescript
const migrationTask = new ecs.FargateTaskDefinition(this, 'MigrationTask', {
  cpu: 256,
  memoryLimitMiB: 512,
  family: 'alva-migrations',
});

migrationTask.addContainer('Migrations', {
  image: ecs.ContainerImage.fromEcrRepository(apiRepo, 'latest'),
  command: ['pnpm', 'db:migrate'],
  environment: {
    DATABASE_URL: database.secret?.secretValueFromJson('DATABASE_URL').toString()!,
  },
  logging: ecs.LogDrivers.awsLogs({
    streamPrefix: 'migrations',
  }),
});
```

**Run before service updates:**
```bash
aws ecs run-task \
  --cluster alva-staging-cluster \
  --task-definition alva-migrations \
  --launch-type FARGATE \
  --wait
```

---

## CI/CD Pipeline (GitHub Actions)

### Updated Workflow

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
          docker build -t $ECR_REGISTRY/web:$GITHUB_SHA -f apps/web/Dockerfile .
          docker push $ECR_REGISTRY/web:$GITHUB_SHA
          # Repeat for api, auth, admin

  deploy:
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

      - name: Run database migrations
        run: |
          aws ecs run-task \
            --cluster alva-staging-cluster \
            --task-definition alva-migrations \
            --launch-type FARGATE \
            --wait

      - name: Deploy infrastructure (if changed)
        run: |
          cd infrastructure
          npm install
          npm run cdk deploy -- --all

      - name: Update ECS services
        run: |
          aws ecs update-service --cluster alva-staging-cluster --service alva-web --force-new-deployment
          aws ecs update-service --cluster alva-staging-cluster --service alva-api --force-new-deployment
          aws ecs update-service --cluster alva-staging-cluster --service alva-auth --force-new-deployment
          aws ecs update-service --cluster alva-staging-cluster --service alva-admin --force-new-deployment
```

---

## Next Steps

### Immediate Actions

1. **Create infrastructure directory structure**
2. **Initialize CDK project**
3. **Set up AWS account and credentials**
4. **Create ECR repositories**
5. **Begin implementing CDK stacks**

### Implementation Order

1. Network stack (VPC, subnets, security groups)
2. Secrets stack (Secrets Manager setup)
3. Database stack (RDS)
4. Cache stack (Redis)
5. ECS stack (cluster, services)
6. ALB stack (load balancer, routing)
7. CI/CD pipeline updates

---

## Success Criteria

✅ **Infrastructure Deployed**
- All CDK stacks deployed
- Network, database, cache, ECS, ALB all running

✅ **All 4 Services Running**
- web, api, auth, admin on ECS
- Health checks passing
- Services accessible via ALB

✅ **Database & Cache**
- RDS accessible from ECS
- Redis accessible from ECS
- Migrations running successfully

✅ **CI/CD Working**
- GitHub Actions builds and deploys
- Automated migrations before service updates

✅ **Monitoring**
- CloudWatch logs configured
- Health check alarms set up
- Error tracking working

---

All decisions are complete and documented! Ready to begin implementation. 🚀

