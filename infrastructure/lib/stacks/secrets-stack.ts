/**
 * @fileoverview Secrets stack for Alva staging deployment.
 * Manages AWS Secrets Manager secrets for database credentials and application secrets.
 */

import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface SecretsStackProps extends cdk.StackProps {
  // No additional props needed
}

export class SecretsStack extends cdk.Stack {
  public readonly databaseSecret: secretsmanager.Secret;
  public readonly jwtPrivateKeySecret: secretsmanager.Secret;
  public readonly jwtPublicKeySecret: secretsmanager.Secret;
  public readonly jwtSecret: secretsmanager.Secret;
  public readonly cookieSecret: secretsmanager.Secret;
  public readonly openaiApiKeySecret: secretsmanager.Secret;
  public readonly resendApiKeySecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: SecretsStackProps) {
    super(scope, id, props);

    // Database credentials - auto-generated
    this.databaseSecret = new secretsmanager.Secret(this, 'DatabaseSecret', {
      description: 'Database credentials for Alva PostgreSQL',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'alva_admin' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // JWT Private Key (must be manually set)
    this.jwtPrivateKeySecret = new secretsmanager.Secret(this, 'JWTPrivateKeySecret', {
      description: 'JWT private key for token signing',
      // Value must be set manually after creation
    });

    // JWT Public Key (must be manually set)
    this.jwtPublicKeySecret = new secretsmanager.Secret(this, 'JWTPublicKeySecret', {
      description: 'JWT public key for token verification',
      // Value must be set manually after creation
    });

    // JWT Secret (must be manually set)
    this.jwtSecret = new secretsmanager.Secret(this, 'JWTSecret', {
      description: 'JWT secret for symmetric signing',
      // Value must be set manually after creation
    });

    // Cookie Secret (must be manually set)
    this.cookieSecret = new secretsmanager.Secret(this, 'CookieSecret', {
      description: 'Secret for cookie signing',
      // Value must be set manually after creation
    });

    // OpenAI API Key (must be manually set)
    this.openaiApiKeySecret = new secretsmanager.Secret(this, 'OpenAIApiKeySecret', {
      description: 'OpenAI API key for AI features',
      // Value must be set manually after creation
    });

    // Resend API Key (must be manually set)
    this.resendApiKeySecret = new secretsmanager.Secret(this, 'ResendApiKeySecret', {
      description: 'Resend API key for email sending',
      // Value must be set manually after creation
    });
  }
}

