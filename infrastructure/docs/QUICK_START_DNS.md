# Quick Start: Cross-Account DNS Setup

**@fileoverview** Quick reference for setting up cross-account DNS

---

## Prerequisites

You need AWS CLI access to **both accounts**:
- **Management Account**: Your management account (for DNS)
- **Alva Account**: Your Alva application account

---

## Step 1: Configure Management Account Access

### If using AWS SSO:

```bash
aws sso login --profile <management-account-profile-name>
```

### If using IAM credentials:

```bash
aws configure --profile management
# Enter access key ID and secret access key for management account
```

---

## Step 2: Run Setup Script

```bash
cd infrastructure
./scripts/setup-cross-account-dns.sh
```

When prompted, enter your management account profile name.

---

## Step 3: Deploy Infrastructure (Alva Account)

After hosted zone is created, deploy your infrastructure:

```bash
# Switch to Alva account
aws sso login --profile <your-alva-profile>
# Or use your Alva account credentials

cd infrastructure
cdk deploy --all
```

---

## Step 4: Create DNS Records

After ALB is deployed, get the ALB DNS name and create records:

```bash
# Get ALB DNS name from CloudFormation outputs
ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name alva-staging-alb \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text)

# Switch to management account
aws sso login --profile <management-profile>
# Or: aws configure --profile management

# Create DNS records
cd infrastructure
./scripts/create-dns-records.sh <hosted-zone-id> $ALB_DNS us-east-1
```

Replace `<hosted-zone-id>` with the zone ID from Step 2.

---

## Manual Alternative

If you prefer to do it manually, see the full guide:
`infrastructure/docs/cross-account-dns-setup.md`

