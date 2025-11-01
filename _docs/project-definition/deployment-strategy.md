# Deployment Strategy for Alva

**@fileoverview** Comprehensive deployment strategy addressing invite-only authentication, admin portal, AWS infrastructure, and staging environment.

---

## Executive Summary

**Current Status**: Application is ready for deployment with minor additions needed:

- ✅ Email sending (Resend already configured)
- ⚠️ Invite-only system (needs implementation)
- ⚠️ Admin portal (needs to be built)
- ⚠️ AWS infrastructure (needs CloudFormation)
- ⚠️ Staging environment (needs setup)

**Recommended Approach**: Phased deployment with focus on security and reliability.

---

## 1. Email Sending Strategy

### ✅ Current State

- **Service**: Resend (`resend` npm package)
- **Location**: `apps/auth/src/services/email.service.ts`
- **Template**: HTML email templates for verification
- **Configuration**: `RESEND_API_KEY` environment variable

### 🎯 What Works

- Resend API integration ready
- Email templates exist
- Environment variables configured

### 📝 Recommendations

#### For Staging & Production

1. **Use Resend**: Current setup is production-ready
   - Use existing `RESEND_API_KEY`
   - Professional email delivery
   - Built-in analytics
   - $20/month for 50k emails

#### For Local Development

2. **Use MailHog**: Add to Docker Compose
   ```yaml
   mailhog:
     image: mailhog/mailhog:latest
     ports:
       - '1025:1025'
       - '8025:8025'
   ```
   - Access emails at `http://localhost:8025`
   - No external API needed

#### For Testing

3. **Mock Email Service**: Create test double
   - Store emails in memory during tests
   - Verify email content in tests
   - No external dependencies

---

## 2. Invite-Only Authentication

### 🎯 Current State

- Self-service registration exists
- Anyone can sign up with email
- No invite system implemented

### 📋 Implementation Plan

#### Database Changes

Add `invites` table:

```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id),
  used_by UUID REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Authentication Flow Changes

**Before (Current)**:

```
User submits email → User created → Verification email sent
```

**After (Invite-Only)**:

```
Admin sends invite → Email sent with invite link → User clicks link → User signs up with invite token → User created → Verification email sent
```

#### Registration Endpoint Update

```typescript
POST /auth/register
Body: { email: string, inviteToken: string }
```

#### Invite Token Validation

1. Check token exists
2. Check token not used
3. Check token not expired (7 days)
4. Mark token as used after signup

---

## 3. Admin Application

### 🎯 Requirements

- Send invites by email
- View list of sent invites
- Resend expired invites
- Track invite usage

### 📋 Implementation Options

#### Option A: Separate Admin App (Recommended)

- **Pros**: Security isolation, different auth requirements
- **Cons**: More code to maintain
- **Structure**:
  ```
  apps/
    ├── web/       # User-facing app
    └── admin/     # Admin portal (Next.js)
  ```

#### Option B: Admin Routes in Main App

- **Pros**: Simpler, shares components
- **Cons**: Security concerns, harder to restrict access
- **Structure**:
  ```
  apps/web/
    ├── app/admin/  # Admin routes
    └── middleware/admin.middleware.ts
  ```

### 🏗️ Recommended Structure

Create `apps/admin/` with:

```
apps/admin/
  ├── src/
  │   ├── app/
  │   │   ├── invites/page.tsx      # List invites
  │   │   ├── invites/new/page.tsx # Send invite
  │   │   └── layout.tsx
  │   └── components/
  ├── Dockerfile
  └── project.json
```

### 🎨 Admin UI Components Needed

1. **Invite List**: Table showing sent invites
2. **Send Invite Form**: Email input + send button
3. **Resend Invite**: Button for expired invites
4. **Invite Status**: Badge showing used/pending/expired

---

## 4. Expiring Invite Links

### ⏰ Expiration Strategy

- **Default**: 7 days
- **Configurable**: Via environment variable
- **Database**: `expires_at` timestamp
- **Validation**: Check on registration

### 🔗 Invite URL Format

```
https://alva.app/signup?token=abc123...
```

### 🚫 Expired Link Handling

When user visits expired invite:

1. Check token validity
2. If expired, show "Link Expired" message
3. Offer to request new invite (contact support)
4. Optionally: Auto-request new invite via API

### 📧 Resend Functionality

Admin can resend invite by:

- Finding invite in admin panel
- Clicking "Resend" button
- New email sent with same token (if not expired)
- Or create new invite if expired

---

## 5. AWS Infrastructure

### 🎯 Infrastructure Requirements

- **Web App**: Next.js app (SSR)
- **API Service**: Fastify server
- **Auth Service**: Fastify server
- **Database**: PostgreSQL
- **Cache**: Redis
- **Email**: Resend (external)

### 📋 Recommended AWS Services

#### Core Infrastructure

1. **VPC**: Network isolation
2. **ECS Fargate**: Container hosting
3. **RDS PostgreSQL**: Managed database
4. **ElastiCache**: Redis cache
5. **Application Load Balancer**: HTTP routing
6. **ECR**: Docker registry

#### Security

1. **Security Groups**: Network firewall rules
2. **IAM Roles**: Service permissions
3. **Secrets Manager**: Store credentials
4. **CloudWatch**: Logging & monitoring

#### Optional

1. **Route 53**: DNS management
2. **CloudFront**: CDN for web assets
3. **WAF**: Web Application Firewall

### 📝 CloudFormation vs Terraform

#### Option A: CloudFormation (AWS Native)

- **Pros**: Native to AWS, no extra tools
- **Cons**: Verbose YAML syntax
- **Best for**: AWS-only deployments

#### Option B: Terraform (Recommended)

- **Pros**: Cleaner syntax, better state management
- **Cons**: Additional tool to learn
- **Best for**: Multi-cloud or complex infrastructure

#### Option C: AWS CDK

- **Pros**: Use TypeScript for infrastructure
- **Cons**: Learning curve, compilation step
- **Best for**: TypeScript-heavy teams

### 🏗️ Infrastructure Files Structure

```
infrastructure/
  ├── cloudformation/
  │   ├── network.yml
  │   ├── database.yml
  │   ├── cache.yml
  │   ├── ecs.yml
  │   └── alb.yml
  ├── terraform/
  │   ├── main.tf
  │   ├── variables.tf
  │   └── outputs.tf
  └── scripts/
      ├── deploy.sh
      └── setup-env.sh
```

---

## 6. Staging Environment

### 🎯 Staging Requirements

- Mirror production architecture
- Separate database
- Separate domain (staging.alva.app)
- Auto-deploy from `staging` branch
- Production-like data (seeded)

### 📋 Branch Strategy

```
main       → Production (manual deploy)
staging    → Staging (auto-deploy)
develop    → Development features
feature/*  → Feature branches
```

### 🔄 CI/CD Pipeline

#### On `staging` branch push:

1. Run tests
2. Build Docker images
3. Push to ECR
4. Deploy to staging ECS
5. Run smoke tests

#### On `main` branch push:

1. Run tests
2. Build Docker images
3. Push to ECR
4. **Manual approval required**
5. Deploy to production ECS

### 📊 Environment Configuration

```yaml
# staging.env
DATABASE_URL=postgresql://staging-user:pass@staging-db.rds.amazonaws.com:5432/alva_staging
REDIS_URL=redis://staging-redis.elasticache.amazonaws.com:6379
ENVIRONMENT=staging
WEB_URL=https://staging.alva.app
API_URL=https://api-staging.alva.app
AUTH_URL=https://auth-staging.alva.app
```

---

## 7. Local Development with Email Testing

### 📋 Current Docker Setup

```yaml
services:
  postgres: ...
  redis: ...
  web: ...
  api: ...
  auth: ...
```

### ➕ Add MailHog

```yaml
mailhog:
  image: mailhog/mailhog:latest
  ports:
    - '1025:1025' # SMTP
    - '8025:8025' # Web UI
```

### 🔧 Development Environment

```bash
# Local development with MailHog
pnpm docker:up        # Start all services including MailHog
pnpm dev              # Start dev servers

# Send invite from admin portal
# Check inbox at http://localhost:8025
```

### 📧 Email Configuration

```bash
# Development uses MailHog
NODE_ENV=development
RESEND_API_KEY=re_xxx  # Not used in dev

# Staging/Production uses Resend
NODE_ENV=production
RESEND_API_KEY=re_xxx  # Real API key
```

---

## Implementation Priority

### Phase 1: Core Features (Week 1)

1. ✅ Add `invites` database schema
2. ✅ Implement `InviteService`
3. ✅ Update registration to require invite
4. ✅ Add invite expiration logic
5. ✅ Test with MailHog

### Phase 2: Admin Portal (Week 2)

1. ✅ Create admin app
2. ✅ Build invite management UI
3. ✅ Add send invite form
4. ✅ Add invite list with filters
5. ✅ Add resend functionality

### Phase 3: Infrastructure (Week 3)

1. ✅ Create CloudFormation/Terraform
2. ✅ Set up staging environment
3. ✅ Configure CI/CD for staging
4. ✅ Test deployment pipeline
5. ✅ Document deployment process

---

## Cost Estimates

### Staging Environment

- **ECS Fargate**: ~$30/month (2 tasks)
- **RDS**: ~$25/month (db.t3.micro)
- **ElastiCache**: ~$10/month (cache.t3.micro)
- **ALB**: ~$16/month
- **Data Transfer**: ~$10/month
- **Total**: ~$91/month

### Production Environment

- **ECS Fargate**: ~$60/month (4 tasks)
- **RDS**: ~$50/month (db.t3.small)
- **ElastiCache**: ~$25/month (cache.t3.small)
- **ALB**: ~$20/month
- **Data Transfer**: ~$50/month
- **Total**: ~$205/month

### Additional Services

- **Resend Email**: $20/month
- **Domain**: $12/year
- **Total**: ~$225/month

---

## Security Considerations

### 🔒 Invite System

- [ ] Invite tokens are cryptographically random
- [ ] Invite links expire after 7 days
- [ ] Used invites cannot be reused
- [ ] Email validation on signup
- [ ] Rate limiting on invite endpoint

### 👥 Admin Portal

- [ ] Admin-only routes protected
- [ ] Admin role required for access
- [ ] Audit logging for invite actions
- [ ] Invite list pagination (prevent DoS)
- [ ] Email rate limiting

### 🌐 Infrastructure

- [ ] Secrets in AWS Secrets Manager
- [ ] HTTPS only (TLS certificates)
- [ ] Security groups restrict access
- [ ] VPC for network isolation
- [ ] Regular security updates

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] CloudFormation templates reviewed
- [ ] CI/CD pipeline tested

### Staging Deployment

- [ ] Deploy to staging
- [ ] Verify all services healthy
- [ ] Test invite flow end-to-end
- [ ] Test admin portal
- [ ] Verify email delivery
- [ ] Performance testing

### Production Deployment

- [ ] Staging tests passed
- [ ] Manual approval obtained
- [ ] Backup production database
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify user flow
- [ ] Announce launch

---

## Next Steps

1. **Review this document** with team
2. **Choose infrastructure approach** (CloudFormation vs Terraform)
3. **Create database migration** for invites table
4. **Build invite service** in auth service
5. **Create admin portal** for managing invites
6. **Set up MailHog** for local development
7. **Create CloudFormation templates**
8. **Configure staging environment**
9. **Test full deployment pipeline**

---

## Questions to Answer

1. **Admin Access**: Who will have admin access? How do we grant admin roles?
2. **Invite Expiry**: Should it be configurable per invite or fixed?
3. **Resend Behavior**: Same token or generate new one?
4. **Email Template**: Customize email design or use default?
5. **Monitoring**: What metrics do we need to track?
6. **Rollback Plan**: How to rollback if deployment fails?

---

For detailed implementation guide, see: `_docs/phases/09-invite-only-deployment-plan.md`

