# Cross-Account DNS Setup Guide

**@fileoverview** Guide for setting up Route53 DNS with a hosted zone in the management account pointing to resources in the Alva account.

---

## Overview

This setup allows you to use `staging.alva.paulrenenichols.com` and its subdomains for your Alva application, with the Route53 hosted zone managed in your management account while the application runs in the Alva account.

**Account Information:**

- **Management Account** (DNS): `YOUR_MANAGEMENT_ACCOUNT_ID`
- **Alva Account** (Application): `YOUR_ALVA_ACCOUNT_ID`
- **Domain**: `paulrenenichols.com` (in management account)
- **Target Domain**: `staging.alva.paulrenenichols.com`

---

## Step 1: Create Hosted Zone in Management Account

Log into your **management account** and create a hosted zone for `alva.paulrenenichols.com`:

```bash
# Switch to management account
aws configure --profile management
# Or: aws sso login --profile management

# Create hosted zone
aws route53 create-hosted-zone \
  --name alva.paulrenenichols.com \
  --caller-reference alva-$(date +%s) \
  --hosted-zone-config Comment="Alva application subdomain"

# Save the hosted zone ID from the output
# Example output: "Id": "/hostedzone/Z1234567890ABC"
```

**Save the Hosted Zone ID** - you'll need it for the next steps.

---

## Step 2: Create NS Record in Parent Zone

Add a Name Server (NS) record in your `paulrenenichols.com` hosted zone to delegate `alva.paulrenenichols.com`:

```bash
# Get the hosted zone ID for paulrenenichols.com
PARENT_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name paulrenenichols.com \
  --query 'HostedZones[0].Id' \
  --output text | cut -d'/' -f3)

# Get name servers from the new alva.paulrenenichols.com zone
ALVA_ZONE_ID="Z1234567890ABC"  # Replace with your actual zone ID
NAMESERVERS=$(aws route53 get-hosted-zone \
  --id $ALVA_ZONE_ID \
  --query 'DelegationSet.NameServers' \
  --output json)

# Create NS record in parent zone
aws route53 change-resource-record-sets \
  --hosted-zone-id $PARENT_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "alva.paulrenenichols.com",
        "Type": "NS",
        "TTL": 300,
        "ResourceRecords": '$(echo $NAMESERVERS | jq 'map({Value: .})')
      }
    }]
  }'
```

**Alternatively**, you can do this in the AWS Console:

1. Go to Route53 → Hosted zones → `paulrenenichols.com`
2. Create record → Simple routing
3. Record name: `alva`
4. Record type: `NS`
5. Value: Copy the 4 nameservers from the `alva.paulrenenichols.com` hosted zone
6. TTL: 300 (or your preference)

---

## Step 3: Set Up Cross-Account IAM Role (Recommended)

To allow the Alva account to create DNS records in the management account's hosted zone, create an IAM role:

### 3a. Create IAM Role in Management Account

```bash
# In management account
cat > /tmp/alva-dns-role-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ALVA_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "alva-staging-dns"
        }
      }
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name AlvaStagingDnsRole \
  --assume-role-policy-document file:///tmp/alva-dns-role-trust-policy.json \
  --description "Allows Alva account to create DNS records"

# Create policy for Route53 record management
cat > /tmp/alva-dns-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:GetChange",
        "route53:ListResourceRecordSets",
        "route53:GetHostedZone"
      ],
      "Resource": [
        "arn:aws:route53:::hostedzone/YOUR_HOSTED_ZONE_ID",
        "arn:aws:route53:::change/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ListHostedZones"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Replace YOUR_HOSTED_ZONE_ID with actual zone ID
sed -i.bak "s/YOUR_HOSTED_ZONE_ID/YOUR_ACTUAL_ZONE_ID/g" /tmp/alva-dns-policy.json

# Attach policy to role
aws iam put-role-policy \
  --role-name AlvaStagingDnsRole \
  --policy-name AlvaStagingDnsPolicy \
  --policy-document file:///tmp/alva-dns-policy.json

# Get the role ARN
aws iam get-role --role-name AlvaStagingDnsRole --query 'Role.Arn' --output text
```

**Save the Role ARN** - it will look like: `arn:aws:iam::YOUR_MANAGEMENT_ACCOUNT_ID:role/AlvaStagingDnsRole`

### 3b. Update Alva Account to Assume the Role

In the Alva account, you can assume this role when deploying:

```bash
# Get temporary credentials by assuming the role
aws sts assume-role \
  --role-arn arn:aws:iam::YOUR_MANAGEMENT_ACCOUNT_ID:role/AlvaStagingDnsRole \
  --role-session-name alva-cdk-deployment \
  --external-id alva-staging-dns
```

---

## Step 4: Configure Infrastructure Code

Update your environment variables or CDK configuration:

```bash
export STAGING_DOMAIN="staging.alva.paulrenenichols.com"
export HOSTED_ZONE_ID="Z1234567890ABC"  # From Step 1
export HOSTED_ZONE_ACCOUNT_ID="YOUR_MANAGEMENT_ACCOUNT_ID"
export CROSS_ACCOUNT_DNS_ROLE_ARN="arn:aws:iam::YOUR_MANAGEMENT_ACCOUNT_ID:role/AlvaStagingDnsRole"
```

---

## Step 5: Deploy Infrastructure

**Important Note on Cross-Account Route53:**

CDK's Route53 constructs create records in the account where the stack is deployed. For cross-account DNS (hosted zone in management account, records created from Alva account), you have two options:

### Option A: Manual DNS Record Creation (Recommended for now)

Deploy the infrastructure first (which will create the ALB), then manually create DNS records in the management account pointing to the ALB. See the "Alternative: Manual DNS Record Creation" section below.

### Option B: Deploy with Cross-Account Access

If you have credentials that work in both accounts or can assume roles:

```bash
cd infrastructure

# Set environment variables
export STAGING_DOMAIN="staging.alva.paulrenenichols.com"
export HOSTED_ZONE_ID="Z1234567890ABC"  # Your hosted zone ID
export HOSTED_ZONE_ACCOUNT_ID="YOUR_MANAGEMENT_ACCOUNT_ID"

# Deploy (CDK will attempt to create records if credentials allow)
cdk deploy --all

# If this fails due to permissions, use Option A (manual creation)
```

**Note**: CDK's Route53 `ARecord` construct may fail when creating records in a cross-account hosted zone. If this happens, use the manual approach (Option A) instead.

---

## Alternative: Manual DNS Record Creation (Recommended)

**This is the recommended approach** for cross-account DNS setup, as it's simpler and more reliable than trying to use CDK's Route53 constructs across accounts.

After the ALB stack is deployed in the Alva account, manually create DNS records in the management account:

### After ALB Deployment

1. **Get the ALB DNS name** from the CDK output (deploy from Alva account):

   ```bash
   # Switch to Alva account
   aws configure --profile alva
   # Or: aws sso login --profile alva-account

   # Get ALB DNS name
   ALB_DNS=$(aws cloudformation describe-stacks \
     --stack-name alva-staging-alb \
     --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
     --output text)

   echo "ALB DNS: $ALB_DNS"
   ```

2. **Get the ALB Zone ID** (this is a constant per region):

   - us-east-1: `Z35SXDOTRQ7X7K`
   - See full list: https://docs.aws.amazon.com/general/latest/gr/elb.html

3. **Switch to management account** and create alias records:

```bash
# Switch to management account
aws configure --profile management
# Or: aws sso login --profile management

# Set variables
ALVA_ZONE_ID="Z1234567890ABC"  # Your alva.paulrenenichols.com hosted zone ID
ALB_DNS="your-alb-dns-name.elb.us-east-1.amazonaws.com"  # From step 1
ALB_ZONE_ID="Z35SXDOTRQ7X7K"  # ALB zone ID for us-east-1

# Create alias record for staging.alva.paulrenenichols.com (web app)
aws route53 change-resource-record-sets \
  --hosted-zone-id $ALVA_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "'$ALB_DNS'",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "'$ALB_ZONE_ID'"
        }
      }
    }]
  }'

# Create alias record for api.staging.alva.paulrenenichols.com
aws route53 change-resource-record-sets \
  --hosted-zone-id $ALVA_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "'$ALB_DNS'",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "'$ALB_ZONE_ID'"
        }
      }
    }]
  }'

# Create alias record for auth.staging.alva.paulrenenichols.com
aws route53 change-resource-record-sets \
  --hosted-zone-id $ALVA_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "auth.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "'$ALB_DNS'",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "'$ALB_ZONE_ID'"
        }
      }
    }]
  }'

# Create alias record for admin.staging.alva.paulrenenichols.com
aws route53 change-resource-record-sets \
  --hosted-zone-id $ALVA_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "admin.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "'$ALB_DNS'",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "'$ALB_ZONE_ID'"
        }
      }
    }]
  }'
```

**Or use the helper script:**

```bash
# From the infrastructure directory
cd infrastructure

# Make sure you're authenticated to the management account
aws configure --profile management
# Or: aws sso login --profile management

# Run the script (it will prompt for confirmation)
./scripts/create-dns-records.sh Z1234567890ABC your-alb-dns-name.elb.us-east-1.amazonaws.com us-east-1
```

**Or create all records manually at once:**

```bash
# Create a JSON file with all changes
cat > /tmp/dns-records.json <<EOF
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "${ALB_DNS}",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "${ALB_ZONE_ID}"
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "${ALB_DNS}",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "${ALB_ZONE_ID}"
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "auth.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "${ALB_DNS}",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "${ALB_ZONE_ID}"
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "admin.staging.alva.paulrenenichols.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "${ALB_DNS}",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "${ALB_ZONE_ID}"
        }
      }
    }
  ]
}
EOF

# Apply all changes
aws route53 change-resource-record-sets \
  --hosted-zone-id $ALVA_ZONE_ID \
  --change-batch file:///tmp/dns-records.json
```

**ALB Zone IDs by Region:**

- us-east-1: `Z35SXDOTRQ7X7K`
- us-west-2: `Z1H1FL5HABSF5`
- eu-west-1: `Z32O12OCRQLOVW`
- See full list: https://docs.aws.amazon.com/general/latest/gr/elb.html

---

## Verification

After setup, verify DNS resolution:

```bash
# Check DNS resolution
dig staging.alva.paulrenenichols.com
dig api.staging.alva.paulrenenichols.com
dig auth.staging.alva.paulrenenichols.com
dig admin.staging.alva.paulrenenichols.com

# Or using nslookup
nslookup staging.alva.paulrenenichols.com
```

---

## Troubleshooting

### Issue: DNS records not creating

**Solution:** Ensure you have the correct permissions. For cross-account, you need to either:

1. Use IAM role assumption
2. Have credentials that work in both accounts
3. Create records manually in management account

### Issue: DNS not resolving

**Check:**

1. NS record exists in parent zone (`paulrenenichols.com`)
2. Nameservers match between parent NS record and `alva.paulrenenichols.com` zone
3. DNS propagation may take up to 48 hours (usually much faster)

### Issue: Cross-account role assumption fails

**Check:**

1. Role ARN is correct
2. External ID matches in trust policy and assume-role call
3. Alva account is allowed in trust policy (check the Principal ARN matches your account ID)

---

## Quick Reference

**Management Account**: `YOUR_MANAGEMENT_ACCOUNT_ID`
**Alva Account**: `YOUR_ALVA_ACCOUNT_ID`
**Parent Domain**: `paulrenenichols.com`
**Subdomain Zone**: `alva.paulrenenichols.com`
**Application Domain**: `staging.alva.paulrenenichols.com`

**Subdomains:**

- `staging.alva.paulrenenichols.com` → Web app
- `api.staging.alva.paulrenenichols.com` → API service
- `auth.staging.alva.paulrenenichols.com` → Auth service
- `admin.staging.alva.paulrenenichols.com` → Admin app
