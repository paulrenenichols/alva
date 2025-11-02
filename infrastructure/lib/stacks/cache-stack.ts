/**
 * @fileoverview Cache stack for Alva staging deployment.
 * Creates ElastiCache Redis cluster for BullMQ and caching.
 */

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

export interface CacheStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

export class CacheStack extends cdk.Stack {
  public readonly redisCluster: elasticache.CfnCacheCluster;
  public readonly redisEndpoint: string;

  constructor(scope: Construct, id: string, props: CacheStackProps) {
    super(scope, id, props);

    // Create subnet group for ElastiCache in private subnets
    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Alva Redis',
      subnetIds: props.vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    // Create ElastiCache Redis cluster (single node for staging)
    this.redisCluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 1,
      clusterName: 'alva-staging-redis',
      vpcSecurityGroupIds: [props.securityGroup.securityGroupId],
      cacheSubnetGroupName: subnetGroup.ref,
      engineVersion: '7.0',
    });

    // Store endpoint (will be available after deployment)
    // The endpoint address is already in the correct format
    this.redisEndpoint = this.redisCluster.attrRedisEndpointAddress;

    // Outputs
    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: this.redisCluster.attrRedisEndpointAddress,
      description: 'Redis endpoint address',
    });

    new cdk.CfnOutput(this, 'RedisPort', {
      value: this.redisCluster.attrRedisEndpointPort,
      description: 'Redis endpoint port',
    });
  }
}

