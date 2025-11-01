# Phase 8: Invite System & Local Development

**@fileoverview** Implementation plan for invite-only authentication system, user roles, admin portal, and local development setup with MailHog.

---

## Overview

This phase implements:

1. **Invite-only authentication** (no self-service signup)
2. **User roles system** (admin and app user, many-to-many)
3. **Password authentication** for admin users
4. **Admin application** for managing invites
5. **Admin initialization** with default admin accounts
6. **Expiring invite links** with resend functionality
7. **MailHog integration** for local email testing

**Estimated Duration**: 2-3 weeks (80-120 hours)

**Builds On**: Phase 7 - leverages the improved landing experience and authentication flow

---

## Current State

### ✅ Already Implemented

1. **Email Service**: Resend integration in `apps/auth/src/services/email.service.ts` ✅
2. **Database Schemas**: Users, verification tokens, refresh tokens ✅
3. **Docker Setup**: Local development with Docker Compose ✅
4. **Authentication**: JWT-based auth with magic links ✅
5. **Services**: 3 microservices (Web, API, Auth) ✅
6. **MailHog**: Added to docker-compose.yml ✅
7. **Email Service**: Supports MailHog + Resend ✅

### ❌ What's Missing

1. **Invite system**: Database schema and API
2. **Roles system**: No user roles
3. **Password auth**: No password login for admins
4. **Admin app**: No admin interface
5. **Admin initialization**: No default admin accounts

---

## Week 1: Database Schema & Roles System

### Day 1-2: Roles System

#### Task 1.1: Create Roles Schema

**File**: `libs/database/src/schemas/auth/roles.ts` (NEW)

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Tasks**:

- [ ] Create roles schema file
- [ ] Create userRoles junction table
- [ ] Export from index files
- [ ] Run database migration

#### Task 1.2: Update Users Schema

**File**: `libs/database/src/schemas/auth/users.ts`

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }), // NULL for magic-link users
  emailVerified: boolean('email_verified').default(false),
  mustResetPassword: boolean('must_reset_password').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Tasks**:

- [ ] Add passwordHash field (nullable)
- [ ] Add mustResetPassword field
- [ ] Run database migration

#### Task 1.3: Password Reset Tokens Schema

**File**: `libs/database/src/schemas/auth/password-reset-tokens.ts` (NEW)

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Tasks**:

- [ ] Create password reset tokens schema
- [ ] Export from index files
- [ ] Run database migration

### Day 3-4: Invites Schema

#### Task 2.1: Create Invites Schema

**File**: `libs/database/src/schemas/auth/invites.ts`

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

- [ ] Create invites schema file
- [ ] Export from index files
- [ ] Run database migration
- [ ] Test table creation

### Day 5: Admin Initialization

#### Task 3.1: Create Admin Seed Script

**File**: `tools/scripts/seed-admins.ts`

```typescript
import { db } from '@alva/database';
import { users, roles, userRoles } from '@alva/database/schemas';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const ADMIN_EMAILS = ['nicholaspino209@gmail.com', 'paul.rene.nichols@gmail.com'];

const DEFAULT_PASSWORD = 'admin';

export async function seedAdmins() {
  console.log('🌱 Seeding admin users...');

  // Get admin role
  const [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin')).limit(1);

  if (!adminRole) {
    throw new Error('Admin role not found. Run seed:roles first.');
  }

  // Create each admin
  for (const email of ADMIN_EMAILS) {
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing) {
      console.log(`User ${email} already exists, skipping...`);

      // Ensure admin role
      const [userRole] = await db
        .select()
        .from(userRoles)
        .where(and(eq(userRoles.userId, existing.id), eq(userRoles.roleId, adminRole.id)))
        .limit(1);

      if (!userRole) {
        await db.insert(userRoles).values({
          userId: existing.id,
          roleId: adminRole.id,
        });
        console.log(`✅ Added admin role to ${email}`);
      }
      continue;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        emailVerified: true,
        mustResetPassword: true, // Force password reset
      })
      .returning();

    // Assign admin role
    await db.insert(userRoles).values({
      userId: user.id,
      roleId: adminRole.id,
    });

    console.log(`✅ Created admin user: ${email}`);
  }

  console.log('🎉 Admin seeding complete!');
  console.log('Default password: "admin"');
  console.log('Admins will be prompted to reset password on first login');
}
```

**Tasks**:

- [ ] Create seed script
- [ ] Add to package.json scripts
- [ ] Test seeding
- [ ] Verify admin users created

---

## Week 2: Invite System & Admin API

### Day 1-2: Invite Service Implementation

#### Task 4.1: Implement Invite Service

**File**: `apps/auth/src/services/invite.service.ts`

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

    const [invite] = await db
      .insert(invites)
      .values({
        email,
        token,
        createdBy,
        expiresAt,
      })
      .returning();

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
    return await db.update(invites).set({ usedBy: userId, usedAt: new Date() }).where(eq(invites.token, token));
  }

  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const result = await db.select().from(invites).limit(limit).offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(invites);

    return {
      invites: result,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
```

**Tasks**:

- [ ] Implement InviteService
- [ ] Write unit tests
- [ ] Test all operations

### Day 3-4: Admin API Endpoints

#### Task 5.1: Create Admin Routes

**File**: `apps/auth/src/routes/admin.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { InviteService } from '../services/invite.service';
import { EmailService } from '../services/email.service';
import { db } from '@alva/database';
import { invites } from '@alva/database/schemas';
import { eq } from 'drizzle-orm';

export async function adminRoutes(fastify: FastifyInstance) {
  // Require authentication AND admin role
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', requireAdmin);

  const inviteService = new InviteService();
  const emailService = new EmailService();

  // Send invite
  fastify.post(
    '/admin/invites',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body as { email: string };
        const userId = request.user?.id;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const invite = await inviteService.createInvite(email, userId);
        await emailService.sendInviteEmail(email, invite.token);

        return {
          message: 'Invite sent successfully',
          invite,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to send invite' });
      }
    }
  );

  // List invites
  fastify.get('/admin/invites', async (request, reply) => {
    try {
      const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
      const result = await inviteService.getInvites(parseInt(page), parseInt(limit));

      return result;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch invites' });
    }
  });

  // Resend invite
  fastify.post('/admin/invites/:inviteId/resend', async (request, reply) => {
    try {
      const { inviteId } = request.params as { inviteId: string };

      const [invite] = await db.select().from(invites).where(eq(invites.id, inviteId));

      if (!invite) {
        return reply.code(404).send({ error: 'Invite not found' });
      }

      if (new Date(invite.expiresAt) < new Date()) {
        return reply.code(400).send({ error: 'Invite has expired' });
      }

      await emailService.sendInviteEmail(invite.email, invite.token);

      return { message: 'Invite resent successfully' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to resend invite' });
    }
  });
}
```

**Tasks**:

- [ ] Create admin routes
- [ ] Implement admin middleware
- [ ] Add role checking
- [ ] Test all endpoints

#### Task 5.2: Admin Recovery-only Login Flow (NEW)

Goal: Existing admins must not log in directly via password in the admin app. Instead, they must request a recovery email and complete a password reset before gaining access.

API changes:
- Add `POST /admin/recovery-request`
  - Body: `{ email: string }`
  - Behavior: If an admin user exists for the email, create a password reset token (1-hour expiry) and send a recovery email with a link to the admin reset page. Always return 200 with a generic success message to avoid email enumeration.
- Reuse existing `POST /reset-password` endpoint
  - On success: also generate access/refresh tokens and return them so the admin app can immediately sign the user in and redirect to the dashboard.

Admin app changes:
- Replace password login UI with a “Recovery” screen at `/login`:
  - Single email field + “Send recovery link” button
  - On submit: call `POST /admin/recovery-request`
  - Remove helper text: Default credentials message should be removed from the UI
- Keep `/reset-password` page; after submit, store returned tokens and navigate to the admin dashboard.

Security/behavior notes:
- Enforce `mustResetPassword = true` for seeded admins so direct password login is blocked until reset.
- Return generic success from recovery to prevent account enumeration.
- Recovery links expire in 1 hour (existing password reset tokens).

#### Task 5.2: Update Registration Flow

**File**: `apps/auth/src/routes/auth.ts`

```typescript
import { InviteService } from '../services/invite.service';

// Update registration endpoint
fastify.post(
  '/register',
  {
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
  },
  async (request, reply) => {
    const { email, inviteToken } = request.body as { email: string; inviteToken: string };

    const inviteService = new InviteService();
    const validation = await inviteService.validateInvite(inviteToken);

    if (!validation.valid) {
      return reply.code(400).send({
        error: validation.error,
        code: 'INVALID_INVITE',
      });
    }

    try {
      // Check if user exists
      const existingUser = await checkExistingUser(fastify, email);
      if (existingUser) {
        return reply.code(400).send({
          error: 'User already exists',
          code: 'USER_EXISTS',
        });
      }

      // Create user (no password hash - will use magic links)
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
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
);
```

**Tasks**:

- [ ] Update registration endpoint
- [ ] Require invite token
- [ ] Test with valid/invalid/expired/used invites
- [ ] Update auth client

---

## Week 3: Admin App & Authentication

### Day 1-2: Admin App Setup

#### Task 6.1: Generate Admin App

```bash
# Generate admin app (Next.js, same as web app)
npx nx g @nx/next:app admin --directory=apps/admin --style=css --appDir=true

# Add to nx.json dependencies
# Configure Storybook
```

**Structure**:

```
apps/admin/
  ├── src/
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx         # Dashboard
  │   │   ├── invites/
  │   │   │   ├── page.tsx     # List invites
  │   │   │   └── new/page.tsx # Send invite
  │   │   ├── login/page.tsx   # Admin login
  │   │   └── reset-password/page.tsx
  │   ├── components/
  │   └── stores/
  ├── .storybook/              # Storybook config
  ├── stories/                 # Storybook stories
  ├── Dockerfile
  └── project.json
```

**Tasks**:

- [ ] Generate admin app
- [ ] Copy Storybook config from web app
- [ ] Configure admin-specific settings
- [ ] Update nx.json

#### Task 6.2: Replace Admin Login with Recovery Screen (NEW)

Files:
- `apps/admin/src/app/login/page.tsx` → Recovery screen (email-only)
- Remove helper text: Default credentials line

Flow:
- Submit email → call `POST /admin/recovery-request` → show success state regardless of existence
- Email link → `/reset-password?token=...` → submit new password → receive tokens → redirect to dashboard

#### Task 6.3: Password Authentication

**File**: `apps/auth/src/routes/auth.ts`

```typescript
// Add password login endpoint
fastify.post(
  '/login-password',
  {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  },
  async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Check user exists and has password
    if (!user || !user.passwordHash) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    // Check if password reset required
    if (user.mustResetPassword) {
      const resetToken = crypto.randomBytes(32).toString('hex');

      await db.insert(passwordResetTokens).values({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

      // Send password reset email
      await emailService.sendPasswordResetEmail(user.email, resetToken);

      return reply.code(403).send({
        error: 'Password reset required',
        code: 'MUST_RESET_PASSWORD',
        resetToken: resetToken,
      });
    }

    // Generate tokens
    const accessToken = tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    // Set refresh token as httpOnly cookie
    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email },
    };
  }
);
```

**Tasks**:

- [ ] Add password login endpoint
- [ ] Add password reset endpoint
- [ ] Handle mustResetPassword flow
- [ ] Test password authentication

Note: Admin UI does not offer password login. The endpoint remains available for automated flows or future needs; access for seeded admins is still blocked until reset via `mustResetPassword`.

### Day 3-5: Admin UI & Testing

#### Task 7.1: Admin Login Page

**File**: `apps/admin/src/app/login/page.tsx` (now Recovery Screen)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:3002/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'MUST_RESET_PASSWORD') {
          // Redirect to password reset page
          router.push(`/reset-password?token=${data.resetToken}`);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      // Store access token
      localStorage.setItem('accessToken', data.accessToken);

      // Redirect to admin dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="heading-page mb-6">Admin Login</h1>

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded" required />
          </div>

          <button type="submit" className="w-full bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">
            Send recovery link
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Tasks**:

- [ ] Create recovery screen (email-only)
- [ ] Call recovery API and display success state
- [ ] Handle password reset redirect
- [ ] Store access token after reset and redirect

#### Task 7.2: Password Reset Page

**File**: `apps/admin/src/app/reset-password/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Redirect to login
      router.push('/login?message=Password reset successful');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="heading-page mb-2">Set Your Password</h1>
        <p className="body-default text-text-secondary mb-6">This is your first login. Please set a new password.</p>

        {error && <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              New Password
            </label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded" required minLength={8} />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              Confirm Password
            </label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded" required minLength={8} />
          </div>

          <button type="submit" className="w-full bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Tasks**:

- [ ] Create password reset page
- [ ] Handle password reset
- [ ] Validate password strength
- [ ] On success: store tokens and redirect to dashboard

#### Task 7.3: MailHog Testing

**Test Full Invite Flow**:

```bash
# 1. Start all services
pnpm docker:up
pnpm dev

# 2. Seed initial admins
pnpm seed:admins

# 3. Login to admin app
# http://localhost:3003/login
# Email: paul.rene.nichols@gmail.com
# Password: admin

# 4. Should be redirected to password reset

# 5. Set new password

# 6. Login with new password

# 7. Send invite to test@example.com

# 8. Check MailHog: http://localhost:8025

# 9. Click invite link

# 10. Complete registration
```

**Tasks**:

- [ ] Test admin login with default password
- [ ] Test password reset flow
- [ ] Test invite sending
- [ ] Test user registration with invite
- [ ] Verify MailHog showing emails

---

## Updated Implementation Checklist

### Week 1: Database & Roles

- [ ] Create roles schema (roles, userRoles)
- [ ] Create password reset tokens schema
- [ ] Create invites schema
- [ ] Update users schema (passwordHash, mustResetPassword)
- [ ] Run all migrations
- [ ] Create seed script for roles
- [ ] Create seed script for admin users
- [ ] Test database setup

### Week 2: Invite System & Admin API

- [ ] Implement InviteService
- [ ] Create admin routes
- [ ] Create admin middleware with role checking
- [ ] Update registration flow to require invite
- [ ] Add password login endpoint
- [ ] Add password reset endpoint
- [ ] Update auth client
- [ ] Add admin recovery request endpoint
- [ ] Return tokens on successful password reset

### Week 3: Admin App & Testing

- [ ] Generate admin Next.js app
- [ ] Copy Storybook config
- [ ] Create admin recovery screen at /login (email-only)
- [ ] Remove default credentials helper text from UI
- [ ] Create password reset page
- [ ] Create invite list page
- [ ] Create send invite form
- [ ] Set up MailHog testing
- [ ] Test full invite flow
- [ ] Document local development

---

## Success Criteria

✅ **Roles system working**

- Users can have roles
- Many-to-many relationship functional
- Admin middleware checks roles correctly
- Default admin users created

✅ **Password authentication working**

- Admins can login with password
- Password hashing with bcrypt
- First login forces password reset
- Password reset flow complete
- Admins cannot log in via password from the admin UI without recovery

✅ **Invite-only authentication working**

- No self-service signup
- Invites required for registration
- Invite tokens expire after 7 days
- Used invites cannot be reused

✅ **Admin app functional**

- Admin can login with password
- Admin can send invites
- Admin can view invite list
- Admin can resend invites
- Admin authentication secure

✅ **Local development working**

- MailHog integration working
- All services run in Docker Compose
- Invite flow tested end-to-end
- Password reset tested end-to-end

---

## Next Steps

After Phase 8 completion:

- Move to Phase 9: Docker Compose Local Development Optimization
  - Separate production and development Docker Compose configurations
  - Hot reload Dockerfiles for all services
  - Updated package.json scripts for development workflow
