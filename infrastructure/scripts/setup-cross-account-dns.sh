#!/bin/bash
# @fileoverview Interactive script to set up cross-account DNS for Alva staging
# Guides through creating hosted zone in management account and NS record setup

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Account information
MANAGEMENT_ACCOUNT_ID="148510441541"
ALVA_ACCOUNT_ID="520297668839"
PARENT_DOMAIN="paulrenenichols.com"
SUBDOMAIN_ZONE="alva.paulrenenichols.com"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Alva Cross-Account DNS Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Management Account: $MANAGEMENT_ACCOUNT_ID"
echo "Alva Account: $ALVA_ACCOUNT_ID"
echo "Parent Domain: $PARENT_DOMAIN"
echo "Subdomain Zone: $SUBDOMAIN_ZONE"
echo ""

# Step 1: Check AWS CLI
echo -e "${YELLOW}Step 1: Checking AWS CLI...${NC}"
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    echo "Installation: https://aws.amazon.com/cli/"
    exit 1
fi
echo -e "${GREEN}✓ AWS CLI is installed${NC}"
echo ""

# Step 2: Check AWS credentials/profile
echo -e "${YELLOW}Step 2: Checking AWS credentials...${NC}"
echo "Available AWS profiles:"
aws configure list-profiles 2>/dev/null || echo "No profiles found"

echo ""
read -p "Enter AWS profile name for management account (or press Enter to use default): " PROFILE_NAME

if [ -z "$PROFILE_NAME" ]; then
    PROFILE_ARG=""
    PROFILE_DESC="default profile"
else
    PROFILE_ARG="--profile $PROFILE_NAME"
    PROFILE_DESC="profile: $PROFILE_NAME"
fi

# Test credentials
echo "Testing credentials..."
CURRENT_ACCOUNT=$(aws sts get-caller-identity $PROFILE_ARG --query Account --output text 2>&1 || echo "ERROR")

if [[ "$CURRENT_ACCOUNT" == *"ERROR"* ]] || [[ -z "$CURRENT_ACCOUNT" ]]; then
    echo -e "${RED}Unable to authenticate. Please configure AWS credentials.${NC}"
    echo ""
    echo "Options:"
    echo "1. Run: aws configure --profile <profile-name>"
    echo "2. Or use SSO: aws sso login --profile <profile-name>"
    exit 1
fi

echo -e "${GREEN}✓ Authenticated${NC}"
echo "Current account: $CURRENT_ACCOUNT"
echo "Using: $PROFILE_DESC"
echo ""

if [ "$CURRENT_ACCOUNT" != "$MANAGEMENT_ACCOUNT_ID" ]; then
    echo -e "${YELLOW}⚠ Warning: You're not in the management account ($MANAGEMENT_ACCOUNT_ID)${NC}"
    echo "Current account: $CURRENT_ACCOUNT"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Please switch to management account first."
        exit 1
    fi
fi

# Step 3: Check if hosted zone already exists
echo -e "${YELLOW}Step 3: Checking for existing hosted zone...${NC}"
EXISTING_ZONE=$(aws route53 list-hosted-zones-by-name $PROFILE_ARG \
    --dns-name "$SUBDOMAIN_ZONE" \
    --query 'HostedZones[?Name==`'$SUBDOMAIN_ZONE'.`].Id' \
    --output text 2>/dev/null || echo "")

if [ -n "$EXISTING_ZONE" ] && [ "$EXISTING_ZONE" != "None" ]; then
    ZONE_ID=$(echo $EXISTING_ZONE | cut -d'/' -f3)
    echo -e "${GREEN}✓ Hosted zone already exists: $ZONE_ID${NC}"
    echo ""
    read -p "Use existing zone? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo ""
        echo -e "${GREEN}Using existing hosted zone: $ZONE_ID${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Create NS record in $PARENT_DOMAIN zone (see documentation)"
        echo "2. Deploy Alva infrastructure in account $ALVA_ACCOUNT_ID"
        echo "3. Create DNS records pointing to ALB (use ./scripts/create-dns-records.sh)"
        echo ""
        echo "Hosted Zone ID: $ZONE_ID"
        echo "Save this for later!"
        exit 0
    fi
fi

# Step 4: Create hosted zone
echo -e "${YELLOW}Step 4: Creating hosted zone for $SUBDOMAIN_ZONE...${NC}"
read -p "Create hosted zone? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Skipping hosted zone creation."
    exit 0
fi

CALLER_REF="alva-$(date +%s)"
echo "Creating hosted zone..."
ZONE_OUTPUT=$(aws route53 create-hosted-zone $PROFILE_ARG \
    --name "$SUBDOMAIN_ZONE" \
    --caller-reference "$CALLER_REF" \
    --hosted-zone-config "Comment=Alva application subdomain" \
    --output json)

ZONE_ID=$(echo "$ZONE_OUTPUT" | jq -r '.HostedZone.Id' | cut -d'/' -f3)
NAMESERVERS=$(echo "$ZONE_OUTPUT" | jq -r '.DelegationSet.NameServers[]' | tr '\n' ' ')

echo -e "${GREEN}✓ Hosted zone created successfully!${NC}"
echo ""
echo "Hosted Zone ID: $ZONE_ID"
echo "Name Servers:"
echo "$ZONE_OUTPUT" | jq -r '.DelegationSet.NameServers[]' | nl -w2 -s'. '
echo ""

# Step 5: Create NS record in parent zone
echo -e "${YELLOW}Step 5: Create NS record in parent zone ($PARENT_DOMAIN)...${NC}"
echo "You need to create an NS record in your $PARENT_DOMAIN hosted zone."
echo "The NS record should delegate $SUBDOMAIN_ZONE to the name servers above."
echo ""

# Check if parent zone exists
PARENT_ZONE=$(aws route53 list-hosted-zones-by-name $PROFILE_ARG \
    --dns-name "$PARENT_DOMAIN" \
    --query 'HostedZones[?Name==`'$PARENT_DOMAIN'.`].Id' \
    --output text 2>/dev/null || echo "")

if [ -n "$PARENT_ZONE" ] && [ "$PARENT_ZONE" != "None" ]; then
    PARENT_ZONE_ID=$(echo $PARENT_ZONE | cut -d'/' -f3)
    echo -e "${GREEN}✓ Found parent zone: $PARENT_ZONE_ID${NC}"
    echo ""
    read -p "Create NS record automatically? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        # Create NS record JSON
        NS_RECORDS=""
        while IFS= read -r ns; do
            if [ -n "$NS_RECORDS" ]; then
                NS_RECORDS="$NS_RECORDS,"
            fi
            NS_RECORDS="${NS_RECORDS}{\"Value\":\"$ns\"}"
        done < <(echo "$ZONE_OUTPUT" | jq -r '.DelegationSet.NameServers[]')

        CHANGE_BATCH="{\"Changes\":[{\"Action\":\"UPSERT\",\"ResourceRecordSet\":{\"Name\":\"$SUBDOMAIN_ZONE\",\"Type\":\"NS\",\"TTL\":300,\"ResourceRecords\":[$NS_RECORDS]}}]}"

        echo "Creating NS record..."
        CHANGE_ID=$(aws route53 change-resource-record-sets $PROFILE_ARG \
            --hosted-zone-id "$PARENT_ZONE_ID" \
            --change-batch "$CHANGE_BATCH" \
            --query 'ChangeInfo.Id' \
            --output text)

        echo -e "${GREEN}✓ NS record created successfully!${NC}"
        echo "Change ID: $CHANGE_ID"
        echo ""
    else
        echo "Skipping automatic NS record creation."
        echo "You can create it manually using the name servers listed above."
    fi
else
    echo -e "${YELLOW}⚠ Parent zone ($PARENT_DOMAIN) not found in Route53${NC}"
    echo "You may need to:"
    echo "1. Create the hosted zone for $PARENT_DOMAIN if it doesn't exist"
    echo "2. Or update your domain registrar's name servers to point to Route53"
    echo "3. Then create the NS record manually"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Summary:"
echo "  Hosted Zone ID: $ZONE_ID"
echo "  Subdomain Zone: $SUBDOMAIN_ZONE"
echo ""
echo "Next steps:"
echo "1. ✓ Hosted zone created"
echo "2. ✓ NS record created (if done automatically)"
echo "3. → Deploy Alva infrastructure in account $ALVA_ACCOUNT_ID"
echo "4. → Create DNS records after ALB deployment:"
echo "   cd infrastructure"
echo "   ./scripts/create-dns-records.sh $ZONE_ID <alb-dns-name> us-east-1"
echo ""
echo "Save the Hosted Zone ID: $ZONE_ID"

