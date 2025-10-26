# Phase 9: AWS Staging Deployment

**@fileoverview** Implementation plan for AWS infrastructure setup and staging environment deployment.

---

## Overview

This phase implements:
1. **AWS infrastructure** using CloudFormation
2. **Staging environment** setup
3. **CI/CD pipeline** for automated deployment
4. **ECS Fargate** container deployment
5. **Database and cache** (RDS + ElastiCache)

**Estimated Duration**: 1-2 weeks

**Builds On**: Phase 8 - requires completed invite system and admin app

---

## Current State

### ✅ Already Implemented

1. **Local Development**: MailHog, Docker Compose, all services running locally ✅
2. **Invite System**: Database schema, invite service, registration flow ✅
3. **Admin App**: Invite management interface ✅
4. **Email Service**: MailHog + Resend integration ✅

### ❌ What's Missing

1. **AWS infrastructure**: No CloudFormation templates
2. **Staging environment**: No separate staging deployment
3. **CI/CD pipeline**: No automated deployment
4. **Database & cache**: No RDS or ElastiCache setup

---

## Week 1: Infrastructure Setup

### Day 1-2: CloudFormation Templates

#### Infrastructure Structure

Create new directory:

```
infrastructure/
  ├── cloudformation/
  │   ├── network.yml           # VPC, subnets, security groups
  │   ├── rds.yml               # PostgreSQL RDS
  │   ├── redis.yml             # ElastiCache Redis
  │   ├── ecs.yml               # ECS cluster and services
  │   ├── alb.yml               # Application Load Balancer
  │   └── parameters.json       # Environment-specific params
  ├── scripts/
  │   ├── deploy.sh             # Deployment script
  │   └── setup-env.sh          # Environment setup
```

**Tasks**:
- [ ] Create infrastructure directory structure
- [ ] Initialize CloudFormation templates
- [ ] Document infrastructure approach

#### Network Template

**File**: `infrastructure/cloudformation/network.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Network infrastructure for Alva'

Parameters:
  Environment:
    Type: String
    Default: staging
    AllowedValues: [staging, production]

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub 'alva-${Environment}-vpc'

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true

Outputs:
  VpcId:
    Value: !Ref VPC
    Export:
      Name: !Sub 'alva-${Environment}-vpc-id'
```

**Tasks**:
- [ ] Create network CloudFormation template
- [ ] Define VPC, subnets, internet gateway
- [ ] Add security groups
- [ ] Test network stack creation

### Day 3-4: Database & Cache

#### RDS PostgreSQL

**File**: `infrastructure/cloudformation/rds.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'RDS PostgreSQL database for Alva'

Parameters:
  Environment:
    Type: String
    AllowedValues: [staging, production]

Resources:
  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for Alva database
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub 'alva-${Environment}-db'
      DBInstanceClass: db.t3.micro
      Engine: postgres
      MasterUsername: ${DB_USERNAME}
      MasterUserPassword: ${DB_PASSWORD}
      DBName: alva
      AllocatedStorage: 20
      StorageType: gp2
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      MultiAZ: false
```

**Tasks**:
- [ ] Create RDS CloudFormation template
- [ ] Configure database instance
- [ ] Set up security groups
- [ ] Test database creation

#### ElastiCache Redis

**File**: `infrastructure/cloudformation/redis.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ElastiCache Redis for Alva'

Resources:
  RedisCache:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: !Sub 'alva-${Environment}-redis'
      Description: Redis cache for Alva
      Engine: redis
      NodeType: cache.t3.micro
      NumCacheNodes: 1
      AutomaticFailoverEnabled: false
      VpcSecurityGroupIds:
        - !Ref RedisSecurityGroup
      SubnetGroupName: !Ref RedisSubnetGroup
```

**Tasks**:
- [ ] Create Redis CloudFormation template
- [ ] Configure cache instance
- [ ] Set up security groups
- [ ] Test cache creation

### Day 5: ECS & Load Balancer

#### ECS Service Template

**File**: `infrastructure/cloudformation/ecs.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ECS services for Alva'

Resources:
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub 'alva-${Environment}-cluster'

  TaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: !Sub 'alva-${Environment}-task'
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      Cpu: 512
      Memory: 1024
      ContainerDefinitions:
        - Name: web
          Image: !Sub '${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest'
          PortMappings:
            - ContainerPort: 3000
              Protocol: tcp
          Environment:
            - Name: NODE_ENV
              Value: production
            - Name: DATABASE_URL
              ValueFrom: !Ref SecretsManagerSecret
```

**Tasks**:
- [ ] Create ECS cluster template
- [ ] Define task definitions for all services
- [ ] Configure container settings
- [ ] Test task definitions

---

## Week 2: Deployment & CI/CD

### Day 1-3: CI/CD Pipeline

#### Update GitHub Actions

**File**: `.github/workflows/ci.yml`

Add staging deployment job:

```yaml
deploy-staging:
  runs-on: ubuntu-latest
  needs: [docker-build]
  if: github.ref == 'refs/heads/staging'
  steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Deploy to Staging
      run: ./infrastructure/scripts/deploy.sh staging
```

**Tasks**:
- [ ] Update CI/CD workflow
- [ ] Add AWS credentials to GitHub secrets
- [ ] Configure staging deployment trigger
- [ ] Test deployment pipeline

### Day 4-5: Deployment Testing

#### Deploy to Staging

**File**: `infrastructure/scripts/deploy.sh`

```bash
#!/bin/bash

ENVIRONMENT=${1:-staging}
STACK_NAME="alva-${ENVIRONMENT}"

echo "Deploying to ${ENVIRONMENT} environment..."

# Deploy network
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/network.yml \
  --stack-name ${STACK_NAME}-network \
  --parameter-overrides Environment=${ENVIRONMENT}

# Deploy database
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/rds.yml \
  --stack-name ${STACK_NAME}-rds \
  --parameter-overrides Environment=${ENVIRONMENT}

# Deploy cache
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/redis.yml \
  --stack-name ${STACK_NAME}-redis \
  --parameter-overrides Environment=${ENVIRONMENT}

# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest -f apps/web/Dockerfile .
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest

# Deploy ECS services
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/ecs.yml \
  --stack-name ${STACK_NAME}-ecs \
  --parameter-overrides Environment=${ENVIRONMENT}

echo "Deployment complete!"
```

**Tasks**:
- [ ] Create deployment script
- [ ] Set up staging branch
- [ ] Configure environment variables
- [ ] Run test deployment
- [ ] Verify all services are running

---

## Implementation Checklist

### Week 1: Infrastructure

- [ ] Create CloudFormation templates
- [ ] Set up VPC and networking
- [ ] Configure RDS for PostgreSQL
- [ ] Configure ElastiCache for Redis
- [ ] Set up ECS cluster
- [ ] Create Application Load Balancer
- [ ] Test infrastructure deployment

### Week 2: Deployment

- [ ] Update CI/CD pipeline
- [ ] Configure GitHub secrets
- [ ] Create staging branch
- [ ] Set up deployment scripts
- [ ] Deploy to staging
- [ ] Verify staging environment
- [ ] Run smoke tests

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

After Phase 9 completion:
- Move to Phase 10: Critical User Flow Completion
- Implement chat functionality
- Complete email verification flow
- Enhance task management

