# Phase 8: Invite-Only Authentication & AWS Deployment

**@fileoverview** Implementation plan for invite-only authentication system and AWS deployment infrastructure.

---

## Overview

This phase implements:
1. **Invite-only authentication** (no self-service signup)
2. **Admin application** for managing invites
3. **Expiring invite links** with resend functionality
4. **AWS infrastructure** using CloudFormation
5. **Staging environment** with CI/CD
6. **Local email testing** with MailHog

**Estimated Duration**: 2-3 weeks

---

## Current State

### ✅ Already Implemented

1. **Email Service**: Resend integration in `apps/auth/src/services/email.service.ts`
2. **Database Schemas**: Users, verification tokens, refresh tokens
3. **Docker Setup**: Local development with Docker Compose
4. **Authentication**: JWT-based auth with magic links
5. **Services**: 3 microservices (Web, API, Auth)

### ❌ What's Missing

1. **Invite system**: No database schema or API for invites
2. **Admin app**: No admin interface for sending invites
3. **AWS infrastructure**: No CloudFormation templates
4. **Staging environment**: No separate staging deployment
5. **Email testing**: No local email testing setup

---

## 1. Invite-Only Authentication System

### 1.1 Database Schema for Invites

**File**: `libs/database/src/schemas/auth/invites.ts`

```typescript
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const invites = pgTable('invites', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  usedBy: uuid('used_by').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 1.2 Invite Service

**File**: `apps/auth/src/services/invite.service.ts`

```typescript
import crypto from 'crypto';
import { db } from '@alva/database';
import { invites, users } from '@alva/database/schemas';
import { eq } from 'drizzle-orm';

export class InviteService {
  /**
   * @description Creates a new invite token
   */
  generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * @description Creates an invite in the database
   */
  async createInvite(email: string, createdBy: string, expiryDays: number = 7) {
    const token = this.generateInviteToken();
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const [invite] = await db.insert(invites).values({
      email,
      token,
      createdBy,
      expiresAt,
    }).returning();

    return invite;
  }

  /**
   * @description Validates an invite token
   */
  async validateInvite(token: string) {
    const [invite] = await db.select().from(invites).where(eq(invites.token, token));

    if (!invite) {
      return { valid: false, error: 'Invalid invite token' };
    }

    if (invite.usedAt) {
      return { valid: false, error: 'Invite has already been used' };
    }

    if (new Date(invite.expiresAt) < new Date()) {
      return { valid: false, error: 'Invite has expired' };
    }

    return { valid: true, invite };
  }

  /**
   * @description Marks an invite as used
   */
  async markInviteAsUsed(token: string, userId: string) {
    return await db
      .update(invites)
      .set({ usedBy: userId, usedAt: new Date() })
      .where(eq(invites.token, token));
  }

  /**
   * @description Gets all invites with pagination
   */
  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const result = await db.select().from(invites).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: count() }).from(invites);

    return { invites: result, total: count };
  }
}
```

### 1.3 Invite Email Template

**Update**: `apps/auth/src/services/email.service.ts`

```typescript
async sendInviteEmail(email: string, token: string) {
  if (!process.env['RESEND_API_KEY']) {
    console.warn('RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  const inviteUrl = `${process.env['WEB_URL']}/signup?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: 'Alva <noreply@alva.app>',
      to: [email],
      subject: 'You\'re invited to join Alva',
      html: this.getInviteEmailTemplate(inviteUrl, token),
    });

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

private getInviteEmailTemplate(inviteUrl: string, token: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px;">You're Invited to Alva!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          You've been invited to join Alva, your personal AI marketing director.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" 
           style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Accept Invitation
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 14px; color: #6b7280;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${inviteUrl}" style="color: #f97316;">${inviteUrl}</a>
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    </div>
  `;
}
```

---

## 2. Admin Application

### 2.1 Admin App Structure

Create a new admin app in the monorepo:

```
apps/
  ├── web/           # User-facing app
  ├── admin/         # Admin app (new)
  │   ├── src/
  │   │   ├── app/
  │   │   │   ├── invites/
  │   │   │   │   ├── page.tsx      # List invites
  │   │   │   │   └── new/
  │   │   │   │       └── page.tsx  # Send new invite
  │   │   │   └── layout.tsx
  │   │   └── components/
  │   ├── Dockerfile
  │   └── project.json
```

### 2.2 Admin API Endpoints

**File**: `apps/auth/src/routes/admin.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware'; // New middleware
import { InviteService } from '../services/invite.service';
import { EmailService } from '../services/email.service';

export async function adminRoutes(fastify: FastifyInstance) {
  // Require authentication for all admin routes
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', requireAdmin);

  const inviteService = new InviteService();
  const emailService = new EmailService();

  // Send invite
  fastify.post('/admin/invites', async (request, reply) => {
    const { email } = request.body as { email: string };
    const userId = request.user.id;

    const invite = await inviteService.createInvite(email, userId);
    await emailService.sendInviteEmail(email, invite.token);

    return { 
      message: 'Invite sent successfully',
      invite 
    };
  });

  // List invites
  fastify.get('/admin/invites', async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    
    const result = await inviteService.getInvites(
      parseInt(page),
      parseInt(limit)
    );

    return result;
  });

  // Resend invite
  fastify.post('/admin/invites/:inviteId/resend', async (request, reply) => {
    const { inviteId } = request.params as { inviteId: string };
    
    // Get invite details
    const [invite] = await db.select()
      .from(invites)
      .where(eq(invites.id, inviteId));

    if (!invite) {
      return reply.code(404).send({ error: 'Invite not found' });
    }

    await emailService.sendInviteEmail(invite.email, invite.token);

    return { message: 'Invite resent successfully' };
  });
}
```

### 2.3 Updated Registration Flow

**File**: `apps/auth/src/routes/auth.ts`

```typescript
// Update registration to require invite token
fastify.post('/register', {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'inviteToken'],
      properties: {
        email: { type: 'string', format: 'email' },
        inviteToken: { type: 'string' },
      },
    },
  },
}, async (request, reply) => {
  const { email, inviteToken } = request.body as { email: string; inviteToken: string };

  // Validate invite token
  const inviteService = new InviteService();
  const validation = await inviteService.validateInvite(inviteToken);

  if (!validation.valid) {
    return reply.code(400).send({ error: validation.error });
  }

  // Create user
  const user = await userService.createUser(email);

  // Mark invite as used
  await inviteService.markInviteAsUsed(inviteToken, user.id);

  // Send verification email
  const token = await userService.createVerificationToken(user.id);
  await emailService.sendVerificationEmail(email, token);

  return {
    message: 'User registered successfully. Check your email for verification link.',
    userId: user.id,
  };
});
```

---

## 3. Expiring Invite Links & Resend Functionality

### 3.1 Signup Page with Invite Token

**File**: `apps/web/app/signup/page.tsx`

```typescript
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@alva/auth-client';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  const handleSignup = async (email: string) => {
    if (!inviteToken) {
      setError('Invalid invite link');
      return;
    }

    try {
      const result = await authClient.register(email, inviteToken);
      
      if (result.error === 'Invite has expired') {
        setExpired(true);
      } else {
        // Show success message, redirect to verify email
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (expired) {
    return <ExpiredInviteMessage />;
  }

  return (
    <div>
      <h1>Complete Your Signup</h1>
      <EmailForm onSubmit={handleSignup} />
    </div>
  );
}
```

### 3.2 Resend Invite Functionality

When an invite expires, show option to request a new one:

**File**: `apps/web/components/auth/ExpiredInviteMessage.tsx`

```typescript
export function ExpiredInviteMessage() {
  return (
    <div className="text-center">
      <h2>This Invitation Link Has Expired</h2>
      <p>Invitation links expire after 7 days for security reasons.</p>
      <p>Please contact support to receive a new invitation.</p>
    </div>
  );
}
```

---

## 4. AWS Infrastructure (CloudFormation)

### 4.1 Infrastructure Structure

Create new directory:

```
infrastructure/
  ├── cloudformation/
  │   ├── network.yml           # VPC, subnets, security groups
  │   ├── rds.yml               # PostgreSQL RDS
  │   ├── redis.yml             # ElastiCache Redis
  │   ├── ecs.yml               # ECS cluster and services
  │   ├── alb.yml               # Application Load Balancer
  │   └── parameters.json       # Environment-specific params
  ├── scripts/
  │   ├── deploy.sh             # Deployment script
  │   └── setup-env.sh          # Environment setup
  └── terraform/                # Alternative to CloudFormation
      └── (optional)
```

### 4.2 CloudFormation Network Template

**File**: `infrastructure/cloudformation/network.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Network infrastructure for Alva'

Parameters:
  Environment:
    Type: String
    Default: staging
    AllowedValues: [staging, production]

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub 'alva-${Environment}-vpc'

  # Subnets, Internet Gateway, NAT Gateway, etc.

Outputs:
  VpcId:
    Value: !Ref VPC
    Export:
      Name: !Sub 'alva-${Environment}-vpc-id'
```

### 4.3 ECS Service Template

**File**: `infrastructure/cloudformation/ecs.yml`

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ECS services for Alva'

Resources:
  ECSService:
    Type: AWS::ECS::Service
    Properties:
      Cluster: !Ref ECSCluster
      ServiceName: !Sub 'alva-${Environment}'
      TaskDefinition: !Ref TaskDefinition
      DesiredCount: 2
      LaunchType: FARGATE
      NetworkConfiguration:
        AwsvpcConfiguration:
          Subnets: !Ref Subnets
          SecurityGroups:
            - !Ref SecurityGroup
          AssignPublicIp: ENABLED
```

### 4.4 Deployment Script

**File**: `infrastructure/scripts/deploy.sh`

```bash
#!/bin/bash

ENVIRONMENT=${1:-staging}
STACK_NAME="alva-${ENVIRONMENT}"

echo "Deploying to ${ENVIRONMENT} environment..."

# Deploy CloudFormation stacks
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/network.yml \
  --stack-name ${STACK_NAME}-network \
  --parameter-overrides \
    Environment=${ENVIRONMENT}

# Build and push Docker images to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest -f apps/web/Dockerfile .
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/alva-web:latest

# Deploy ECS services
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/ecs.yml \
  --stack-name ${STACK_NAME}-ecs \
  --parameter-overrides \
    Environment=${ENVIRONMENT}

echo "Deployment complete!"
```

---

## 5. Staging Environment

### 5.1 Staging Branch Setup

Create `staging` branch for automated deployments:

```bash
git checkout -b staging
git push origin staging
```

### 5.2 Update CI/CD for Staging

**File**: `.github/workflows/ci.yml` (add)

```yaml
deploy-staging:
  runs-on: ubuntu-latest
  needs: [docker-build]
  if: github.ref == 'refs/heads/staging'
  steps:
    - name: Deploy to Staging
      run: |
        echo "Deploying to staging..."
        ./infrastructure/scripts/deploy.sh staging

deploy-production:
  runs-on: ubuntu-latest
  needs: [docker-build]
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to Production
      run: |
        echo "Deploying to production..."
        ./infrastructure/scripts/deploy.sh production
```

### 5.3 Environment Configurations

Create environment-specific configs:

**File**: `.env.staging`

```bash
# Staging Environment
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

NEXT_PUBLIC_API_URL=https://api-staging.alva.app
NEXT_PUBLIC_AUTH_URL=https://auth-staging.alva.app
```

---

## 6. Local Email Testing (MailHog)

### 6.1 Update Docker Compose

**File**: `docker-compose.yml` (add)

```yaml
mailhog:
  image: mailhog/mailhog:latest
  ports:
    - '1025:1025'  # SMTP
    - '8025:8025'  # Web UI
```

### 6.2 Development Email Configuration

**File**: `env.development.example` (add)

```bash
# Local Email Testing
MAILHOG_HOST=mailhog
MAILHOG_PORT=1025

# Use MailHog in development
EMAIL_SERVICE_URL=http://localhost:1025
```

### 6.3 Email Service Adapter

**File**: `apps/auth/src/services/email.service.ts` (update)

```typescript
async sendInviteEmail(email: string, token: string) {
  // Use MailHog in development
  if (process.env['NODE_ENV'] === 'development') {
    return this.sendViaMailHog(email, token);
  }

  // Use Resend in production
  return this.sendViaResend(email, token);
}

private async sendViaMailHog(email: string, token: string) {
  const { MailHog } = require('mailhog');
  const mailhog = new MailHog({ host: 'localhost', port: 8025 });

  const inviteUrl = `${process.env['WEB_URL']}/signup?token=${token}`;

  return await mailhog.send({
    from: 'Alva <noreply@alva.local>',
    to: [email],
    subject: "You're invited to join Alva",
    html: this.getInviteEmailTemplate(inviteUrl, token),
  });
}
```

---

## Implementation Checklist

### Week 1: Invite System

- [ ] Create `invites` database schema
- [ ] Implement `InviteService`
- [ ] Add invite email templates
- [ ] Update registration flow to require invite
- [ ] Add invite expiration handling
- [ ] Test invite flow locally with MailHog

### Week 2: Admin Application

- [ ] Create admin app structure
- [ ] Implement admin middleware (require admin role)
- [ ] Build invite list page
- [ ] Build send invite form
- [ ] Add resend invite functionality
- [ ] Add admin authentication

### Week 3: AWS Infrastructure

- [ ] Create CloudFormation templates
- [ ] Set up VPC and networking
- [ ] Configure RDS for PostgreSQL
- [ ] Configure ElastiCache for Redis
- [ ] Set up ECS cluster
- [ ] Create Application Load Balancer
- [ ] Test deployment to staging

---

## Success Criteria

✅ **Invite-only authentication working**
- No self-service signup
- Invites required for registration
- Invite tokens expire after 7 days
- Resend functionality available

✅ **Admin app functional**
- Admin can send invites by email
- Admin can view invite list
- Admin can resend expired invites
- Admin authentication secure

✅ **AWS infrastructure deployed**
- Staging environment live
- Production environment configured
- CI/CD pipeline working
- Staging branch triggers staging deploy

✅ **Local development working**
- MailHog integration for email testing
- Docker Compose includes all services
- Local testing of invite flow works
- Development environment documented

---

## Next Steps

1. Implement database migration for `invites` table
2. Build invite service and API endpoints
3. Create admin application
4. Set up CloudFormation templates
5. Configure staging environment
6. Test full deployment pipeline

