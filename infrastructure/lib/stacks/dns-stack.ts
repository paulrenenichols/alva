/**
 * @fileoverview Route53 DNS stack for Alva staging deployment.
 * Creates hosted zone and DNS records for subdomain routing.
 * Supports cross-account hosted zones (e.g., hosted zone in management account).
 * This stack is optional - if you don't have a domain yet, you can deploy without it
 * and use ALB DNS names directly.
 */

import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface DnsStackProps extends cdk.StackProps {
  /**
   * Domain name for the staging environment (e.g., 'staging.alva.paulrenenichols.com')
   * If not provided, will use ALB DNS domain for subdomains
   */
  domainName?: string;

  /**
   * ALB DNS name - used to create subdomains if no custom domain is provided
   */
  albDnsName?: string;

  /**
   * Whether to create a new hosted zone or use an existing one
   * If false, you must provide existingHostedZoneId
   */
  createHostedZone?: boolean;

  /**
   * Existing hosted zone ID to use (if not creating a new one)
   * Can be in the same account or a different account (cross-account)
   */
  existingHostedZoneId?: string;

  /**
   * AWS Account ID where the hosted zone exists (for cross-account setup)
   * Required if using cross-account hosted zone
   */
  hostedZoneAccountId?: string;

  /**
   * IAM role ARN in the management account to assume for cross-account DNS access
   * Required if using cross-account hosted zone
   */
  crossAccountDnsRoleArn?: string;
}

export class DnsStack extends cdk.Stack {
  public readonly hostedZone?: route53.IHostedZone;
  public readonly domainName?: string;

  constructor(scope: Construct, id: string, props?: DnsStackProps) {
    super(scope, id, props);

    if (!props?.domainName) {
      // No domain configured - skip DNS setup
      cdk.Annotations.of(this).addWarning(
        'No domain name provided. DNS stack will not create hosted zone. ' +
        'ALB will use its DNS name directly until domain is configured.'
      );
      return;
    }

    this.domainName = props.domainName;

    if (props.createHostedZone !== false) {
      // Create new hosted zone in current account
      this.hostedZone = new route53.HostedZone(this, 'HostedZone', {
        zoneName: props.domainName,
        comment: `Hosted zone for Alva staging environment`,
      });

      new cdk.CfnOutput(this, 'HostedZoneId', {
        value: this.hostedZone.hostedZoneId,
        description: 'Route53 Hosted Zone ID',
      });

      new cdk.CfnOutput(this, 'NameServers', {
        value: cdk.Fn.join(',', this.hostedZone.hostedZoneNameServers || []),
        description: 'Name servers for domain configuration',
      });
    } else if (props.existingHostedZoneId) {
      // Use existing hosted zone (same account or cross-account)
      if (props.hostedZoneAccountId && props.hostedZoneAccountId !== this.account) {
        // Cross-account hosted zone - requires IAM role assumption
        if (!props.crossAccountDnsRoleArn) {
          throw new Error(
            'crossAccountDnsRoleArn is required when using cross-account hosted zone'
          );
        }

        // Create IAM role that can be assumed to manage DNS in the management account
        // Note: The actual role must exist in the management account
        // This construct will need to assume that role during deployment
        cdk.Annotations.of(this).addWarning(
          `Using cross-account hosted zone from account ${props.hostedZoneAccountId}. ` +
          `Ensure CDK has permissions to assume role: ${props.crossAccountDnsRoleArn}`
        );

        // For cross-account, we still reference by ID
        // Extract the zone name: for "staging.alva.paulrenenichols.com", zone is "alva.paulrenenichols.com"
        // The zone name is the domain minus the first label
        const domainParts = props.domainName.split('.');
        const zoneName = domainParts.length > 2 
          ? domainParts.slice(1).join('.') // Remove first label (e.g., "staging")
          : props.domainName;

        cdk.Annotations.of(this).addInfo(
          `Using cross-account hosted zone: ${props.existingHostedZoneId} in account ${props.hostedZoneAccountId} for zone ${zoneName}`
        );

        // Note: For cross-account Route53 records, CDK will attempt to create records.
        // However, if the hosted zone is in a different account, you may need:
        // 1. IAM role assumption (using crossAccountDnsRoleArn)
        // 2. Credentials that work in both accounts
        // 3. Or create records manually in the management account
        this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
          this,
          'CrossAccountHostedZone',
          {
            hostedZoneId: props.existingHostedZoneId,
            zoneName: zoneName,
          }
        );
      } else {
        // Same-account hosted zone
        this.hostedZone = route53.HostedZone.fromHostedZoneId(
          this,
          'ExistingHostedZone',
          props.existingHostedZoneId
        );
      }

      new cdk.CfnOutput(this, 'HostedZoneId', {
        value: props.existingHostedZoneId,
        description: 'Route53 Hosted Zone ID (existing)',
      });
    }
  }
}

