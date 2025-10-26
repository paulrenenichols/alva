# Phase 8: Invite System & Local Development

**@fileoverview** Implementation plan for invite-only authentication system, admin app, and local development setup with MailHog.

---

## Overview

This phase implements:
1. **Invite-only authentication** (no self-service signup)
2. **Admin application** for managing invites
3. **Expiring invite links** with resend functionality
4. **MailHog integration** for local email testing
5. **Database migrations** for invites table

**Estimated Duration**: 1-2 weeks

**Builds On**: Phase 7 - leverages the improved landing experience and authentication flow

---

## Current State

### ✅ Already Implemented

1. **Email Service**: Resend integration in `apps/auth/src/services/email.service.ts` ✅
2. **Database Schemas**: Users, verification tokens, refresh tokens ✅
3. **Docker Setup**: Local development with Docker Compose ✅
4. **Authentication**: JWT-based auth with magic links ✅
5. **Services**: 3 microservices (Web, API, Auth) ✅

### ❌ What's Missing

1. **Invite system**: No database schema or API for invites
2. **Admin app**: No admin interface for sending invites
3. **Email testing**: No local email testing setup (MailHog)

---

## Week 1: Invite System

### Day 1-2: Database & Invite Service

#### Database Schema

**File**: `libs/database/src/schemas/auth/invites.ts`

Create the invites table with proper relationships and indexes.

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
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

**Tasks**:
- [ ] Create database migration for invites table
- [ ] Run migration to create table
- [ ] Test table creation and relationships

#### Invite Service

**File**: `apps/auth/src/services/invite.service.ts`

Implement all invite operations: create, validate, mark as used, list with pagination.

```typescript
import crypto from 'crypto';
import { db } from '@alva/database';
import { invites } from '@alva/database/schemas';
import { eq } from 'drizzle-orm';

export class InviteService {
  generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

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

  async validateInvite(token: string) {
    const [invite] = await db.select().from(invites).where(eq(invites.token, token));

    if (!invite) return { valid: false, error: 'Invalid invite token' };
    if (invite.usedAt) return { valid: false, error: 'Invite has already been used' };
    if (new Date(invite.expiresAt) < new Date()) return { valid: false, error: 'Invite has expired' };

    return { valid: true, invite };
  }

  async markInviteAsUsed(token: string, userId: string) {
    return await db.update(invites)
      .set({ usedBy: userId, usedAt: new Date() })
      .where(eq(invites.token, token));
  }

  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const result = await db.select().from(invites).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: count() }).from(invites);

    return { invites: result, total: count };
  }
}
```

**Tasks**:
- [ ] Implement `InviteService` class
- [ ] Write unit tests for invite service
- [ ] Test all invite operations

### Day 3-4: Update Registration Flow

**File**: `apps/auth/src/routes/auth.ts`

Update registration to require invite token:

```typescript
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

  const inviteService = new InviteService();
  const validation = await inviteService.validateInvite(inviteToken);

  if (!validation.valid) {
    return reply.code(400).send({ error: validation.error });
  }

  const user = await userService.createUser(email);
  await inviteService.markInviteAsUsed(inviteToken, user.id);
  const token = await userService.createVerificationToken(user.id);
  await emailService.sendVerificationEmail(email, token);

  return {
    message: 'User registered successfully. Check your email for verification link.',
    userId: user.id,
  };
});
```

**Tasks**:
- [ ] Update registration endpoint
- [ ] Update auth client to send invite token
- [ ] Test registration with invite flow

---

## Week 2: Admin App & Email Testing

### Day 1-3: Admin Application

#### Create Admin App

**Structure**: `apps/admin/` (Next.js app)

```
apps/admin/
  ├── src/
  │   ├── app/
  │   │   ├── invites/
  │   │   │   ├── page.tsx      # List invites
  │   │   │   └── new/page.tsx # Send invite
  │   │   ├── layout.tsx
  │   │   └── login/page.tsx
  │   └── components/
  ├── Dockerfile
  └── project.json
```

**Tasks**:
- [ ] Generate Next.js app for admin portal
- [ ] Set up admin authentication
- [ ] Create invite list page
- [ ] Create send invite form
- [ ] Add resend functionality

#### Admin API Endpoints

**File**: `apps/auth/src/routes/admin.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { InviteService } from '../services/invite.service';
import { EmailService } from '../services/email.service';

export async function adminRoutes(fastify: FastifyInstance) {
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

    return { message: 'Invite sent successfully', invite };
  });

  // List invites
  fastify.get('/admin/invites', async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    const result = await inviteService.getInvites(parseInt(page), parseInt(limit));
    return result;
  });

  // Resend invite
  fastify.post('/admin/invites/:inviteId/resend', async (request, reply) => {
    const { inviteId } = request.params as { inviteId: string };
    // Get invite and resend email
    // ...
  });
}
```

**Tasks**:
- [ ] Create admin routes
- [ ] Create admin middleware
- [ ] Test admin API endpoints

### Day 4-5: MailHog Setup & Testing

#### Update Email Service

**File**: `apps/auth/src/services/email.service.ts`

Already updated! ✅ MailHog integration is complete.

#### Test Email Flow

**Tasks**:
- [ ] Start MailHog: `pnpm docker:up`
- [ ] Send test invite from admin app
- [ ] Verify email appears in MailHog UI at `http://localhost:8025`
- [ ] Test invite link functionality
- [ ] Test invite expiration
- [ ] Test resend functionality

---

## Implementation Checklist

### Week 1: Invite System

- [ ] Create database migration for invites table
- [ ] Run migration
- [ ] Implement `InviteService`
- [ ] Write tests for invite service
- [ ] Update registration to require invite token
- [ ] Update auth client
- [ ] Test full registration flow with invite

### Week 2: Admin App & MailHog

- [ ] Create admin app structure
- [ ] Implement admin middleware
- [ ] Build invite list page
- [ ] Build send invite form
- [ ] Add resend invite functionality
- [ ] Test MailHog integration
- [ ] Test email flow end-to-end
- [ ] Document local development setup

---

## Success Criteria

✅ **Invite-only authentication working**
- No self-service signup
- Invites required for registration
- Invite tokens expire after 7 days
- Registration flow validates and marks invites as used

✅ **Admin app functional**
- Admin can send invites by email
- Admin can view invite list
- Admin can resend expired invites
- Admin authentication secure

✅ **Local development working**
- MailHog integration working
- Email testing in development environment
- Invite flow tested locally
- All services run in Docker Compose

✅ **Database migrations complete**
- Invites table created
- Relationships properly set up
- Indexes added for performance

---

## Next Steps

After Phase 8 completion:
- Move to Phase 9: AWS Staging Deployment
- Set up CloudFormation infrastructure
- Configure CI/CD pipeline
- Deploy to staging environment

