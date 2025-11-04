#!/usr/bin/env node
/**
 * @fileoverview Main CDK app entry point for Alva staging deployment.
 * Orchestrates all infrastructure stacks in the correct dependency order.
 */

import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { SecretsStack } from '../lib/stacks/secrets-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { CacheStack } from '../lib/stacks/cache-stack';
import { EcsStack } from '../lib/stacks/ecs-stack';
import { DnsStack } from '../lib/stacks/dns-stack';
import { AlbStack } from '../lib/stacks/alb-stack';

const app = new cdk.App();

// Environment configuration
// Account ID will be determined from AWS CLI credentials
// Region can be overridden via CDK_DEFAULT_REGION or --profile
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

// Stack naming
const projectName = 'alva';
const environment = 'staging';

// 1. Network Stack - Foundation (no dependencies)
const networkStack = new NetworkStack(app, `${projectName}-${environment}-network`, {
  env,
  description: 'Network infrastructure for Alva staging',
});

// 2. Secrets Stack - Application secrets (no dependencies)
const secretsStack = new SecretsStack(app, `${projectName}-${environment}-secrets`, {
  env,
  description: 'Secrets Manager secrets for Alva staging',
});

// 3. Database Stack - Depends on Network (RDS creates its own secret)
const databaseStack = new DatabaseStack(app, `${projectName}-${environment}-database`, {
  env,
  description: 'RDS PostgreSQL database for Alva staging',
  vpc: networkStack.vpc,
  securityGroup: networkStack.rdsSecurityGroup,
});

// 4. Cache Stack - Depends on Network
const cacheStack = new CacheStack(app, `${projectName}-${environment}-cache`, {
  env,
  description: 'ElastiCache Redis for Alva staging',
  vpc: networkStack.vpc,
  securityGroup: networkStack.redisSecurityGroup,
});

// 5. ECS Stack - Depends on Network, Secrets, Database, Cache
const ecsStack = new EcsStack(app, `${projectName}-${environment}-ecs`, {
  env,
  description: 'ECS cluster and services for Alva staging',
  vpc: networkStack.vpc,
  securityGroup: networkStack.ecsSecurityGroup,
  databaseSecret: databaseStack.databaseSecret,
  databaseEndpoint: databaseStack.database.instanceEndpoint.hostname,
  redisEndpoint: cacheStack.redisEndpoint,
  redisPort: cacheStack.redisCluster.attrRedisEndpointPort,
  jwtPrivateKeySecret: secretsStack.jwtPrivateKeySecret,
  jwtPublicKeySecret: secretsStack.jwtPublicKeySecret,
  jwtSecret: secretsStack.jwtSecret,
  cookieSecret: secretsStack.cookieSecret,
  openaiApiKeySecret: secretsStack.openaiApiKeySecret,
  resendApiKeySecret: secretsStack.resendApiKeySecret,
});

// 6. DNS Stack - Optional, creates Route53 hosted zone if domain is provided
// Set STAGING_DOMAIN environment variable to enable (e.g., 'staging.alva.paulrenenichols.com')
// For cross-account DNS (hosted zone in management account), also set:
//   - HOSTED_ZONE_ID: Route53 hosted zone ID in management account
//   - HOSTED_ZONE_ACCOUNT_ID: Management account ID
//   - CROSS_ACCOUNT_DNS_ROLE_ARN: IAM role ARN in management account (optional, if using cross-account)
const stagingDomain = process.env.STAGING_DOMAIN;
const hostedZoneId = process.env.HOSTED_ZONE_ID;
const hostedZoneAccountId = process.env.HOSTED_ZONE_ACCOUNT_ID;
const crossAccountDnsRoleArn = process.env.CROSS_ACCOUNT_DNS_ROLE_ARN;

const dnsStack = stagingDomain
  ? new DnsStack(app, `${projectName}-${environment}-dns`, {
      env,
      description: 'Route53 DNS for Alva staging',
      domainName: stagingDomain,
      createHostedZone: !hostedZoneId, // Don't create if using existing hosted zone
      existingHostedZoneId: hostedZoneId,
      hostedZoneAccountId: hostedZoneAccountId,
      crossAccountDnsRoleArn: crossAccountDnsRoleArn,
    })
  : undefined;

// 7. ALB Stack - Depends on Network, ECS, and optionally DNS
const albStack = new AlbStack(app, `${projectName}-${environment}-alb`, {
  env,
  description: 'Application Load Balancer for Alva staging',
  vpc: networkStack.vpc,
  securityGroup: networkStack.albSecurityGroup,
  services: ecsStack.services,
  hostedZone: dnsStack?.hostedZone,
  domainName: stagingDomain,
});

// Add tags to all stacks
cdk.Tags.of(app).add('Project', 'Alva');
cdk.Tags.of(app).add('Environment', environment);
cdk.Tags.of(app).add('ManagedBy', 'CDK');
