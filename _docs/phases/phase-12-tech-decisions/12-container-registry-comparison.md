# Container Registry Comparison: ECR vs GitHub Container Registry (GHCR)

**@fileoverview** Detailed comparison of container registry options for Alva's AWS deployment, with recommendations for ECS Fargate deployment.

---

## Quick Decision Matrix

| Criteria             | ECR (AWS)                             | GHCR (GitHub)               |
| -------------------- | ------------------------------------- | --------------------------- |
| **AWS Integration**  | ✅ Native                             | ⚠️ External                 |
| **ECS Performance**  | ✅ Fastest (same region)              | ⚠️ Slightly slower          |
| **Image Scanning**   | ✅ Automatic (vulnerability scanning) | ⚠️ Basic scanning           |
| **Cost**             | ✅ $0.10/GB/month (first 500MB free)  | ✅ Free (public repos)      |
| **Authentication**   | ✅ IAM-based (secure)                 | ⚠️ GitHub tokens            |
| **Setup Complexity** | ⚠️ Requires ECR setup                 | ✅ Already configured       |
| **Image Pull Speed** | ✅ Fastest (AWS backbone)             | ⚠️ Depends on CDN           |
| **Access Control**   | ✅ IAM policies                       | ✅ GitHub permissions       |
| **Compliance**       | ✅ AWS compliance tools               | ⚠️ GitHub's compliance      |
| **Best For**         | AWS-native deployments                | Multi-cloud, GitHub-centric |

---

## Detailed Comparison

### 1. Amazon ECR (Elastic Container Registry)

#### Pros ✅

**Native AWS Integration**

- Seamless ECS integration (automatic authentication)
- IAM-based access control (no token management)
- Integrated with CloudWatch (image push/pull metrics)
- Works with AWS App Runner, Lambda, Batch
- Automatic encryption at rest
- VPC endpoints available (no internet traffic)

**Performance & Reliability**

- Fastest image pulls (same AWS backbone as ECS)
- Multi-region replication available
- 99.9% SLA
- Private networking option (VPC endpoints)
- Regional availability

**Security Features**

- Automatic vulnerability scanning (Amazon Inspector)
- Image lifecycle policies (auto-delete old images)
- Resource-level permissions (per-repo policies)
- KMS encryption for images
- Integration with AWS Security Hub

**Cost Efficiency**

- First 500MB/month free (per account)
- $0.10/GB/month storage
- Data transfer within AWS is free
- Image scanning: $0.10/image (first scan), free for subsequent scans
- For staging (small images, infrequent changes): **~$2-5/month**

**Developer Experience**

- `aws ecr get-login-password` command built-in
- Docker credential helper available
- GitHub Actions plugin: `aws-actions/amazon-ecr-login@v2`

#### Cons ❌

**Setup Overhead**

- Need to create repositories (4 repos for our services)
- Need to configure IAM roles/permissions
- GitHub Actions needs AWS credentials
- Additional setup step in CI/CD

**Vendor Lock-in**

- AWS-only (though can pull from anywhere)
- Less portable if switching clouds

**Cost at Scale**

- Can get expensive with many large images
- Scanning costs add up with frequent builds

#### Example Setup

```bash
# Create ECR repositories
aws ecr create-repository --repository-name alva-web
aws ecr create-repository --repository-name alva-api
aws ecr create-repository --repository-name alva-auth
aws ecr create-repository --repository-name alva-admin

# Get login token
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker tag alva-web:latest \
  ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest
docker push ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest
```

**GitHub Actions Integration:**

```yaml
- name: Login to Amazon ECR
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and push
  run: |
    docker build -t $ECR_REGISTRY/alva-web:$GITHUB_SHA .
    docker push $ECR_REGISTRY/alva-web:$GITHUB_SHA
```

---

### 2. GitHub Container Registry (GHCR)

#### Pros ✅

**Already Configured**

- Your GitHub Actions already builds to GHCR
- No additional setup needed
- Familiar workflow

**Simplicity**

- Free for public repositories
- Integrated with GitHub (one less service)
- Uses GitHub tokens (already have access)
- GitHub Packages UI shows images

**Cost**

- **Free** for public repositories
- Private repos: $5/month for storage + bandwidth

**Multi-Cloud Friendly**

- Works with any container platform
- Not AWS-specific (more portable)

#### Cons ❌

**AWS Integration**

- External service (not AWS-native)
- Requires internet access from ECS (no VPC endpoints)
- Image pulls go through public internet
- Slightly slower than ECR (especially on cold pulls)
- Need GitHub token management in ECS

**Security Considerations**

- GitHub tokens stored in ECS task definitions (Secrets Manager)
- Less granular access control than IAM
- No automatic vulnerability scanning
- External dependency (GitHub availability affects pulls)

**ECS Performance**

- Images pulled from GitHub's CDN
- First pull slower (cold cache)
- Not optimized for AWS regions

**Cost at Scale**

- Private repos cost money
- Bandwidth costs for large images
- Less predictable pricing

#### Example Setup

```bash
# Already done in your CI!
# GitHub Actions automatically pushes to GHCR

# To pull in ECS, you need:
# 1. GitHub Personal Access Token (PAT) stored in Secrets Manager
# 2. Configure ECS task definition to use GHCR image
# 3. Authenticate ECS to GHCR (complex setup)
```

**ECS Task Definition (GHCR):**

```json
{
  "containerDefinitions": [
    {
      "name": "web",
      "image": "ghcr.io/yourusername/alva-web:latest",
      "repositoryCredentials": {
        "credentialsParameter": "arn:aws:secretsmanager:...:github-pat"
      }
    }
  ]
}
```

**Complexity**: Requires PAT management, Secrets Manager setup, token rotation.

---

## Context-Specific Analysis for Alva

### Your Current Setup

✅ **GitHub Actions**: Already building images  
✅ **4 Services**: web, api, auth, admin  
✅ **AWS Deployment**: ECS Fargate only  
✅ **Staging Environment**: Low traffic initially

### Key Considerations

#### 1. Performance Requirements

**For Staging:**

- Low traffic = performance less critical
- GHCR acceptable (slight delay on first pull)
- ECR faster but not critical for staging

**For Production:**

- Higher traffic = performance matters
- ECR significantly faster
- Private networking (VPC endpoints) possible

#### 2. Setup Complexity

**ECR:**

- One-time setup (create 4 repos)
- Add ECR login to GitHub Actions (~5 minutes)
- Configure IAM role for ECS (~10 minutes)
- **Total: ~15-20 minutes**

**GHCR:**

- Already configured ✅
- But need PAT management for ECS
- Need to store tokens in Secrets Manager
- **Additional: ~20-30 minutes** (but simpler since already using GHCR)

#### 3. Cost Analysis

**ECR (Staging):**

- Storage: ~2GB images = $0.20/month
- Scanning: ~4 images/week = $1.60/month (first scan), $0.40/month (subsequent)
- Data transfer: Free within AWS
- **Total: ~$1-2/month**

**GHCR:**

- Public repos: **$0/month** ✅
- Private repos: $5/month base + bandwidth

**Verdict**: Both are essentially free for staging.

#### 4. Security Requirements

**ECR Advantages:**

- IAM-based (no token rotation needed)
- Automatic vulnerability scanning
- KMS encryption
- VPC endpoints (private networking)
- AWS compliance tools

**GHCR:**

- GitHub tokens need rotation
- Manual security scanning (if any)
- Public internet access required

#### 5. Developer Experience

**ECR:**

- Cleaner ECS integration
- No token management in ECS
- Better AWS console visibility
- Native AWS tooling

**GHCR:**

- Already working in CI ✅
- Familiar (GitHub-native)
- One less AWS service to manage

---

## Hybrid Approach (Recommended)

### Option: Use Both During Migration

**Phase 1: Start with GHCR** (immediate)

- Already configured
- Quick to deploy
- No additional setup

**Phase 2: Migrate to ECR** (before production)

- Set up ECR repositories
- Update GitHub Actions to push to both
- Gradually migrate ECS services
- Full migration before production launch

**Benefits:**

- Deploy staging quickly
- Learn ECR at your own pace
- Have backup registry (disaster recovery)
- Test ECR integration before production

---

## Recommendation

### For Staging (Now): **GHCR** ⭐

**Why:**

- Already configured ✅
- Zero additional setup
- Free for public repos
- Fast enough for staging
- Can migrate later

**Action:**

- Keep using GHCR for staging
- Use GitHub PAT stored in AWS Secrets Manager
- Document the token rotation process

### For Production (Later): **ECR** ⭐

**Why:**

- Better performance
- Native AWS integration
- Automatic vulnerability scanning
- Better security (IAM-based)
- VPC endpoints available

**Action:**

- Set up ECR repositories when ready for production
- Update CI/CD to push to ECR
- Migrate ECS services to ECR images

---

## Implementation Details

### Using GHCR with ECS (Staging)

#### Step 1: Create GitHub PAT

```bash
# GitHub → Settings → Developer settings → Personal access tokens
# Create token with: read:packages scope
```

#### Step 2: Store in AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name github-container-registry-pat \
  --secret-string '{"username":"yourusername","password":"ghp_..."}'
```

#### Step 3: Update ECS Task Definition

```json
{
  "containerDefinitions": [
    {
      "name": "web",
      "image": "ghcr.io/yourusername/alva-web:latest",
      "repositoryCredentials": {
        "credentialsParameter": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:github-container-registry-pat"
      }
    }
  ]
}
```

#### Step 4: Grant ECS Access to Secret

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:github-container-registry-pat*"
    }
  ]
}
```

### Using ECR (Production - Future)

#### Step 1: Create Repositories (CDK)

```typescript
import * as ecr from 'aws-cdk-lib/aws-ecr';

const webRepo = new ecr.Repository(this, 'WebRepo', {
  repositoryName: 'alva-web',
  imageScanOnPush: true,
  lifecycleRules: [
    {
      maxImageCount: 10,
    },
  ],
});
```

#### Step 2: Update GitHub Actions

```yaml
- name: Login to Amazon ECR
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and push to ECR
  run: |
    docker build -t $ECR_REGISTRY/alva-web:$GITHUB_SHA .
    docker push $ECR_REGISTRY/alva-web:$GITHUB_SHA
```

#### Step 3: ECS Task Definition (No auth needed!)

```json
{
  "containerDefinitions": [
    {
      "name": "web",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest"
      // No repositoryCredentials needed! IAM handles it.
    }
  ]
}
```

**Much simpler!**

---

## Cost Comparison

### Staging (4 services, ~500MB images each = 2GB total)

| Service       | ECR             | GHCR         |
| ------------- | --------------- | ------------ |
| Storage       | $0.20/month     | $0 (public)  |
| Scanning      | $0.40/month     | $0           |
| Data Transfer | $0              | $0           |
| **Total**     | **$0.60/month** | **$0/month** |

### Production (higher traffic, larger images)

| Service        | ECR              | GHCR                              |
| -------------- | ---------------- | --------------------------------- |
| Storage (10GB) | $1/month         | $0 (public) or $5/month (private) |
| Scanning       | $1.60/month      | $0                                |
| Data Transfer  | $0               | Variable                          |
| **Total**      | **~$2.60/month** | **$0-5+/month**                   |

**Verdict**: Both are cheap, but ECR has predictable pricing.

---

## Security Comparison

| Feature                | ECR                     | GHCR                      |
| ---------------------- | ----------------------- | ------------------------- |
| Encryption at rest     | ✅ KMS                  | ✅ GitHub-managed         |
| Encryption in transit  | ✅ TLS                  | ✅ TLS                    |
| Access control         | ✅ IAM (granular)       | ✅ GitHub permissions     |
| Vulnerability scanning | ✅ Automatic            | ⚠️ Manual/Dependabot      |
| Token rotation         | ✅ Not needed           | ⚠️ Manual (every 90 days) |
| Private networking     | ✅ VPC endpoints        | ❌ Public internet        |
| Compliance             | ✅ AWS compliance tools | ⚠️ GitHub's compliance    |

---

## Decision Framework

Answer these questions:

1. **Do you want to deploy staging immediately?**

   - Yes → **GHCR** (already configured)
   - No → ECR

2. **Is setup time a concern?**

   - Yes → **GHCR** (zero setup)
   - No → ECR (better long-term)

3. **Do you need best-in-class security for staging?**

   - Yes → ECR
   - No → **GHCR** (adequate for staging)

4. **Are you committed to AWS long-term?**

   - Yes → **ECR** (better integration)
   - Unsure → GHCR (more portable)

5. **Do you want automatic vulnerability scanning?**
   - Yes → **ECR**
   - No → GHCR (manual/Dependabot)

---

## Final Recommendation for Alva

### Staging: **Use GHCR** ✅

**Rationale:**

- Already configured
- Free for public repos
- Fast enough for staging
- Zero additional setup time
- Can migrate to ECR before production

**Implementation:**

- Store GitHub PAT in Secrets Manager
- Configure ECS task definitions to use GHCR images
- Document token rotation process

### Production: **Migrate to ECR** (Later)

**Rationale:**

- Better performance
- Native AWS integration
- Automatic security scanning
- Simpler authentication (IAM)
- Better suited for production workloads

**Timeline:**

- Use GHCR for staging (now)
- Set up ECR when preparing for production
- Migrate services to ECR before production launch

---

## Next Steps

1. **Choose registry for staging**: GHCR (recommended) or ECR
2. **If GHCR**: Set up PAT and Secrets Manager
3. **If ECR**: Create repositories and update CI/CD
4. **Document**: Token management and image tagging strategy
5. **Plan**: ECR migration timeline for production

---

Would you like me to:

1. Set up GHCR authentication for ECS staging deployment?
2. Create ECR repositories and update CI/CD for ECR?
3. Implement the hybrid approach (both registries)?
