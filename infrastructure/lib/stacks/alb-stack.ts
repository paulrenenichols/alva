/**
 * @fileoverview Application Load Balancer stack for Alva staging deployment.
 * Creates a single ALB with host-based routing for subdomain support.
 * Each service is accessed via its own subdomain (web.staging.alva.app, api.staging.alva.app, etc.)
 */

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { SERVICES } from '../config/services';

export interface AlbStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
  services: Record<string, ecs.FargateService>;
  hostedZone?: route53.IHostedZone; // Optional Route53 hosted zone for subdomain routing
  domainName?: string; // Domain name (e.g., 'staging.alva.app')
}

export class AlbStack extends cdk.Stack {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  public readonly targetGroups: Record<string, elbv2.ApplicationTargetGroup>;
  public readonly serviceUrls: Record<string, string>;

  constructor(scope: Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);

    // Create single Application Load Balancer
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: props.securityGroup,
      loadBalancerName: 'alva-staging-alb',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // Create target groups for each service
    this.targetGroups = {};
    this.serviceUrls = {};

    for (const [serviceKey, serviceConfig] of Object.entries(SERVICES)) {
      // Health check path: Next.js apps use /api/health, Fastify apps use /health
      const healthCheckPath =
        serviceKey === 'web' || serviceKey === 'admin'
          ? '/api/health'
          : '/health';

      const targetGroup = new elbv2.ApplicationTargetGroup(
        this,
        `${serviceKey}TargetGroup`,
        {
          vpc: props.vpc,
          port: serviceConfig.port,
          protocol: elbv2.ApplicationProtocol.HTTP,
          targetType: elbv2.TargetType.IP,
          healthCheck: {
            path: healthCheckPath,
            interval: cdk.Duration.seconds(30),
            timeout: cdk.Duration.seconds(5),
            healthyHttpCodes: '200',
            unhealthyThresholdCount: 2,
            healthyThresholdCount: 2,
          },
          deregistrationDelay: cdk.Duration.seconds(30),
        }
      );

      // Attach ECS service to target group
      targetGroup.addTarget(props.services[serviceKey]);
      this.targetGroups[serviceKey] = targetGroup;
    }

    // Create HTTP listener (port 80)
    const httpListener = this.loadBalancer.addListener('HttpListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Not Found - Service not found',
      }),
    });

    // Configure host-based routing
    // Priority order matters - more specific rules first
    const albDns = this.loadBalancer.loadBalancerDnsName;

    if (props.domainName) {
      // Host-based routing using subdomains
      let priority = 100;

      for (const [serviceKey, targetGroup] of Object.entries(this.targetGroups)) {
        const subdomain = serviceKey === 'web' ? props.domainName : `${serviceKey}.${props.domainName}`;
        
        // Create Route53 A record if hosted zone is provided (same account)
        if (props.hostedZone) {
          new route53.ARecord(this, `${serviceKey}SubdomainRecord`, {
            zone: props.hostedZone,
            recordName: serviceKey === 'web' ? props.domainName : `${serviceKey}.${props.domainName}`,
            target: route53.RecordTarget.fromAlias(
              new route53Targets.LoadBalancerTarget(this.loadBalancer)
            ),
          });
        }
        // If no hosted zone, DNS records must be created manually (e.g., cross-account DNS)

        // Create listener rule based on host header
        httpListener.addAction(`${serviceKey}Target`, {
          priority: priority++,
          conditions: [
            elbv2.ListenerCondition.hostHeaders([subdomain]),
          ],
          action: elbv2.ListenerAction.forward([targetGroup]),
        });

        this.serviceUrls[serviceKey] = `http://${subdomain}`;
      }
    } else {
      // Fallback: Use path-based routing on ALB DNS
      // Note: Can't create subdomains on AWS ELB domains, so we use paths
      // Each service gets a dedicated path for clarity
      let priority = 100;
      
      // Web service - root path
      httpListener.addAction('WebTarget', {
        priority: priority++,
        conditions: [
          elbv2.ListenerCondition.pathPatterns(['/', '/_next/*']),
        ],
        action: elbv2.ListenerAction.forward([this.targetGroups.web]),
      });

      // API service - /api/* path
      httpListener.addAction('ApiTarget', {
        priority: priority++,
        conditions: [
          elbv2.ListenerCondition.pathPatterns(['/api/*']),
        ],
        action: elbv2.ListenerAction.forward([this.targetGroups.api]),
      });

      // Auth service - /auth/* path
      httpListener.addAction('AuthTarget', {
        priority: priority++,
        conditions: [
          elbv2.ListenerCondition.pathPatterns(['/auth/*']),
        ],
        action: elbv2.ListenerAction.forward([this.targetGroups.auth]),
      });

      // Admin service - /admin/* path (without basePath, so it works at root)
      httpListener.addAction('AdminTarget', {
        priority: priority++,
        conditions: [
          elbv2.ListenerCondition.pathPatterns(['/admin/*', '/admin']),
        ],
        action: elbv2.ListenerAction.forward([this.targetGroups.admin]),
      });

      // All services use the same ALB DNS with different paths
      this.serviceUrls.web = `http://${albDns}`;
      this.serviceUrls.api = `http://${albDns}/api`;
      this.serviceUrls.auth = `http://${albDns}/auth`;
      this.serviceUrls.admin = `http://${albDns}/admin`;
    }

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: albDns,
      description: 'Application Load Balancer DNS name',
      exportName: 'AlvaStagingALBDNS',
    });

    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: `http://${albDns}`,
      description: 'Application Load Balancer base URL',
    });

    // Service-specific URLs
    for (const [serviceKey, url] of Object.entries(this.serviceUrls)) {
      new cdk.CfnOutput(this, `${serviceKey}ServiceURL`, {
        value: url,
        description: `${serviceKey} service URL`,
        exportName: `AlvaStaging${serviceKey}URL`,
      });
    }
  }
}

