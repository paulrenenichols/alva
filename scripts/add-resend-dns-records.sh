#!/bin/bash
# @fileoverview Script to add Resend DNS verification records to Route53 in management account
# Usage: ./scripts/add-resend-dns-records.sh <profile> <hosted-zone-id>

set -e

PROFILE=${1:-management}
ZONE_ID=${2}

if [ -z "$ZONE_ID" ]; then
  echo "Usage: $0 <aws-profile> <hosted-zone-id>"
  echo ""
  echo "Example:"
  echo "  $0 management Z1234567890ABC"
  echo ""
  echo "To find your hosted zone ID:"
  echo "  aws route53 list-hosted-zones-by-name --dns-name paulrenenichols.com --profile $PROFILE"
  exit 1
fi

DOMAIN="paulrenenichols.com"

echo "🔧 Adding Resend DNS records for $DOMAIN"
echo "Profile: $PROFILE"
echo "Hosted Zone ID: $ZONE_ID"
echo ""

# Prompt for Resend DNS records
echo "Please provide the DNS records from Resend:"
echo ""

# SPF Record
read -p "SPF Record (TXT) - Value (or press Enter to skip): " SPF_VALUE

# DKIM Records (usually 3 CNAME records)
read -p "DKIM Record 1 - Name (e.g., resend._domainkey): " DKIM_NAME_1
read -p "DKIM Record 1 - Value (CNAME target): " DKIM_VALUE_1

read -p "DKIM Record 2 - Name (or press Enter to skip): " DKIM_NAME_2
if [ -n "$DKIM_NAME_2" ]; then
  read -p "DKIM Record 2 - Value (CNAME target): " DKIM_VALUE_2
fi

read -p "DKIM Record 3 - Name (or press Enter to skip): " DKIM_NAME_3
if [ -n "$DKIM_NAME_3" ]; then
  read -p "DKIM Record 3 - Value (CNAME target): " DKIM_VALUE_3
fi

# DMARC Record (optional)
read -p "DMARC Record (TXT) - Value (or press Enter to skip): " DMARC_VALUE

# Build JSON for change batch
CHANGES="["

# Add SPF record
if [ -n "$SPF_VALUE" ]; then
  if [ "$CHANGES" != "[" ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$DOMAIN\",
      \"Type\": \"TXT\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"\\\"$SPF_VALUE\\\"\"
        }
      ]
    }
  }"
fi

# Add DKIM records
if [ -n "$DKIM_NAME_1" ] && [ -n "$DKIM_VALUE_1" ]; then
  if [ "$CHANGES" != "[" ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$DKIM_NAME_1.$DOMAIN\",
      \"Type\": \"CNAME\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"$DKIM_VALUE_1\"
        }
      ]
    }
  }"
fi

if [ -n "$DKIM_NAME_2" ] && [ -n "$DKIM_VALUE_2" ]; then
  if [ "$CHANGES" != "[" ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$DKIM_NAME_2.$DOMAIN\",
      \"Type\": \"CNAME\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"$DKIM_VALUE_2\"
        }
      ]
    }
  }"
fi

if [ -n "$DKIM_NAME_3" ] && [ -n "$DKIM_VALUE_3" ]; then
  if [ "$CHANGES" != "[" ]; then
    CHANGES+=","
  fi
  CHANGES+="
  {
    \"Action\": \"UPSERT\",
    \"ResourceRecordSet\": {
      \"Name\": \"$DKIM_NAME_3.$DOMAIN\",
      \"Type\": \"CNAME\",
      \"TTL\": 300,
      \"ResourceRecords\": [
        {
          \"Value\": \"$DKIM_VALUE_3\"
        }
      ]
    }
  }"
fi

# Add DMARC record
if [ -n "$DMARC_VALUE" ]; then
  if [ "$CHANGES" != "[" ]; then
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

# Create change batch JSON
CHANGE_BATCH="{
  \"Comment\": \"Add Resend DNS verification records for $DOMAIN\",
  \"Changes\": $CHANGES
}"

# Save to temp file
TEMP_FILE=$(mktemp)
echo "$CHANGE_BATCH" > "$TEMP_FILE"

echo ""
echo "📋 DNS Records to add:"
echo "$CHANGE_BATCH" | jq '.' 2>/dev/null || echo "$CHANGE_BATCH"
echo ""

read -p "Continue and add these records? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Cancelled."
  rm "$TEMP_FILE"
  exit 0
fi

echo ""
echo "🚀 Adding DNS records..."

CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "file://$TEMP_FILE" \
  --profile "$PROFILE" \
  --query 'ChangeInfo.Id' \
  --output text)

echo "✅ DNS records added!"
echo "Change ID: $CHANGE_ID"
echo ""
echo "⏳ DNS propagation may take a few minutes."
echo "Check status:"
echo "  aws route53 get-change --id $CHANGE_ID --profile $PROFILE"
echo ""
echo "Verify in Resend dashboard: https://resend.com/domains"

rm "$TEMP_FILE"


