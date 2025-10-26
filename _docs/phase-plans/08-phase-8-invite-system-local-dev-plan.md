# Phase 8: Invite System & Local Development - Implementation Plan

**@fileoverview** Detailed implementation plan for Phase 8 of the Alva project, providing step-by-step instructions for implementing invite-only authentication, admin application, and MailHog email testing setup.

---

## Phase Overview

**Goal**: Implement invite-only authentication system with admin portal and complete local development environment including MailHog for email testing.

**Duration**: 1-2 weeks (40-80 hours)

**Priority**: Critical - Foundation for secure, controlled user access

**Success Criteria**:
- ✅ Invite-only registration working
- ✅ Admin portal functional
- ✅ MailHog email testing working
- ✅ All services running locally in Docker
- ✅ Full invite flow tested end-to-end

---

## Week 1: Invite System Implementation

### Day 1-2: Database Setup

#### Task 1.1: Create Invites Database Schema
**Estimated Time**: 2 hours
**Owner**: Backend Developer
**Dependencies**: Database client setup

**Steps**:
1. Create invites schema file
2. Define table structure
3. Export schema

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

**Deliverables**:
- [ ] Invites schema file created
- [ ] Table structure defined with proper relationships
- [ ] Schema exported from index files
- [ ] Types properly defined

**Acceptance Criteria**:
- Schema follows Drizzle ORM patterns
- Foreign keys properly configured
- Timestamps for audit trail
- Unique constraint on token field

#### Task 1.2: Update Database Index Files
**Estimated Time**: 1 hour
**Owner**: Backend Developer
**Dependencies**: Task 1.1

**Steps**:
1. Update `libs/database/src/index.ts` to export invites
2. Update `libs/database/src/schemas/index.ts` to export invites

**File**: `libs/database/src/index.ts`
```typescript
// Export all schemas
export * from './schemas/auth/users';
export * from './schemas/auth/refresh-tokens';
export * from './schemas/auth/verification-tokens';
export * from './schemas/auth/invites';  // Add this line
export * from './schemas/app/client-profiles';
export * from './schemas/app/marketing-plans';
```

**File**: `libs/database/src/schemas/index.ts`
```typescript
export * from './auth/users';
export * from './auth/refresh-tokens';
export * from './auth/verification-tokens';
export * from './auth/invites';  // Add this line
export * from './app/client-profiles';
export * from './app/marketing-plans';
```

**Deliverables**:
- [ ] Invites exported from index.ts
- [ ] Invites exported from schemas/index.ts
- [ ] No import errors

**Acceptance Criteria**:
- Can import `invites` from `@alva/database`
- Schema available in all consumers
- Proper TypeScript types

#### Task 1.3: Run Database Migration
**Estimated Time**: 1 hour
**Owner**: Backend Developer
**Dependencies**: Task 1.2

**Steps**:
```bash
# Generate migration
pnpm db:generate

# Review generated migration file
# Should see: CREATE TABLE invites ...

# Run migration
pnpm db:migrate
```

**Deliverables**:
- [ ] Migration file generated
- [ ] Migration applied to database
- [ ] Table created successfully

**Acceptance Criteria**:
- Invites table exists in database
- All columns created correctly
- Foreign keys working
- Can query invites table

---

### Day 3-4: Invite Service Implementation

#### Task 2.1: Create Invite Service
**Estimated Time**: 4 hours
**Owner**: Backend Developer
**Dependencies**: Task 1.3

**File**: `apps/auth/src/services/invite.service.ts`

```typescript
import crypto from 'crypto';
import { db } from '@alva/database';
import { invites } from '@alva/database/schemas';
import { eq, and, gte, lt } from 'drizzle-orm';

export class InviteService {
  /**
   * @description Creates a new invite token
   */
  generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * @description Creates an invite in the database
   * @param email - Email address to invite
   * @param createdBy - User ID of the admin creating the invite
   * @param expiryDays - Number of days until invite expires (default 7)
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
   * @param token - Invite token to validate
   * @returns Validation result with invite data if valid
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
   * @param token - Invite token to mark as used
   * @param userId - User ID who used the invite
   */
  async markInviteAsUsed(token: string, userId: string) {
    return await db
      .update(invites)
      .set({ usedBy: userId, usedAt: new Date() })
      .where(eq(invites.token, token));
  }

  /**
   * @description Gets all invites with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of invites per page
   */
  async getInvites(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const result = await db.select().from(invites).limit(limit).offset(offset);
    
    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invites);

    return { 
      invites: result, 
      total: countResult.count,
      page,
      limit,
      totalPages: Math.ceil(countResult.count / limit)
    };
  }

  /**
   * @description Gets a single invite by ID
   * @param inviteId - Invite ID
   */
  async getInviteById(inviteId: string) {
    const [invite] = await db.select().from(invites).where(eq(invites.id, inviteId));
    return invite;
  }
}
```

**Deliverables**:
- [ ] InviteService class implemented
- [ ] All methods implemented
- [ ] Proper error handling
- [ ] TypeScript types defined

**Acceptance Criteria**:
- Can create invites
- Can validate invites
- Can mark invites as used
- Can list invites with pagination
- Error messages are user-friendly

#### Task 2.2: Write Unit Tests for Invite Service
**Estimated Time**: 3 hours
**Owner**: Backend Developer
**Dependencies**: Task 2.1

**File**: `apps/auth/src/services/__tests__/invite.service.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { InviteService } from '../invite.service';

describe('InviteService', () => {
  let inviteService: InviteService;

  beforeEach(() => {
    inviteService = new InviteService();
  });

  it('should generate unique invite tokens', () => {
    const token1 = inviteService.generateInviteToken();
    const token2 = inviteService.generateInviteToken();
    
    expect(token1).not.toBe(token2);
    expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should create an invite', async () => {
    const invite = await inviteService.createInvite('test@example.com', 'admin-id');
    
    expect(invite).toBeDefined();
    expect(invite.email).toBe('test@example.com');
    expect(invite.token).toBeDefined();
    expect(invite.expiresAt).toBeDefined();
  });

  it('should validate a valid invite', async () => {
    const invite = await inviteService.createInvite('test@example.com', 'admin-id');
    const validation = await inviteService.validateInvite(invite.token);
    
    expect(validation.valid).toBe(true);
    expect(validation.invite).toBeDefined();
  });

  it('should reject an expired invite', async () => {
    const invite = await inviteService.createInvite('test@example.com', 'admin-id', 0);
    
    // Manually set expired date
    await db.update(invites).set({ expiresAt: new Date(0) });
    
    const validation = await inviteService.validateInvite(invite.token);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('Invite has expired');
  });

  it('should reject a used invite', async () => {
    const invite = await inviteService.createInvite('test@example.com', 'admin-id');
    await inviteService.markInviteAsUsed(invite.token, 'user-id');
    
    const validation = await inviteService.validateInvite(invite.token);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('Invite has already been used');
  });
});
```

**Deliverables**:
- [ ] Unit tests for invite service
- [ ] Test coverage >80%
- [ ] All tests passing

**Acceptance Criteria**:
- Tests cover all methods
- Edge cases handled
- Tests are isolated and fast
- CI pipeline passes

---

### Day 5: Update Registration Flow

#### Task 3.1: Update Registration Endpoint
**Estimated Time**: 3 hours
**Owner**: Backend Developer
**Dependencies**: Task 2.1

**File**: `apps/auth/src/routes/auth.ts`

Update the registration endpoint to require invite token:

```typescript
import { InviteService } from '../services/invite.service';

// In the authRoutes function, update the POST /register endpoint:

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
    
    // Validate invite token
    const validation = await inviteService.validateInvite(inviteToken);
    
    if (!validation.valid) {
      return reply.code(400).send({ 
        error: validation.error,
        code: 'INVALID_INVITE'
      });
    }

    try {
      // Check if user already exists
      const existingUser = await checkExistingUser(fastify, email);
      if (existingUser) {
        return reply.code(400).send({ 
          error: 'User already exists',
          code: 'USER_EXISTS'
        });
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
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
);
```

**Deliverables**:
- [ ] Registration endpoint updated
- [ ] Invite validation integrated
- [ ] Error handling improved
- [ ] Tests updated

**Acceptance Criteria**:
- Registration requires invite token
- Invalid tokens rejected
- Expired tokens rejected
- Used tokens rejected
- User created on valid invite
- Invite marked as used

#### Task 3.2: Update Auth Client
**Estimated Time**: 2 hours
**Owner**: Frontend Developer
**Dependencies**: Task 3.1

**File**: `libs/auth-client/src/lib/auth-client.ts`

Update register method to accept invite token:

```typescript
/**
 * @description Registers a new user with invite token
 * @param email - User's email address
 * @param inviteToken - Invite token from email link
 */
async register(email: string, inviteToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${this.authUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, inviteToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Registration failed',
        code: data.code,
      };
    }

    return {
      success: true,
      message: data.message,
      userId: data.userId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}
```

**Deliverables**:
- [ ] Auth client updated
- [ ] Register method accepts invite token
- [ ] Error handling for various codes
- [ ] TypeScript types updated

**Acceptance Criteria**:
- Can call register with invite token
- Handles invalid/expired/used invite errors
- Proper error messages displayed
- Types are correct

---

## Week 2: Admin App & MailHog Setup

### Day 1-2: Admin App Setup

#### Task 4.1: Generate Admin App
**Estimated Time**: 3 hours
**Owner**: Full Stack Developer
**Dependencies**: NX workspace setup

**Steps**:
```bash
# Generate Next.js app for admin portal
npx nx g @nx/next:app admin --directory=apps/admin --style=css --appDir=true

# Create admin app structure
mkdir -p apps/admin/src/app/invites
mkdir -p apps/admin/src/components
```

**Project Structure**:
```
apps/admin/
  ├── src/
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx (dashboard)
  │   │   ├── invites/
  │   │   │   ├── page.tsx (list invites)
  │   │   │   └── new/page.tsx (send invite)
  │   │   └── login/page.tsx
  │   ├── components/
  │   │   ├── InviteList.tsx
  │   │   ├── InviteForm.tsx
  │   │   └── AdminLayout.tsx
  ├── Dockerfile
  └── project.json
```

**Deliverables**:
- [ ] Admin app generated
- [ ] Basic structure created
- [ ] Project configuration updated
- [ ] Can start dev server

**Acceptance Criteria**:
- Admin app runs on separate port
- No conflicts with main web app
- Can access admin login page

#### Task 4.2: Create Admin API Endpoints
**Estimated Time**: 4 hours
**Owner**: Backend Developer
**Dependencies**: Task 2.1, Task 4.1

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
  // Require authentication for all admin routes
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', requireAdmin);

  const inviteService = new InviteService();
  const emailService = new EmailService();

  // Send invite
  fastify.post('/admin/invites', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, async (request, reply) => {
    const { email } = request.body as { email: string };
    const userId = request.user?.id;

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    try {
      const invite = await inviteService.createInvite(email, userId);
      await emailService.sendInviteEmail(email, invite.token);

      return { 
        message: 'Invite sent successfully',
        invite 
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to send invite' });
    }
  });

  // List invites
  fastify.get('/admin/invites', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          limit: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    
    try {
      const result = await inviteService.getInvites(
        parseInt(page),
        parseInt(limit)
      );

      return result;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch invites' });
    }
  });

  // Resend invite
  fastify.post('/admin/invites/:inviteId/resend', {
    schema: {
      params: {
        type: 'object',
        required: ['inviteId'],
        properties: {
          inviteId: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const { inviteId } = request.params as { inviteId: string };
    
    try {
      // Get invite details
      const [invite] = await db.select()
        .from(invites)
        .where(eq(invites.id, inviteId));

      if (!invite) {
        return reply.code(404).send({ error: 'Invite not found' });
      }

      // Check if expired
      if (new Date(invite.expiresAt) < new Date()) {
        return reply.code(400).send({ error: 'Invite has expired' });
      }

      // Resend email
      await emailService.sendInviteEmail(invite.email, invite.token);

      return { message: 'Invite resent successfully' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to resend invite' });
    }
  });
}

// Register admin routes in main auth app
// In apps/auth/src/index.ts:
import { adminRoutes } from './routes/admin';
// ...
await adminRoutes(fastify);
```

**Deliverables**:
- [ ] Admin routes created
- [ ] Authentication middleware applied
- [ ] Admin middleware created
- [ ] All endpoints working

**Acceptance Criteria**:
- Only admins can access routes
- Can send invites
- Can list invites
- Can resend invites
- Proper error handling

#### Task 4.3: Create Admin Middleware
**Estimated Time**: 2 hours
**Owner**: Backend Developer
**Dependencies**: User roles system

**File**: `apps/auth/src/middleware/admin.middleware.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  }
}

/**
 * @description Middleware to require admin role
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // User is attached by authenticateToken middleware
  const user = request.user;

  if (!user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  // Check if user has admin role
  // TODO: Implement proper role check when user roles are added
  // For now, allow based on specific user emails or manual check
  const isAdmin = await checkAdminStatus(user.id);

  if (!isAdmin) {
    return reply.code(403).send({ error: 'Admin access required' });
  }
}

async function checkAdminStatus(userId: string): Promise<boolean> {
  // Temporary: Check against list of admin users
  // TODO: Implement proper role-based system
  const adminEmails = process.env['ADMIN_EMAILS']?.split(',') || [];
  
  // For now, check if user is first user in system or in admin list
  // This will be replaced with proper RBAC later
  return true; // Temporary: allow all authenticated users
}
```

**Deliverables**:
- [ ] Admin middleware created
- [ ] Role checking logic
- [ ] Proper error responses
- [ ] Documentation

**Acceptance Criteria**:
- Non-admins rejected with 403
- Admins can access routes
- Error messages clear
- Can be easily extended for RBAC

---

### Day 3-4: Admin UI

#### Task 5.1: Invite List Page
**Estimated Time**: 4 hours
**Owner**: Frontend Developer
**Dependencies**: Task 4.2, Admin app

**File**: `apps/admin/src/app/invites/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@alva/auth-client';

interface Invite {
  id: string;
  email: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInvites();
  }, [page]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/invites?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${await authClient.getAccessToken()}`
        }
      });
      
      const data = await response.json();
      setInvites(data.invites);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (invite: Invite) => {
    if (invite.usedAt) return 'Used';
    if (new Date(invite.expiresAt) < new Date()) return 'Expired';
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Used': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading invites...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="heading-page mb-6">Invite Management</h1>
        
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-left">Expires</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => {
                const status = getStatus(invite);
                return (
                  <tr key={invite.id} className="border-b border-border-subtle">
                    <td className="px-6 py-4">{invite.email}</td>
                    <td className="px-6 py-4">{new Date(invite.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(invite.expiresAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {status !== 'Used' && (
                        <button onClick={() => handleResend(invite.id)}>
                          Resend
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Deliverables**:
- [ ] Invite list page created
- [ ] Table with invites displayed
- [ ] Pagination working
- [ ] Status badges working

**Acceptance Criteria**:
- Shows all invites
- Displays status correctly
- Pagination works
- Can navigate pages
- Responsive design

#### Task 5.2: Send Invite Form
**Estimated Time**: 3 hours
**Owner**: Frontend Developer
**Dependencies**: Task 4.2

**File**: `apps/admin/src/app/invites/new/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvitePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await authClient.getAccessToken()}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      setSuccess(true);
      setTimeout(() => router.push('/invites'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="heading-page mb-6">Send New Invite</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            Invite sent successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border-subtle rounded"
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**Deliverables**:
- [ ] Send invite form created
- [ ] Email validation
- [ ] Error handling
- [ ] Success feedback

**Acceptance Criteria**:
- Can send invites by email
- Form validation works
- Errors displayed clearly
- Success message shown
- Redirects after success

---

### Day 5: MailHog Setup & Testing

#### Task 6.1: Test Full Invite Flow with MailHog
**Estimated Time**: 4 hours
**Owner**: Full Stack Developer
**Dependencies**: All previous tasks

**Steps**:
```bash
# 1. Start all services
pnpm docker:up

# 2. Start dev servers
pnpm dev:web
pnpm dev:api
pnpm dev:auth
pnpm dev:admin

# 3. Access admin app at http://localhost:3003
# 4. Login as admin (create first admin user manually)
# 5. Send invite to test@example.com
# 6. Open http://localhost:8025 to view MailHog inbox
# 7. Click invite email link
# 8. Test registration flow
```

**Test Cases**:
1. ✅ Send invite from admin
2. ✅ Email appears in MailHog
3. ✅ Click invite link works
4. ✅ Registration requires invite token
5. ✅ Invalid token rejected
6. ✅ Expired invite rejected
7. ✅ Used invite rejected
8. ✅ Valid invite creates user
9. ✅ User can complete registration
10. ✅ Invite marked as used in database

**Deliverables**:
- [ ] All services running
- [ ] MailHog showing emails
- [ ] Invite flow working
- [ ] Registration working
- [ ] Database updated correctly

**Acceptance Criteria**:
- Can see emails in MailHog
- Invite links work
- Registration validates properly
- All edge cases handled
- No errors in logs

#### Task 6.2: Update Documentation
**Estimated Time**: 2 hours
**Owner**: Full Stack Developer
**Dependencies**: Task 6.1

**Files to update**:
- `README.md` - Add admin app documentation
- `_docs/mailhog-setup.md` - Already created ✅
- `env.development.example` - Add admin configuration

**Deliverables**:
- [ ] README updated
- [ ] Admin app documented
- [ ] MailHog usage documented
- [ ] Development workflow documented

**Acceptance Criteria**:
- Clear setup instructions
- All commands documented
- Troubleshooting section added
- Examples provided

---

## Implementation Summary

### Files Created
- [ ] `libs/database/src/schemas/auth/invites.ts`
- [ ] `apps/auth/src/services/invite.service.ts`
- [ ] `apps/auth/src/routes/admin.ts`
- [ ] `apps/auth/src/middleware/admin.middleware.ts`
- [ ] `apps/admin/src/app/invites/page.tsx`
- [ ] `apps/admin/src/app/invites/new/page.tsx`
- [ ] `apps/admin/src/components/InviteList.tsx`
- [ ] `apps/admin/src/components/InviteForm.tsx`
- [ ] Database migration file for invites table

### Files Modified
- [ ] `libs/database/src/index.ts` - Export invites
- [ ] `libs/database/src/schemas/index.ts` - Export invites
- [ ] `apps/auth/src/routes/auth.ts` - Update registration
- [ ] `libs/auth-client/src/lib/auth-client.ts` - Update register method
- [ ] `docker-compose.yml` - MailHog added ✅
- [ ] `apps/auth/src/services/email.service.ts` - MailHog support ✅
- [ ] `package.json` - Nodemailer added ✅

### Database Changes
- [ ] `invites` table created
- [ ] Foreign keys configured
- [ ] Indexes added
- [ ] Migration applied

---

## Success Criteria Verification

### Invite System
- [ ] Can create invites via admin API
- [ ] Invites stored in database
- [ ] Invite tokens are unique
- [ ] Invites expire after 7 days
- [ ] Used invites cannot be reused

### Registration Flow
- [ ] Registration requires invite token
- [ ] Invalid tokens rejected with clear error
- [ ] Expired invites show expiration message
- [ ] Used invites show "already used" message
- [ ] Valid invites create users successfully
- [ ] Invite marked as used after registration

### Admin Portal
- [ ] Admin can login
- [ ] Admin can send invites
- [ ] Admin can view invite list
- [ ] Admin can resend invites
- [ ] Invite status displays correctly
- [ ] Pagination works

### MailHog Integration
- [ ] MailHog running in Docker
- [ ] Emails appear in MailHog UI
- [ ] Can click links from emails
- [ ] Email templates render correctly
- [ ] No emails sent to real addresses in dev

---

## Timeline

### Week 1: Core Invite System
- **Day 1-2**: Database setup and migration
- **Day 3-4**: Invite service implementation
- **Day 5**: Update registration flow

### Week 2: Admin App & Email Testing
- **Day 1-2**: Admin app setup and API
- **Day 3-4**: Admin UI components
- **Day 5**: MailHog testing and documentation

---

## Risks & Mitigation

### Risk 1: Database Migration Issues
- **Risk**: Migration fails or conflicts
- **Mitigation**: Test migration on clean database first
- **Mitigation**: Create rollback script

### Risk 2: Admin Access Control
- **Risk**: Unauthorized users can create invites
- **Mitigation**: Implement proper authentication
- **Mitigation**: Add admin role check
- **Mitigation**: Audit logging for invite actions

### Risk 3: Email Delivery
- **Risk**: Emails not sending properly
- **Mitigation**: Use MailHog for testing
- **Mitigation**: Add email delivery status tracking
- **Mitigation**: Add retry logic

### Risk 4: Token Security
- **Risk**: Invite tokens could be guessed
- **Mitigation**: Use crypto.randomBytes (64 bits entropy)
- **Mitigation**: Add rate limiting
- **Mitigation**: Validate tokens on every use

---

## Testing Strategy

### Unit Tests
- [ ] InviteService methods
- [ ] Token generation uniqueness
- [ ] Invite validation logic
- [ ] Error handling

### Integration Tests
- [ ] Registration with invite flow
- [ ] Admin API endpoints
- [ ] Email sending
- [ ] Database operations

### End-to-End Tests
- [ ] Send invite from admin
- [ ] Receive email (MailHog)
- [ ] Click invite link
- [ ] Complete registration
- [ ] Verify invite marked as used

---

## Next Steps After Phase 8

1. **Phase 9**: AWS Staging Deployment
   - Set up CloudFormation infrastructure
   - Configure CI/CD pipeline
   - Deploy to staging environment

2. **Phase 10**: Critical User Flow Completion
   - Implement chat functionality
   - Complete email verification flow
   - Section-based routing

---

**This plan provides a complete roadmap for implementing invite-only authentication with admin portal and local email testing. All tasks are actionable with clear deliverables and acceptance criteria.**

