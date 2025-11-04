#!/bin/bash
# @fileoverview Simple script to add Resend DNS records - fill in the values below
# Usage: Edit the variables below with your Resend DNS records, then run this script

set -e

# AWS Configuration
PROFILE=${AWS_PROFILE:-default}
ZONE_ID=${HOSTED_ZONE_ID}
DOMAIN=${DOMAIN_NAME:-paulrenenichols.com}

if [ -z "$ZONE_ID" ]; then
  echo "❌ Error: HOSTED_ZONE_ID environment variable is required"
  echo "Usage: HOSTED_ZONE_ID=<zone-id> DOMAIN_NAME=<domain> [AWS_PROFILE=<profile>] $0"
  exit 1
fi

# ============================================
# RESEND DNS CONFIGURATION
# ============================================

# DKIM Record (TXT) - Required for Resend
DKIM_NAME="resend._domainkey"
DKIM_VALUE="p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCslXm/p8htdRDZu6+9ycwLHjGhiUtCocULGNFZ7zY7SnhKOiRdG8T+TL7g0vSZPp7wWF+QIgKGDbVdn9qJg6tMZkvsc3sikqHmUr9ueAjFqEqTjI4DuQSuxlvkkj1s6KMisbznUCkPZzEdOMKXezijv1hsMojkppum62Oj96MbFQIDAQAB"

# MX Record for send subdomain (feedback loop)
MX_NAME="send"
MX_PRIORITY=10
MX_VALUE="feedback-smtp.us-east-1.amazonses.com"

# SPF Record (TXT) for send subdomain
SPF_NAME="send"
SPF_VALUE="v=spf1 include:amazonses.com ~all"

# DMARC Record (TXT) - Optional but recommended
DMARC_VALUE="v=DMARC1; p=none;"

# ============================================
# DO NOT EDIT BELOW THIS LINE
# ============================================

echo "🔧 Adding Resend DNS records for $DOMAIN"
echo "Hosted Zone: $ZONE_ID"
echo ""

# Build changes array
CHANGES="["
FIRST=true

# Add DKIM record (TXT)
if [ -n "$DKIM_NAME" ] && [ -n "$DKIM_VALUE" ]; then
  if [ "$FIRST" = false ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$DKIM_NAME.$DOMAIN\",
      \"Type\": \"TXT\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"\\\"$DKIM_VALUE\\\"\"
        }
      ]
    }
  }"
  FIRST=false
fi

# Add MX record for send subdomain
if [ -n "$MX_NAME" ] && [ -n "$MX_VALUE" ]; then
  if [ "$FIRST" = false ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$MX_NAME.$DOMAIN\",
      \"Type\": \"MX\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"$MX_PRIORITY $MX_VALUE\"
        }
      ]
    }
  }"
  FIRST=false
fi

# Add SPF record for send subdomain
if [ -n "$SPF_NAME" ] && [ -n "$SPF_VALUE" ]; then
  if [ "$FIRST" = false ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$SPF_NAME.$DOMAIN\",
      \"Type\": \"TXT\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"\\\"$SPF_VALUE\\\"\"
        }
      ]
    }
  }"
  FIRST=false
fi

# Add DMARC record
if [ -n "$DMARC_VALUE" ]; then
  if [ "$FIRST" = false ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"_dmarc.$DOMAIN\",
      \"Type\": \"TXT\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"\\\"$DMARC_VALUE\\\"\"
        }
      ]
    }
  }"
fi

CHANGES+="
]"

# Create change batch
CHANGE_BATCH="{
  \"Comment\": \"Add Resend DNS verification records for $DOMAIN\",
  \"Changes\": $CHANGES
}"

# Save to temp file
TEMP_FILE=$(mktemp)
echo "$CHANGE_BATCH" > "$TEMP_FILE"

echo "📋 DNS Records to add:"
cat "$TEMP_FILE" | jq '.' 2>/dev/null || cat "$TEMP_FILE"
echo ""

read -p "Continue and add these records? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Cancelled."
  rm "$TEMP_FILE"
  exit 0
fi

echo ""
echo "🚀 Adding DNS records to Route53..."

CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "file://$TEMP_FILE" \
  --profile "$PROFILE" \
  --query 'ChangeInfo.Id' \
  --output text)

echo "✅ DNS records added successfully!"
echo "Change ID: $CHANGE_ID"
echo ""
echo "⏳ DNS propagation may take a few minutes (usually 5-15 minutes)"
echo ""
echo "Check change status:"
echo "  aws route53 get-change --id $CHANGE_ID --profile $PROFILE"
echo ""
echo "Verify in Resend: https://resend.com/domains"
echo "   Domain should show as 'Verified' once DNS propagates"

rm "$TEMP_FILE"

