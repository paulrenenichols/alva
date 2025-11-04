/**
 * @fileoverview Service configuration for Alva microservices.
 */

import * as cdk from 'aws-cdk-lib';

export interface ServiceConfig {
  name: string;
  port: number;
  cpu: number;
  memory: number;
  repositoryName: string; // ECR repository name (without account/region)
  environment?: Record<string, string>;
  secrets?: Record<string, string>;
}

/**
 * Service definitions.
 * Image URIs are constructed dynamically from AWS account and region.
 */
export const SERVICES: Record<string, ServiceConfig> = {
  web: {
    name: 'alva-web',
    port: 3000,
    cpu: 512,
    memory: 1024,
    repositoryName: 'alva-web',
    environment: {
      NODE_ENV: 'production',
    },
  },
  api: {
    name: 'alva-api',
    port: 3001,
    cpu: 512,
    memory: 1024,
    repositoryName: 'alva-api',
    environment: {
      NODE_ENV: 'production',
    },
  },
  auth: {
    name: 'alva-auth',
    port: 3002,
    cpu: 512,
    memory: 1024,
    repositoryName: 'alva-auth',
    environment: {
      NODE_ENV: 'production',
    },
  },
  admin: {
    name: 'alva-admin',
    port: 3003,
    cpu: 512,
    memory: 1024,
    repositoryName: 'alva-admin',
    environment: {
      NODE_ENV: 'production',
    },
  },
};

/**
 * Helper function to construct ECR image URI dynamically.
 */
export function getEcrImageUri(
  stack: cdk.Stack,
  repositoryName: string
): string {
  const account = stack.account;
  const region = stack.region;
  return `${account}.dkr.ecr.${region}.amazonaws.com/${repositoryName}:latest`;
}

