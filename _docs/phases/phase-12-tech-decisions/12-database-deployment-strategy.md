# Database Deployment Strategy: RDS vs Container vs EC2

**@fileoverview** Comparison of database deployment options for Alva staging environment: AWS RDS (managed) vs PostgreSQL container in ECS vs EC2.

---

## Quick Decision Matrix

| Criteria | RDS PostgreSQL | PostgreSQL Container (ECS) | PostgreSQL (EC2) |
|----------|---------------|----------------------------|------------------|
| **Cost (Staging)** | ~$15/month (db.t3.micro) | ~$10/month (Fargate) | ~$10/month (t3.micro) |
| **Setup Complexity** | ✅ Simple | ⚠️ Medium | ❌ Complex |
| **Backups** | ✅ Automatic | ❌ Manual | ❌ Manual |
| **Scaling** | ✅ Easy | ⚠️ Manual | ❌ Manual |
| **Monitoring** | ✅ CloudWatch | ⚠️ Manual | ⚠️ Manual |
| **Patching** | ✅ Automatic | ❌ Manual | ❌ Manual |
| **High Availability** | ✅ Multi-AZ | ❌ Single container | ❌ Single instance |
| **Maintenance** | ✅ Managed | ❌ Self-managed | ❌ Self-managed |
| **Best For** | Production + Staging | Development/Testing | Legacy apps |

---

## Option 1: AWS RDS PostgreSQL ⭐ **RECOMMENDED**

### Architecture

```
RDS PostgreSQL Instance
├── db.t3.micro (1 vCPU, 1GB RAM)
├── 20GB storage (gp2)
├── Automated backups (7 days retention)
├── Automatic minor version patching
└── CloudWatch monitoring
```

### Pros ✅

**Managed Service**
- **Automatic backups**: Daily snapshots, point-in-time recovery
- **Automatic patching**: Minor version updates applied automatically
- **Monitoring**: CloudWatch metrics built-in
- **Alerts**: Configurable alarms for CPU, memory, disk
- **No server management**: AWS handles OS, PostgreSQL updates

**Reliability & Availability**
- Multi-AZ support (for production)
- Automatic failover (with Multi-AZ)
- High availability options
- 99.95% SLA (Multi-AZ)

**Security**
- Encryption at rest (KMS)
- Encryption in transit (SSL/TLS)
- VPC security groups
- Automated security updates
- Compliance certifications

**Scaling**
- Easy instance size changes (with downtime)
- Storage auto-scaling
- Read replicas for read scaling
- Parameter group tuning

**Operational Benefits**
- No database server to manage
- No Docker container orchestration
- Focus on application, not infrastructure
- AWS support for RDS issues

**Migration Path**
- Can use same setup for production
- Easy to promote staging → production
- Database snapshots for cloning

### Cons ❌

**Cost**
- More expensive than container ($15/month vs $10/month)
- Storage costs extra (gp2: $0.115/GB/month)
- Backup storage costs (varies)

**Less Control**
- Can't customize PostgreSQL config as easily
- Fixed instance sizes (can't do fractional CPU)
- Less control over OS

**Scaling Limitations**
- Vertical scaling requires downtime
- Storage scaling easier than compute scaling

### Cost Breakdown (Staging)

| Item | Cost |
|------|------|
| db.t3.micro instance | $15/month |
| 20GB storage (gp2) | $2.30/month |
| Backup storage (7 days, ~5GB) | $0.58/month |
| **Total** | **~$18/month** |

**Production (db.t3.small, Multi-AZ):**
- Instance: $50/month (with Multi-AZ)
- Storage: $5/month
- Backups: $1/month
- **Total: ~$56/month**

### CDK Implementation

```typescript
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

// Database subnet group
const dbSubnetGroup = new rds.SubnetGroup(this, 'DBSubnetGroup', {
  vpc,
  description: 'Subnet group for Alva database',
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
});

// Database instance
const database = new rds.DatabaseInstance(this, 'Database', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_16,
  }),
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO
  ),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
  databaseName: 'alva',
  credentials: rds.Credentials.fromGeneratedSecret('admin'),
  allocatedStorage: 20,
  storageType: rds.StorageType.GP2,
  backupRetention: Duration.days(7),
  deletionProtection: false, // true for production
  multiAz: false, // true for production
  removalPolicy: RemovalPolicy.DESTROY, // SNAPSHOT for production
  subnetGroup: dbSubnetGroup,
});
```

**Lines of Code**: ~30 lines (very simple!)

---

## Option 2: PostgreSQL Container in ECS Fargate

### Architecture

```
ECS Fargate Task
├── PostgreSQL 16 container
├── EBS volume (persistent storage)
├── ECS service (1 task)
└── Manual backup strategy
```

### Pros ✅

**Cost**
- Cheaper than RDS (~$10/month for Fargate task)
- Pay only for compute used
- No RDS licensing overhead

**Control**
- Full control over PostgreSQL configuration
- Can customize postgresql.conf
- Can use any PostgreSQL version/image
- Can add extensions easily

**Flexibility**
- Can run multiple databases in same container
- Can add custom tools/scripts
- Can use custom base images

**Same Platform**
- All services in ECS (unified platform)
- Same deployment pipeline
- Consistent with app services

### Cons ❌

**Operational Overhead**
- **Manual backups**: Need to set up backup script/container
- **Manual patching**: Update container image manually
- **No automatic failover**: Single task = single point of failure
- **Storage management**: Need to manage EBS volumes
- **Monitoring**: Need to set up CloudWatch metrics manually

**Reliability**
- No automatic failover
- No Multi-AZ support
- Container restarts = potential data loss (if not careful)
- EBS volume failures = data loss risk

**Scaling**
- Manual task scaling
- No read replicas (would need to implement)
- Storage scaling is manual

**Complexity**
- Need to manage container lifecycle
- Need to handle database initialization
- Need to configure health checks
- Need to set up backup automation

### Cost Breakdown (Staging)

| Item | Cost |
|------|------|
| ECS Fargate (0.5 vCPU, 1GB RAM) | ~$10/month |
| EBS volume (20GB gp2) | $2.30/month |
| ECS service | $0 (included) |
| **Total** | **~$12/month** |

**Slightly cheaper**, but more operational work.

### CDK Implementation

```typescript
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs'; // Or EBS

// ECS task definition for PostgreSQL
const postgresTask = new ecs.FargateTaskDefinition(this, 'PostgresTask', {
  cpu: 512,
  memoryLimitMiB: 1024,
});

// Add PostgreSQL container
postgresTask.addContainer('Postgres', {
  image: ecs.ContainerImage.fromRegistry('postgres:16-alpine'),
  environment: {
    POSTGRES_DB: 'alva',
    POSTGRES_USER: 'admin',
  },
  secrets: {
    POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(dbPassword),
  },
  logging: ecs.LogDrivers.awsLogs({
    streamPrefix: 'postgres',
  }),
});

// ECS service
const postgresService = new ecs.FargateService(this, 'PostgresService', {
  cluster,
  taskDefinition: postgresTask,
  desiredCount: 1,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
});

// Need to add:
// - EBS volume for persistent storage
// - Backup automation (Lambda + ECS task)
// - Health checks
// - Monitoring/alerts
```

**Lines of Code**: ~50+ lines (more complex)

**Additional Setup Needed:**
- EBS volume attachment
- Backup automation script/container
- CloudWatch metrics/alarms
- Health check configuration
- Initialization scripts

---

## Option 3: PostgreSQL on EC2

### Architecture

```
EC2 Instance (t3.micro)
├── PostgreSQL 16 installed
├── EBS volume (root + data)
├── Manual setup & maintenance
└── SSH access required
```

### Pros ✅

**Control**
- Full server control
- Can customize everything
- Root access

**Cost**
- ~$10/month (t3.micro)
- Similar to container cost

### Cons ❌

**High Operational Overhead**
- Manual OS updates
- Manual PostgreSQL updates
- Manual security patches
- SSH key management
- Server monitoring
- Backup automation
- Disaster recovery planning

**Not Recommended**
- Much more work than RDS or ECS
- Higher risk of misconfiguration
- Security concerns (exposed SSH)
- Not aligned with container-first approach

**Verdict**: ❌ **Not recommended** for modern deployments

---

## Detailed Comparison

### 1. Operational Complexity

**RDS:**
- ✅ Create instance → Done
- ✅ Backups automatic
- ✅ Patching automatic
- ✅ Monitoring automatic
- **Effort**: 1 hour setup, then hands-off

**ECS Container:**
- ⚠️ Create task definition
- ⚠️ Set up EBS volume
- ❌ Write backup script
- ❌ Set up backup automation
- ❌ Configure monitoring
- ❌ Handle patching
- **Effort**: 4-8 hours setup + ongoing maintenance

**EC2:**
- ❌ Launch instance
- ❌ Install PostgreSQL
- ❌ Configure PostgreSQL
- ❌ Set up backups
- ❌ Configure monitoring
- ❌ Handle all updates
- **Effort**: 8+ hours setup + constant maintenance

**Verdict**: RDS is by far the simplest.

### 2. Reliability & Data Safety

**RDS:**
- ✅ Automatic daily backups
- ✅ Point-in-time recovery
- ✅ Multi-AZ option
- ✅ Automatic failover
- ✅ Storage encryption
- ✅ 99.95% SLA (Multi-AZ)

**ECS Container:**
- ⚠️ Manual backups (if set up)
- ❌ No point-in-time recovery
- ❌ No automatic failover
- ⚠️ Storage encryption (if configured)
- ⚠️ Lower reliability

**EC2:**
- ❌ Manual backups
- ❌ Single point of failure
- ⚠️ Storage encryption (if configured)
- ❌ Lower reliability

**Verdict**: RDS is much more reliable.

### 3. Cost Analysis (1 Year)

**RDS (Staging):**
- Year 1: $18/month × 12 = **$216/year**
- Includes: Backups, monitoring, patching, support

**ECS Container (Staging):**
- Year 1: $12/month × 12 = **$144/year**
- Plus: Your time for backups, patching, monitoring (~4 hours/month = ~$200-400 in time)
- **Total**: $144 + time = **$344-544/year**

**Verdict**: RDS is cheaper when you factor in time.

### 4. Migration to Production

**RDS:**
- ✅ Same platform for staging and production
- ✅ Easy to promote snapshots
- ✅ Same operational model
- ✅ Can enable Multi-AZ easily

**ECS Container:**
- ⚠️ Need to replicate setup
- ⚠️ Different operational model
- ⚠️ Need to plan for production differently

**Verdict**: RDS provides better migration path.

---

## Recommendation

### For Staging: **AWS RDS PostgreSQL** ⭐ **STRONGLY RECOMMENDED**

**Primary Reasons:**

1. **Operational Simplicity**
   - Set it and forget it
   - Automatic backups, patching, monitoring
   - Focus on application, not database ops

2. **Cost-Effective When Time is Valued**
   - $6/month more than container ($18 vs $12)
   - But saves 4+ hours/month of maintenance
   - Worth it for most teams

3. **Data Safety**
   - Automatic backups with point-in-time recovery
   - No risk of data loss from container restarts
   - Better disaster recovery

4. **Production-Ready**
   - Same platform for staging and production
   - Easy migration path
   - Can test production-like setup in staging

5. **AWS-Native**
   - Best integration with other AWS services
   - CloudWatch metrics and alarms
   - Secrets Manager integration

**When to Consider Container Instead:**
- Very tight budget (every dollar counts)
- Need custom PostgreSQL config that RDS doesn't support
- Need multiple databases in one container
- Team has strong DevOps skills and time to maintain

---

## Implementation Plan

### If Choosing RDS:

1. **Create RDS subnet group** (CDK)
2. **Create RDS instance** (db.t3.micro)
3. **Store credentials** in Secrets Manager
4. **Configure security groups** (ECS → RDS access)
5. **Set up CloudWatch alarms**
6. **Test connection** from ECS services

**Estimated Time**: 1-2 hours

### If Choosing Container:

1. **Create ECS task definition** for PostgreSQL
2. **Set up EBS volume** for persistent storage
3. **Create ECS service** (1 task)
4. **Write backup script** (Lambda or ECS task)
5. **Set up backup automation** (EventBridge schedule)
6. **Configure CloudWatch metrics/alarms**
7. **Test connection** from app services

**Estimated Time**: 4-8 hours + ongoing maintenance

---

## Cost Summary

| Option | Monthly | Yearly | Notes |
|--------|---------|--------|-------|
| **RDS db.t3.micro** | $18 | $216 | Recommended |
| **ECS Container** | $12 | $144 | + ~$200-400 in time |
| **EC2 t3.micro** | $10 | $120 | + ~$400-600 in time |

**Verdict**: RDS is the best value.

---

## Final Recommendation for Alva

### ✅ **Use AWS RDS PostgreSQL**

**For Staging:**
- Instance: `db.t3.micro`
- Storage: 20GB gp2
- Backups: 7 days retention
- Multi-AZ: false (can enable later)
- Cost: ~$18/month

**For Production (Later):**
- Instance: `db.t3.small` or larger
- Storage: 50GB+ gp2
- Backups: 30 days retention
- Multi-AZ: true
- Cost: ~$50-100/month

**Benefits:**
- Focus on application development, not database ops
- Automatic backups protect your data
- Easy migration from staging to production
- Production-ready from day one

---

Would you like me to:
1. Proceed with RDS (recommended)?
2. Set up container-based PostgreSQL?
3. Create detailed implementation guide for either option?

