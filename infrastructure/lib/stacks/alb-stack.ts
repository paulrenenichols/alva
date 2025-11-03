/**
 * @fileoverview Application Load Balancer stack for Alva staging deployment.
 * Creates ALB with target groups and listener rules for routing to all services.
 */

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { SERVICES } from '../config/services';

export interface AlbStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
  services: Record<string, ecs.FargateService>;
}

export class AlbStack extends cdk.Stack {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  public readonly targetGroups: Record<string, elbv2.ApplicationTargetGroup>;

  constructor(scope: Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);

    // Create Application Load Balancer
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

    for (const [serviceKey, serviceConfig] of Object.entries(SERVICES)) {
      // Health check path: Next.js apps use /api/health, Fastify apps use /health
      // Admin service has basePath: '/admin', so health endpoint is at /admin/api/health
      const healthCheckPath =
        serviceKey === 'web'
          ? '/api/health'
          : serviceKey === 'admin'
          ? '/admin/api/health'
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
        messageBody: 'Not Found',
      }),
    });

    // For now, use path-based routing until we have a domain
    // Path-based routing rules (temporary until domain is configured)
    httpListener.addAction('WebTarget', {
      priority: 100,
      conditions: [
        // Route root, web paths, and Next.js static assets to web service
        elbv2.ListenerCondition.pathPatterns(['/', '/web/*', '/_next/static/*', '/_next/image/*', '/favicon.ico']),
      ],
      action: elbv2.ListenerAction.forward([this.targetGroups.web]),
    });

    httpListener.addAction('ApiTarget', {
      priority: 200,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/api/*'])],
      action: elbv2.ListenerAction.forward([this.targetGroups.api]),
    });

    httpListener.addAction('AuthTarget', {
      priority: 300,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/auth/*'])],
      action: elbv2.ListenerAction.forward([this.targetGroups.auth]),
    });

    httpListener.addAction('AdminTarget', {
      priority: 400,
      // Route admin paths and Next.js static assets for admin service
      conditions: [
        elbv2.ListenerCondition.pathPatterns([
          '/admin/*',    // All admin paths (including /admin/)
          '/admin/_next/static/*',  // Next.js static assets
          '/admin/_next/image/*',    // Next.js images
        ]),
      ],
      action: elbv2.ListenerAction.forward([this.targetGroups.admin]),
    });

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.loadBalancer.loadBalancerDnsName,
      description: 'Application Load Balancer DNS name',
      exportName: 'AlvaStagingALBDNS',
    });

    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: `http://${this.loadBalancer.loadBalancerDnsName}`,
      description: 'Application Load Balancer URL',
    });
  }
}

