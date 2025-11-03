#!/bin/bash
# @fileoverview Script to check Resend configuration and test email sending

set -e

echo "🔍 Checking Resend Configuration..."
echo ""

# Get AWS account and region
REGION=${AWS_REGION:-us-east-1}
PROFILE=${AWS_PROFILE:-default}

echo "Region: $REGION"
echo ""

# Check if secret exists
echo "1. Checking if Resend API key secret exists..."
SECRET_NAME="alva-staging-resend-api-key"

if aws secretsmanager describe-secret --secret-id "$SECRET_NAME" --region "$REGION" --profile "$PROFILE" &>/dev/null; then
  echo "   ✅ Secret exists: $SECRET_NAME"
  
  # Check if secret has a value
  echo ""
  echo "2. Checking if secret has a value..."
  SECRET_VALUE=$(aws secretsmanager get-secret-value \
    --secret-id "$SECRET_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" \
    --query 'SecretString' \
    --output text 2>/dev/null || echo "")
  
  if [ -z "$SECRET_VALUE" ] || [ "$SECRET_VALUE" == "null" ]; then
    echo "   ❌ Secret exists but has no value!"
    echo "   Run: ./scripts/setup-aws-secrets.sh to set the Resend API key"
  else
    echo "   ✅ Secret has a value (length: ${#SECRET_VALUE} characters)"
    echo "   First 10 chars: ${SECRET_VALUE:0:10}..."
    
    # Check if it looks like a placeholder
    if [[ "$SECRET_VALUE" == *"YOUR_"* ]] || [[ "$SECRET_VALUE" == *"placeholder"* ]]; then
      echo "   ⚠️  Warning: Secret value appears to be a placeholder!"
    fi
  fi
else
  echo "   ❌ Secret does not exist: $SECRET_NAME"
  echo "   The secret should be created by the CDK Secrets stack"
  echo "   Run: cd infrastructure && cdk deploy alva-staging-secrets"
fi

echo ""
echo "3. Checking ECS task environment variables..."
echo "   (This requires the ECS stack to be deployed)"
echo "   The auth service should have:"
echo "   - NODE_ENV=production ✅"
echo "   - RESEND_API_KEY (from Secrets Manager) ✅"

echo ""
echo "4. Resend Domain Verification:"
echo "   ✅ Current default: 'Alva <noreply@alva.paulrenenichols.com>'"
echo "   Domain: paulrenenichols.com (verified in Resend)"
echo "   Subdomain: alva.paulrenenichols.com (can send from any subdomain)"
echo ""
echo "   To verify your domain in Resend (if not already done):"
echo "   1. Go to https://resend.com/domains"
echo "   2. Add and verify paulrenenichols.com"
echo "   3. Add DNS records (SPF, DKIM) as instructed by Resend"
echo "   4. Once verified, you can send from any subdomain like:"
echo "      - noreply@alva.paulrenenichols.com ✅ (current default)"
echo "      - noreply@paulrenenichols.com"
echo "      - admin@alva.paulrenenichols.com"
echo ""
echo "   To override the from address, set RESEND_FROM_EMAIL in ECS task environment"

echo ""
echo "5. To test email sending:"
echo "   - Check CloudWatch logs for auth service:"
echo "     aws logs tail /ecs/alva-staging --follow --filter-pattern 'ResendProvider'"
echo ""
echo "   - Or check Resend dashboard:"
echo "     https://resend.com/emails"

