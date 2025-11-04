# AWS IAM Setup for Phase 12 Deployment

**@fileoverview** Guide for setting up AWS IAM users and roles for Alva staging deployment, including CI/CD access and manual deployment.

---

## Quick Answer

**Yes, you should create separate IAM users/roles:**

1. **IAM User for CI/CD** (GitHub Actions) - Required
2. **IAM User for Manual Deployments** (Optional, but recommended)
3. **Never use root account** for deployments

---

## Why Separate Users?

### Security Best Practices

1. **Principle of Least Privilege**
   - Each user/role gets only the permissions it needs
   - CI/CD user doesn't need admin access
   - Personal user doesn't need CI/CD secrets

2. **Audit Trail**
   - Know exactly who/what made changes
   - CloudTrail logs show IAM user/role
   - Easier to track deployments vs manual changes

3. **Access Control**
   - Can revoke CI/CD access without affecting personal access
   - Can rotate CI/CD credentials independently
   - Can add team members later with their own users

4. **Cost Tracking**
   - Tag resources by IAM user/role
   - Track costs by deployment method

---

## Recommended Setup

### Option 1: Separate Users (Recommended) ⭐

**Create 2 IAM Users:**

1. **CI/CD User** (`alva-cicd-user`)
   - For GitHub Actions deployments
   - Limited permissions (only what CDK/ECS needs)
   - Access keys stored in GitHub Secrets

2. **Personal/Admin User** (`alva-admin-user` or your name)
   - For manual deployments and CDK development
   - Slightly broader permissions (for troubleshooting)
   - Access keys for local AWS CLI/CDK

**Pros:**
- ✅ Clear separation of concerns
- ✅ Easy to rotate CI/CD credentials
- ✅ Better security posture
- ✅ Easier to add team members

**Cons:**
- ⚠️ Need to manage 2 sets of credentials
- ⚠️ Slightly more setup

---

### Option 2: Single IAM User (Simpler)

**Create 1 IAM User** (`alva-deployment-user`)

- Used for both CI/CD and manual deployments
- Permissions for CDK, ECS, ECR, etc.

**Pros:**
- ✅ Simpler (one set of credentials)
- ✅ Less to manage

**Cons:**
- ⚠️ Less granular access control
- ⚠️ Harder to revoke just CI/CD access
- ⚠️ Shared credentials (security concern)

**Recommendation**: Use this only if you're solo and want simplicity.

---

### Option 3: Use Existing IAM User

**If you already have an IAM user** with appropriate permissions:

- You can reuse it for deployments
- Make sure it has necessary permissions
- Consider creating separate CI/CD user still

**Pros:**
- ✅ No additional setup

**Cons:**
- ⚠️ May have too many permissions
- ⚠️ Can't easily revoke CI/CD without affecting personal access

---

## IAM User Setup Guide

### Step 1: Create CI/CD User

**Purpose**: GitHub Actions deployment automation

```bash
# Create user
aws iam create-user --user-name alva-cicd-user

# Create access keys
aws iam create-access-key --user-name alva-cicd-user

# Save the keys! You'll need them for GitHub Secrets
# AccessKeyId: AKIA...
# SecretAccessKey: ...
```

**Attach Policy** (see "Required Permissions" section below)

---

### Step 2: Create Personal/Admin User (Optional)

**Purpose**: Manual deployments and CDK development

```bash
# Create user
aws iam create-user --user-name alva-admin-user

# Create access keys
aws iam create-access-key --user-name alva-admin-user

# Configure locally
aws configure --profile alva-admin
# Enter AccessKeyId and SecretAccessKey
```

**Attach Policy** (can be broader for troubleshooting)

---

## Required Permissions

### CI/CD User Permissions

**Minimum permissions for CDK + ECS deployment:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "ec2:*",
        "ecs:*",
        "ecr:*",
        "rds:*",
        "elasticache:*",
        "elasticloadbalancing:*",
        "secretsmanager:*",
        "logs:*",
        "iam:PassRole",
        "iam:GetRole",
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

**Or use AWS managed policies:**

- `PowerUserAccess` (broader, but simpler)
- Or create custom policy with only needed permissions

---

### Personal/Admin User Permissions

**Can be broader for troubleshooting:**

- `PowerUserAccess` (recommended for staging)
- Or `AdministratorAccess` (if you need full control)

**Note**: For production, use more restrictive permissions.

---

## GitHub Secrets Setup

After creating CI/CD user:

1. **Go to GitHub Repository** → Settings → Secrets and variables → Actions

2. **Add Secrets:**
   - `AWS_ACCESS_KEY_ID` = Access key from CI/CD user
   - `AWS_SECRET_ACCESS_KEY` = Secret key from CI/CD user
   - `AWS_REGION` = `us-east-1` (or your preferred region)

3. **Optional:**
   - `ECR_REGISTRY` = `YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com`
     (Will be auto-detected, but can set explicitly)

---

## Local AWS CLI Configuration

### For Personal Deployments

**Option A: Use profile**

```bash
aws configure --profile alva-admin
# AWS Access Key ID: ...
# AWS Secret Access Key: ...
# Default region: us-east-1
# Default output format: json
```

**Use with CDK:**
```bash
cd infrastructure
cdk deploy --profile alva-admin
```

**Option B: Use default profile**

```bash
aws configure
# Configure default profile
```

**Use with CDK:**
```bash
cd infrastructure
cdk deploy  # Uses default profile
```

---

## Security Best Practices

### 1. Access Key Rotation

**Rotate CI/CD keys regularly:**
- Every 90 days (recommended)
- If compromised, rotate immediately

**Process:**
1. Create new access key
2. Update GitHub Secrets
3. Delete old access key

### 2. Least Privilege

**Start restrictive, add permissions as needed:**
- Don't grant `AdministratorAccess` initially
- Use CDK to identify missing permissions
- Add specific permissions as needed

### 3. MFA (Multi-Factor Authentication)

**For admin users:**
- Enable MFA on your personal/admin IAM user
- Not needed for CI/CD (programmatic access)

### 4. Credential Storage

**Never commit credentials:**
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use AWS credentials file (`.aws/credentials`) locally
- ✅ Use `aws configure` to set up
- ❌ Never commit to git
- ❌ Never hardcode in code

---

## CDK Bootstrap (Required Once)

**Before deploying CDK stacks, bootstrap your account:**

```bash
cd infrastructure
cdk bootstrap aws://ACCOUNT-ID/us-east-1
```

**This creates:**
- S3 bucket for CDK assets
- IAM roles for CDK deployments
- CloudFormation stacks for CDK toolkit

**Note**: Requires permissions to create these resources (admin or PowerUser).

**Run once per account/region.**

---

## Permission Testing

### Test CI/CD User Permissions

**Before using in GitHub Actions:**

```bash
# Assume CI/CD user role
aws configure --profile cicd-test
# Enter CI/CD user credentials

# Test CDK operations
cd infrastructure
cdk synth --profile cicd-test  # Should work without deploying
cdk deploy --profile cicd-test --all  # Test actual deployment
```

### Common Permission Issues

**If CDK deployment fails, check:**

1. **CloudFormation permissions** - CDK uses CloudFormation
2. **IAM PassRole** - CDK creates roles for ECS tasks
3. **ECR permissions** - Need to push images
4. **ECS permissions** - Need to create services
5. **VPC/EC2 permissions** - Network infrastructure

**Error messages will indicate missing permissions.**

---

## Recommended Setup for Alva

### For Solo Developer

**Option 1: Two Users (Recommended)**
- `alva-cicd-user` - GitHub Actions only
- Your personal IAM user - Manual deployments

**Option 2: Single User (Simpler)**
- `alva-deployment-user` - Both CI/CD and manual

### For Team

**Always separate:**
- `alva-cicd-user` - GitHub Actions (shared)
- Each team member gets their own IAM user
- Admin users have broader permissions

---

## Quick Start Commands

### Create CI/CD User

```bash
# Create user
aws iam create-user --user-name alva-cicd-user

# Attach PowerUserAccess (for staging)
aws iam attach-user-policy \
  --user-name alva-cicd-user \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# Create access keys
aws iam create-access-key --user-name alva-cicd-user

# Output will show:
# AccessKeyId: AKIA...
# SecretAccessKey: ...

# Add these to GitHub Secrets!
```

### Create Personal User (Optional)

```bash
# Create user
aws iam create-user --user-name alva-admin-user

# Attach PowerUserAccess
aws iam attach-user-policy \
  --user-name alva-admin-user \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# Create access keys
aws iam create-access-key --user-name alva-admin-user

# Configure locally
aws configure --profile alva-admin
# Paste the keys
```

---

## Summary

### What You Need

1. ✅ **CI/CD User** (required)
   - For GitHub Actions
   - Access keys → GitHub Secrets
   - `PowerUserAccess` policy

2. ⚠️ **Personal User** (recommended)
   - For manual CDK deployments
   - Access keys → Local AWS config
   - `PowerUserAccess` or `AdministratorAccess`

### What You DON'T Need

- ❌ Root account access (never use for deployments)
- ❌ `AdministratorAccess` for CI/CD (overkill)
- ❌ Multiple CI/CD users (one is enough)

---

## Next Steps

1. **Create CI/CD user** with `PowerUserAccess`
2. **Create access keys** and add to GitHub Secrets
3. **Create personal user** (optional) for local development
4. **Bootstrap CDK** in your AWS account
5. **Test permissions** by running `cdk synth`

Ready to set up IAM users? I can provide the exact commands once you decide on your preferred approach!

