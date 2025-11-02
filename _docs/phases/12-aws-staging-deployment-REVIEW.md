# Phase 12: AWS Staging Deployment - Review & Recommendations

**@fileoverview** Comprehensive review of Phase 12 AWS deployment plan with recommendations and revisions.

---

## Executive Summary

After reviewing the current Phase 12 plan against the codebase, I've identified several areas that need revision:

1. **Service Count Mismatch**: Plan assumes 1 service, we have 4 (web, api, auth, admin)
2. **IaC Choice**: Need to decide between CloudFormation, Terraform, or AWS CDK
3. **Container Registry**: ECR vs GitHub Container Registry (GHCR)
4. **Missing Components**: Secrets management, migrations, health checks
5. **Load Balancer Strategy**: How to route 4 services
6. **Admin Access**: Separate domain/subdomain for admin portal

**✅ All decisions have been finalized!** See decisions section below and `phase-12-tech-decisions/12-final-decisions-summary.md` for complete details.

---

## Current State Assessment

### ✅ What We Have

- **4 Dockerized Services**: web (Next.js), api (Fastify), auth (Fastify), admin (Next.js)
- **Complete Docker Setup**: Both dev and prod Dockerfiles + compose files
- **GitHub Actions CI**: Builds images but doesn't deploy
- **Local Development**: Fully working Docker Compose setup
- **Email Service**: Resend integration ready for production

### ❌ What's Missing

- **AWS Infrastructure**: No CloudFormation/Terraform templates
- **Container Registry**: No ECR repositories
- **CI/CD Pipeline**: No automated deployment to AWS
- **Secrets Management**: No AWS Secrets Manager integration
- **Database Migrations**: No strategy for running migrations in AWS
- **Monitoring**: No CloudWatch setup

---

## Critical Issues to Address

### 1. Infrastructure as Code Choice

**Current Plan**: CloudFormation  
**Alternative**: Terraform (recommended in deployment-strategy.md)  
**Alternative**: AWS CDK (TypeScript-native)

#### Option A: CloudFormation (Current Plan)

**Pros:**

- Native AWS, no external dependencies
- Well-documented
- Direct AWS console integration

**Cons:**

- Verbose YAML syntax
- Limited state management
- Harder to modularize

#### Option B: Terraform ⭐ **RECOMMENDED**

**Pros:**

- Cleaner syntax (HCL)
- Better state management
- Multi-cloud capability
- Large module ecosystem
- Explicit dependency tracking

**Cons:**

- Need to learn HCL
- Requires Terraform binary
- State file management

#### Option C: AWS CDK

**Pros:**

- TypeScript (matches our stack)
- Type-safe infrastructure
- Can leverage TypeScript tooling

**Cons:**

- Steeper learning curve
- Additional compilation step
- More abstraction layers

**Recommendation**: **Terraform** - Best balance of clarity, state management, and ecosystem support. However, if you prefer staying within AWS native tools, CloudFormation works fine.

---

### 2. Container Registry Strategy

**Current State**: GitHub Actions builds to GHCR (`ghcr.io`)  
**Phase 12 Plan**: Uses ECR

#### Option A: Use ECR ⭐ **RECOMMENDED FOR AWS**

**Pros:**

- Native AWS integration
- Automatic image scanning
- Better ECS integration
- IAM-based access control
- No external registry dependency

**Cons:**

- Additional setup step
- Need to authenticate GitHub Actions to ECR

#### Option B: Keep GHCR

**Pros:**

- Already configured in GitHub Actions
- Free for public repos
- Simpler (one less thing to set up)

**Cons:**

- External dependency
- Less integrated with AWS services
- Image pulling may be slower from ECS

**Recommendation**: **ECR** - Better long-term for AWS deployments, better security, better integration.

**Migration Path**: Update GitHub Actions to push to both ECR and GHCR initially, then migrate fully to ECR.

---

### 3. Multi-Service Architecture

**Critical Gap**: The plan shows a single "web" service, but we have **4 services**:

1. **web** (Next.js) - Port 3000 - User-facing app
2. **api** (Fastify) - Port 3001 - Business logic
3. **auth** (Fastify) - Port 3002 - Authentication
4. **admin** (Next.js) - Port 3003 - Admin portal

**Required Changes:**

- **4 ECS Task Definitions** (one per service)
- **4 ECS Services** (one per service)
- **ALB Routing Rules** (path-based or subdomain-based)
- **Service Discovery** (internal communication)

#### Recommended Routing Strategy

**Option A: Subdomain-Based** ⭐ **RECOMMENDED**

```
staging.alva.app      → web service (Next.js)
api-staging.alva.app  → api service (Fastify)
auth-staging.alva.app → auth service (Fastify)
admin-staging.alva.app → admin service (Next.js)
```

**Pros:**

- Clean separation
- Independent scaling
- Easy CORS configuration
- Matches service architecture

**Cons:**

- Requires multiple SSL certificates (or wildcard cert)
- More DNS configuration

**Option B: Path-Based**

```
staging.alva.app/        → web service
staging.alva.app/api/*   → api service
staging.alva.app/auth/*  → auth service
staging.alva.app/admin/* → admin service
```

**Pros:**

- Single domain
- Single SSL certificate
- Simpler DNS

**Cons:**

- Next.js routing complexity
- Harder to scale services independently
- CORS complications

**Recommendation**: **Subdomain-based** - Matches microservices architecture better.

---

### 4. Database Migration Strategy

**Missing**: How to run migrations in AWS environment

**Options:**

#### Option A: Migration Container (Recommended)

Create a one-off ECS task that runs migrations:

```yaml
MigrationTask:
  Type: AWS::ECS::TaskDefinition
  Properties:
    Family: alva-migrations
    ContainerDefinitions:
      - Name: migrations
        Image: !Sub '${ECR_REPO}/api:latest'
        Command: ['pnpm', 'db:migrate']
```

**Run on deployment:**

```bash
aws ecs run-task \
  --cluster alva-staging-cluster \
  --task-definition alva-migrations \
  --launch-type FARGATE
```

#### Option B: Init Container

Use ECS task definition `dependsOn` to run migrations before service starts.

#### Option C: Manual Migration Script

Separate script that runs migrations via ECS exec or direct RDS connection.

**Recommendation**: **Option A** - Migration container as separate task definition, triggered during deployment.

---

### 5. Secrets Management

**Missing**: How to handle secrets (DB passwords, JWT keys, API keys)

**Recommendation**: AWS Secrets Manager

```yaml
# CloudFormation example
DatabaseSecret:
  Type: AWS::SecretsManager::Secret
  Properties:
    Name: alva-staging-database
    GenerateSecretString:
      SecretStringTemplate: '{"username": "alva_admin"}'
      GenerateStringKey: 'password'
      PasswordLength: 32

# Task definition
Environment:
  - Name: DATABASE_URL
    ValueFrom: !Sub 'arn:aws:secretsmanager:us-east-1:${AWS::AccountId}:secret:alva-staging-database:DATABASE_URL::'
```

**Secrets to Store:**

- Database credentials (`DATABASE_URL`)
- JWT keys (`JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `JWT_SECRET`)
- Cookie secret (`COOKIE_SECRET`)
- API keys (`OPENAI_API_KEY`, `RESEND_API_KEY`)
- Redis password (if enabled)

---

### 6. Health Checks & Service Discovery

**Missing**: Health check endpoints and internal service discovery

**Required:**

- Health check endpoints for each service (`/health`)
- Service discovery for internal communication
- ALB health checks configuration

**Service Communication:**

- **web** → **api** (via `NEXT_PUBLIC_API_URL`)
- **web** → **auth** (via `NEXT_PUBLIC_AUTH_URL`)
- **api** → **auth** (for token validation, if needed)
- **admin** → **api** (via `NEXT_PUBLIC_API_URL`)
- **admin** → **auth** (via `NEXT_PUBLIC_AUTH_URL`)

**Internal URLs:**

- Use ECS service discovery names: `http://api.alva-staging.local:3001`
- Or ALB internal endpoints (if using internal ALB)

---

### 7. Admin Portal Access Control

**Question**: How to restrict admin portal access?

**Options:**

#### Option A: IP Whitelist

Restrict admin subdomain to specific IPs via security groups/WAF.

#### Option B: Authentication Gate

Admin portal requires additional authentication (separate admin login).

#### Option C: VPN/Private Network

Admin portal only accessible via VPN or private network.

**Recommendation**: Start with **Option B** (authentication gate), add IP whitelist later if needed.

---

## Revised Implementation Plan

### Week 1: Infrastructure Foundation

#### Day 1: Decision Making & Setup

**Tasks:**

- [ ] **Choose IaC tool**: CloudFormation vs Terraform vs CDK
- [ ] **Choose registry**: ECR vs GHCR
- [ ] **Choose routing**: Subdomain vs path-based
- [ ] **Set up AWS account**: Create staging AWS account/sub-account
- [ ] **Create ECR repositories**: 4 repos (web, api, auth, admin)
- [ ] **Set up GitHub secrets**: AWS credentials, ECR login

#### Day 2-3: Network Infrastructure

**Create:**

- VPC with public/private subnets (2 AZs)
- Internet Gateway & NAT Gateway
- Security Groups:
  - ALB security group (port 80, 443)
  - ECS security group (internal only)
  - RDS security group (ECS only)
  - ElastiCache security group (ECS only)

#### Day 4-5: Database & Cache

**Create:**

- RDS PostgreSQL (db.t3.micro for staging)
- ElastiCache Redis (cache.t3.micro for staging)
- Secrets Manager secrets
- Backup configuration

**Test:**

- Database connectivity from local machine
- Redis connectivity

### Week 2: ECS Services & Deployment

#### Day 1-2: ECS Setup

**Create:**

- ECS Cluster (Fargate)
- ECR repositories (if using ECR)
- Task definitions for all 4 services
- ECS Services for all 4 services
- Target groups for ALB

**Task Definition Requirements:**

- CPU/Memory allocation (start small: 512 CPU, 1024 MB)
- Environment variables from Secrets Manager
- Health check configuration
- Logging configuration (CloudWatch)

#### Day 3: Load Balancer

**Create:**

- Application Load Balancer (internet-facing)
- SSL certificate (ACM)
- Listener rules:
  - `staging.alva.app` → web service
  - `api-staging.alva.app` → api service
  - `auth-staging.alva.app` → auth service
  - `admin-staging.alva.app` → admin service

**Configure:**

- Health checks
- Target groups
- SSL/TLS termination

#### Day 4: CI/CD Pipeline

**Update GitHub Actions:**

```yaml
deploy-staging:
  runs-on: ubuntu-latest
  needs: [build]
  if: github.ref == 'refs/heads/staging'
  steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Login to ECR
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build and push images
      run: |
        docker build -t $ECR_REGISTRY/web:$GITHUB_SHA -f apps/web/Dockerfile .
        docker push $ECR_REGISTRY/web:$GITHUB_SHA
        # Repeat for api, auth, admin

    - name: Run database migrations
      run: |
        aws ecs run-task \
          --cluster alva-staging-cluster \
          --task-definition alva-migrations \
          --launch-type FARGATE \
          --wait

    - name: Deploy ECS services
      run: |
        aws ecs update-service \
          --cluster alva-staging-cluster \
          --service alva-web \
          --force-new-deployment
        # Repeat for api, auth, admin
```

#### Day 5: Testing & Documentation

**Tasks:**

- [ ] Test end-to-end deployment
- [ ] Verify all 4 services are accessible
- [ ] Test service-to-service communication
- [ ] Verify health checks
- [ ] Test database migrations
- [ ] Document deployment process
- [ ] Set up monitoring alerts

---

## Revised File Structure

```
infrastructure/
  ├── terraform/              # or cloudformation/
  │   ├── modules/
  │   │   ├── network/
  │   │   ├── database/
  │   │   ├── cache/
  │   │   ├── ecs/
  │   │   └── alb/
  │   ├── staging/
  │   │   ├── main.tf
  │   │   ├── variables.tf
  │   │   └── outputs.tf
  │   └── production/
  │       ├── main.tf
  │       ├── variables.tf
  │       └── outputs.tf
  ├── scripts/
  │   ├── deploy.sh           # Infrastructure deployment
  │   ├── deploy-services.sh  # ECS service deployment
  │   ├── run-migrations.sh   # Database migration runner
  │   └── setup-env.sh         # Environment setup
  └── README.md               # Infrastructure documentation
```

---

## Questions to Answer Before Implementation

### 1. Infrastructure Tool

- [ ] ~~**CloudFormation** (AWS native, simpler)~~
- [ ] ~~**Terraform** (recommended, better state management)~~
- [x] **AWS CDK** (TypeScript-native) ✅ **SELECTED**

### 2. Container Registry

- [x] **ECR** (recommended, AWS-native) ✅ **SELECTED**

- [ ] ~~**GHCR** (simpler, already configured)~~

### 3. Routing Strategy

- [x] **Subdomain-based** ✅ **SELECTED**
  - Will use ALB DNS name initially (no domain yet)
  - Structure ready for domain: `api-staging.alva.app` (future)
  - For now: Different ports/target groups, same ALB DNS
- [ ] ~~**Path-based** (simpler: `staging.alva.app/api/*`)~~

### 4. Admin Portal Access

- [x] **Deferred - Public for now** ✅ **SELECTED**
  - Admin portal will be publicly accessible initially
  - Can add IP whitelist/WAF rules later when needed
  - Authentication gate in app already provides basic security
- [ ] ~~**IP Whitelist**~~ (can add later)
- [ ] ~~**Authentication Gate**~~ (already implemented in app)
- [ ] ~~**VPN/Private Network**~~ (future consideration)

### 5. Database Deployment

- [x] **AWS RDS PostgreSQL** ✅ **SELECTED**
  - Managed service (automatic backups, patching, monitoring)
  - db.t3.micro for staging (~$18/month including storage)
  - Production-ready setup from day one
- [ ] ~~**PostgreSQL Container (ECS)**~~ (considered, RDS simpler)
- [ ] ~~**PostgreSQL on EC2**~~ (not recommended)

### 6. Multi-AZ Deployment

- [x] **Single AZ** (staging, cheaper) ✅ **SELECTED**
  - Sufficient for staging environment
  - Can enable Multi-AZ when moving to production
  - Cost: ~$18/month for RDS
- [ ] ~~**Multi-AZ** (production requirement)~~ (will enable for production)

### 7. Domain & DNS

- [x] **Deferred - Use ALB DNS name initially** ✅ **SELECTED**
  - Deploy with ALB DNS name: `alva-staging-xxx.us-east-1.elb.amazonaws.com`
  - Add domain later when ready (Route 53 DNS + external registration)
  - CDK will support both (with/without domain)

### 8. SSL Certificates

- [x] **ACM (AWS Certificate Manager)** ✅ **SELECTED**
  - AWS-native SSL certificate management
  - Free certificates
  - Can add domain later or skip HTTPS initially for staging
- [ ] ~~**Let's Encrypt** (external)~~ (not needed, ACM covers this)

### 9. Job Queue & Cache

- [x] **BullMQ + ElastiCache Redis** ✅ **SELECTED**
  - BullMQ for background job processing (plan generation, etc.)
  - ElastiCache Redis for BullMQ queue storage and caching
  - Cost: ~$14/month for cache.t3.micro
  - Provides priority queues, delayed jobs, retries, and job chains
- [ ] ~~**AWS SQS**~~ (considered, but BullMQ has better features and DX)

---

## Cost Estimates (Revised)

### Staging Environment

| Service                               | Monthly Cost        |
| ------------------------------------- | ------------------- |
| ECS Fargate (4 tasks × 0.5 vCPU, 1GB) | ~$40-82             |
| RDS PostgreSQL (db.t3.micro)          | ~$18                |
| ElastiCache Redis (cache.t3.micro)    | ~$14                |
| Application Load Balancer             | ~$16-28             |
| NAT Gateway                           | ~$33                |
| ECR (container registry)              | ~$2                 |
| Data Transfer                         | ~$10                |
| CloudWatch Logs                       | ~$2                 |
| Secrets Manager                       | ~$2                 |
| **Total (Conservative)**              | **~$136/month**     |
| **Total (Realistic)**                 | **~$182-190/month** |

**Note**:

- **Conservative estimate** assumes optimized resource allocation and low traffic
- **Realistic estimate** based on standard AWS pricing and moderate traffic
- Costs will vary based on actual usage. See `phase-12-tech-decisions/12-cost-breakdown-details.md` for detailed breakdown
- Can optimize costs by right-sizing ECS tasks or using NAT Instance instead of NAT Gateway

---

## Success Criteria (Updated)

✅ **All 4 services deployed**

- web, api, auth, admin all running on ECS
- All services accessible via subdomains/paths
- Health checks passing

✅ **Database & Cache**

- RDS PostgreSQL accessible
- ElastiCache Redis accessible
- Migrations running successfully

✅ **CI/CD Pipeline**

- Staging branch triggers deployment
- Automated builds and deploys
- Migration task runs before service updates

✅ **Monitoring**

- CloudWatch logs for all services
- Health check alerts configured
- Error tracking set up

✅ **Security**

- Secrets in Secrets Manager
- SSL certificates configured
- Security groups properly configured
- Admin portal access controlled

---

## Recommended Next Steps

✅ **All decisions complete!**

- See `phase-12-tech-decisions/12-final-decisions-summary.md` for complete summary
- See `phase-plans/12-phase-12-aws-staging-deployment-plan.md` for detailed implementation plan

1. **Create infrastructure directory** structure (CDK project)
2. **Set up AWS account** and ECR repositories
3. **Create network infrastructure** (VPC, subnets, security groups) - CDK
4. **Deploy database and cache** (RDS + Redis) - CDK
5. **Create ECS task definitions** for all 4 services - CDK
6. **Configure load balancer** with routing rules - CDK
7. **Update CI/CD pipeline** for automated deployment
8. **Test end-to-end** deployment
9. **Document** the deployment process

---

## Key Changes from Original Plan

1. ✅ **Added 4 services** instead of 1
2. ✅ **Added routing strategy** decision (subdomain vs path)
3. ✅ **Added secrets management** (Secrets Manager)
4. ✅ **Added migration strategy** (ECS task)
5. ✅ **Added admin access control** consideration
6. ✅ **Added service discovery** for internal communication
7. ✅ **Updated cost estimates** for 4 services
8. ✅ **Added IaC tool choice** (CloudFormation vs Terraform)
9. ✅ **Added container registry choice** (ECR vs GHCR)

---

Would you like me to proceed with implementing based on your answers to these questions, or would you prefer to discuss any of these points further?
