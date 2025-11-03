/**
 * @fileoverview ECS stack for Alva staging deployment.
 * Creates ECS cluster, task definitions, and services for all 4 microservices.
 */

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { SERVICES } from '../config/services';

export interface EcsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
  databaseSecret: secretsmanager.ISecret;
  databaseEndpoint: string;
  redisEndpoint: string;
  redisPort: string;
  jwtPrivateKeySecret: secretsmanager.Secret;
  jwtPublicKeySecret: secretsmanager.Secret;
  jwtSecret: secretsmanager.Secret;
  cookieSecret: secretsmanager.Secret;
  openaiApiKeySecret: secretsmanager.Secret;
  resendApiKeySecret: secretsmanager.Secret;
}

export class EcsStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly services: Record<string, ecs.FargateService>;

  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    // Create ECS cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: props.vpc,
      clusterName: 'alva-staging-cluster',
      containerInsights: true, // Enable CloudWatch Container Insights
    });

    // Create CloudWatch log group
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: '/ecs/alva-staging',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Get ECR repositories
    const accountId = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    // Create task definitions and services for each microservice
    this.services = {};

    for (const [serviceKey, serviceConfig] of Object.entries(SERVICES)) {
      const ecrRepo = ecr.Repository.fromRepositoryName(
        this,
        `${serviceKey}Repo`,
        serviceConfig.repositoryName
      );

      // Create task definition
      const taskDefinition = new ecs.FargateTaskDefinition(
        this,
        `${serviceKey}TaskDefinition`,
        {
          cpu: serviceConfig.cpu,
          memoryLimitMiB: serviceConfig.memory,
          family: `${serviceConfig.name}-staging`,
        }
      );

      // Environment variables
      const environment: Record<string, string> = {
        ...serviceConfig.environment,
        PORT: serviceConfig.port.toString(),
        DATABASE_ENDPOINT: props.databaseEndpoint,
        DATABASE_NAME: 'alva',
        DATABASE_PORT: '5432', // PostgreSQL default port
        REDIS_ENDPOINT: props.redisEndpoint,
        REDIS_PORT: props.redisPort,
      };

      // Construct service URLs based on domain pattern
      // If STAGING_DOMAIN is set, use subdomains; otherwise use ALB DNS placeholder
      const stagingDomain = process.env.STAGING_DOMAIN;
      
      if (stagingDomain) {
        // Subdomain-based URLs
        const webUrl = `http://${stagingDomain}`;
        const apiUrl = `http://api.${stagingDomain}`;
        const authUrl = `http://auth.${stagingDomain}`;
        const adminUrl = `http://admin.${stagingDomain}`;

        // For API and Auth services: Set CORS origins
        if (serviceKey === 'api' || serviceKey === 'auth') {
          environment.CORS_ORIGINS = `${webUrl},${adminUrl}`;
        }

        // For Next.js apps: Set API and Auth URLs
        if (serviceKey === 'web' || serviceKey === 'admin') {
          environment.NEXT_PUBLIC_API_URL = apiUrl;
          environment.NEXT_PUBLIC_AUTH_URL = authUrl;
        }
      } else {
        // Fallback: Use ALB DNS with path-based routing
        // Note: ALB DNS will be available after ALB stack deployment
        // URLs will be updated via ECS service update after initial deployment
        // For now, set placeholder values
        const baseUrlPlaceholder = 'http://ALB_DNS_PLACEHOLDER';
        
        const webUrl = baseUrlPlaceholder;
        const apiUrl = `${baseUrlPlaceholder}/api`;
        const authUrl = `${baseUrlPlaceholder}/auth`;
        const adminUrl = `${baseUrlPlaceholder}/admin`;

        // For API and Auth services: Set CORS origins
        if (serviceKey === 'api' || serviceKey === 'auth') {
          environment.CORS_ORIGINS = `${webUrl},${adminUrl}`;
        }

        // For Next.js apps: Set API and Auth URLs
        if (serviceKey === 'web' || serviceKey === 'admin') {
          environment.NEXT_PUBLIC_API_URL = apiUrl;
          environment.NEXT_PUBLIC_AUTH_URL = authUrl;
        }
      }

            // Secrets from Secrets Manager
            // Note: DATABASE_URL will be constructed in the application from DATABASE_ENDPOINT and secret values
            const secrets: Record<string, ecs.Secret> = {
              DATABASE_USERNAME: ecs.Secret.fromSecretsManager(
                props.databaseSecret,
                'username'
              ),
              DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(
                props.databaseSecret,
                'password'
              ),
              JWT_PRIVATE_KEY: ecs.Secret.fromSecretsManager(
                props.jwtPrivateKeySecret
              ),
              JWT_PUBLIC_KEY: ecs.Secret.fromSecretsManager(
                props.jwtPublicKeySecret
              ),
              JWT_SECRET: ecs.Secret.fromSecretsManager(props.jwtSecret),
              COOKIE_SECRET: ecs.Secret.fromSecretsManager(props.cookieSecret),
              OPENAI_API_KEY: ecs.Secret.fromSecretsManager(
                props.openaiApiKeySecret
              ),
              RESEND_API_KEY: ecs.Secret.fromSecretsManager(
                props.resendApiKeySecret
              ),
            };

            // Health check path: Next.js apps use /api/health, Fastify apps use /health
            const healthCheckPath =
              serviceKey === 'web' || serviceKey === 'admin'
                ? '/api/health'
                : '/health';
            const healthCheckPort = serviceConfig.port.toString();

            // Add container to task definition
            const container = taskDefinition.addContainer(
              `${serviceKey}Container`,
              {
                image: ecs.ContainerImage.fromEcrRepository(ecrRepo, 'latest'),
                logging: ecs.LogDrivers.awsLogs({
                  streamPrefix: serviceConfig.name,
                  logGroup: logGroup,
                }),
                environment,
                secrets,
                healthCheck: {
                  command: [
                    'CMD-SHELL',
                    // Use Node.js for health check (no external dependencies like curl/wget)
                    // This works in all Node.js containers and is more reliable
                    // Single-line Node.js HTTP request that exits with 0 on success, 1 on failure
                    `node -e "const http=require('http');const req=http.request({hostname:'localhost',port:${healthCheckPort},path:'${healthCheckPath}',method:'GET',timeout:5000},(r)=>{process.exit(r.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.on('timeout',()=>{req.destroy();process.exit(1)});req.end()" || exit 1`,
                  ],
                  interval: cdk.Duration.seconds(30),
                  timeout: cdk.Duration.seconds(5),
                  retries: 3,
                  startPeriod: cdk.Duration.seconds(60),
                },
              }
            );

      container.addPortMappings({
        containerPort: serviceConfig.port,
        protocol: ecs.Protocol.TCP,
      });

      // Create Fargate service
      this.services[serviceKey] = new ecs.FargateService(
        this,
        `${serviceKey}Service`,
        {
          cluster: this.cluster,
          taskDefinition: taskDefinition,
          desiredCount: 1, // Single instance for staging
          securityGroups: [props.securityGroup],
          vpcSubnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          },
          assignPublicIp: false, // Use NAT Gateway for internet access
          enableExecuteCommand: true, // Enable ECS Exec for debugging
        }
      );
    }

    // Outputs
    new cdk.CfnOutput(this, 'ClusterName', {
      value: this.cluster.clusterName,
      description: 'ECS cluster name',
    });
  }
}

