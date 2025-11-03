#!/bin/bash
# @fileoverview Script to create DNS records in management account for Alva staging
# Usage: ./scripts/create-dns-records.sh <hosted-zone-id> <alb-dns-name> <region>

set -eo pipefail

HOSTED_ZONE_ID="${1:-}"
ALB_DNS="${2:-}"
REGION="${3:-us-east-1}"

if [ -z "$HOSTED_ZONE_ID" ] || [ -z "$ALB_DNS" ]; then
  echo "Usage: $0 <hosted-zone-id> <alb-dns-name> [region]"
  echo ""
  echo "Example:"
  echo "  $0 Z1234567890ABC alva-staging-alb-123456789.us-east-1.elb.amazonaws.com us-east-1"
  echo ""
  echo "Available regions: us-east-1, us-west-2, eu-west-1, ap-southeast-1"
  exit 1
fi

# ALB Zone IDs by region
case "$REGION" in
  us-east-1)
    ALB_ZONE_ID="Z35SXDOTRQ7X7K"
    ;;
  us-west-2)
    ALB_ZONE_ID="Z1H1FL5HABSF5"
    ;;
  eu-west-1)
    ALB_ZONE_ID="Z32O12OCRQLOVW"
    ;;
  ap-southeast-1)
    ALB_ZONE_ID="Z1LMS91P8CMLE5"
    ;;
  *)
    echo "Error: Unknown region '$REGION'"
    echo "Available regions: us-east-1, us-west-2, eu-west-1, ap-southeast-1"
    exit 1
    ;;
esac

echo "Creating DNS records in hosted zone: $HOSTED_ZONE_ID"
echo "ALB DNS: $ALB_DNS"
echo "ALB Zone ID: $ALB_ZONE_ID"
echo ""

# Create JSON for all DNS records
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

echo "DNS records to create:"
jq '.Changes[].ResourceRecordSet.Name' /tmp/dns-records.json
echo ""

read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

# Create the records
CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch file:///tmp/dns-records.json \
  --query 'ChangeInfo.Id' \
  --output text)

echo "DNS records created successfully!"
echo "Change ID: $CHANGE_ID"
echo ""
echo "Waiting for DNS propagation (this may take a few minutes)..."
aws route53 wait resource-record-sets-changed --id "$CHANGE_ID"
echo "DNS propagation complete!"

echo ""
echo "You can verify with:"
echo "  dig staging.alva.paulrenenichols.com"
echo "  dig api.staging.alva.paulrenenichols.com"
echo "  dig auth.staging.alva.paulrenenichols.com"
echo "  dig admin.staging.alva.paulrenenichols.com"

