# Phase 8: Invite System & Local Development - Implementation Plan

**@fileoverview** Detailed implementation plan for Phase 8, including roles system, password authentication, admin initialization, and admin app setup.

---

## Phase Overview

**Goal**: Implement invite-only authentication system with admin portal, user roles, password authentication for admins, and complete local development environment including MailHog.

**Duration**: 2-3 weeks (80-120 hours)

**Priority**: Critical - Foundation for secure, controlled user access

**Success Criteria**:
- ✅ Invite-only registration working
- ✅ Roles system implemented (admin, app_user, many-to-many)
- ✅ Admin users seeded with default passwords
- ✅ Password authentication for admins
- ✅ First login forces password reset
- ✅ Admin portal functional
- ✅ MailHog email testing working
- ✅ All services running locally in Docker
- ✅ Full invite flow tested end-to-end
- ✅ Admin app with Storybook

---

## Week 1: Database Schema & Roles System

### Day 1-2: Roles System

#### Task 1.1: Create Roles Schema
**Estimated Time**: 3 hours
**Owner**: Backend Developer
**Dependencies**: Database client setup

**File**: `libs/database/src/schemas/auth/roles.ts`

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Deliverables**:
- [ ] Roles schema file created
- [ ] Exported from index files
- [ ] Migration created
- [ ] Table created in database

**Acceptance Criteria**:
- Schema follows Drizzle patterns
- Unique constraint on name
- Can query roles table

#### Task 1.2: Create User-Roles Junction Table
**Estimated Time**: 2 hours
**Owner**: Backend Developer
**Dependencies**: Task 1.1

**File**: `libs/database/src/schemas/auth/user-roles.ts`

```typescript
import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { roles } from './roles';

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

**Deliverables**:
- [ ] UserRoles schema created
- [ ] Foreign keys configured
- [ ] Migration created
- [ ] Table created

**Acceptance Criteria**:
- Cascade deletes working
- Many-to-many relationship functional

### Day 3: Update Users Schema

#### Task 2.1: Add Password Fields to Users
**Estimated Time**: 2 hours
**Owner**: Backend Developer
**Dependencies**: Existing users schema

**File**: `libs/database/src/schemas/auth/users.ts`

Update existing users schema to add:
- `passwordHash` (nullable - for magic-link users)
- `mustResetPassword` (boolean - force password reset)

**Deliverables**:
- [ ] Users schema updated
- [ ] Migration created
- [ ] Existing data preserved

**Acceptance Criteria**:
- Password hash field allows NULL
- Must reset password defaults to false
- No breaking changes to existing users

### Day 4: Password Reset Tokens Schema

#### Task 3.1: Create Password Reset Tokens Schema
**Estimated Time**: 2 hours
**Owner**: Backend Developer

**File**: `libs/database/src/schemas/auth/password-reset-tokens.ts`

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

**Deliverables**:
- [ ] Schema file created
- [ ] Exported from index files
- [ ] Migration created
- [ ] Table created

### Day 5: Database Migration & Seed Scripts

#### Task 4.1: Run All Migrations
**Estimated Time**: 2 hours

```bash
# Generate migrations
pnpm db:generate

# Review generated files
# Should see: CREATE TABLE roles, user_roles, password_reset_tokens

# Run migrations
pnpm db:migrate
```

**Deliverables**:
- [ ] All tables created
- [ ] Foreign keys working
- [ ] Indexes created
- [ ] No errors

#### Task 4.2: Create Seed Scripts

**File**: `tools/scripts/seed-roles.ts`

Seed initial roles: `admin` and `app_user`

**File**: `tools/scripts/seed-admins.ts`

Seed 2 admin users with default password "admin", marked as must reset password.

**Update `package.json`**:
```json
"scripts": {
  "seed:roles": "tsx tools/scripts/seed-roles.ts",
  "seed:admins": "tsx tools/scripts/seed-admins.ts",
  "seed:all": "pnpm seed:roles && pnpm seed:admins"
}
```

**Deliverables**:
- [ ] Seed scripts created
- [ ] Package.json updated
- [ ] Can seed roles
- [ ] Can seed admins

**Test Commands**:
```bash
pnpm seed:roles
pnpm seed:admins
```

---

## Week 2: Invite System & Admin API

### Day 1-2: Invite Service Implementation

#### Task 5.1: Implement Invite Service
**Estimated Time**: 6 hours
**Owner**: Backend Developer

**File**: `apps/auth/src/services/invite.service.ts`

Implement:
- `generateInviteToken()` - Create unique token
- `createInvite(email, createdBy, expiryDays)` - Create invite
- `validateInvite(token)` - Validate invite (check expired, used)
- `markInviteAsUsed(token, userId)` - Mark as used
- `getInvites(page, limit)` - List invites with pagination

**Deliverables**:
- [ ] Service implemented
- [ ] Error handling
- [ ] TypeScript types
- [ ] Unit tests

**Acceptance Criteria**:
- Can create invites
- Validates expiry
- Prevents reuse
- Handles errors gracefully

### Day 3-4: Admin API Endpoints

#### Task 6.1: Create Admin Routes
**Estimated Time**: 6 hours
**Owner**: Backend Developer

**File**: `apps/auth/src/routes/admin.ts`

Endpoints:
- `POST /admin/invites` - Send invite
- `GET /admin/invites` - List invites
- `POST /admin/invites/:id/resend` - Resend invite

**File**: `apps/auth/src/middleware/admin.middleware.ts`

Create `requireAdmin` middleware that checks user has admin role.

**Deliverables**:
- [ ] Admin routes created
- [ ] Middleware checks roles
- [ ] Authentication required
- [ ] Error responses

**Acceptance Criteria**:
- Only admins can access
- Endpoints work correctly
- Proper error handling

#### Task 6.2: Admin Recovery Request Endpoint (NEW)

Add endpoint: `POST /admin/recovery-request`

```typescript
// Request a recovery email for an admin
fastify.post('/admin/recovery-request', async (request, reply) => {
  const { email } = request.body as { email: string };

  // Always return success to prevent enumeration
  // If user exists AND has admin role, create password reset token (1h expiry) and send recovery email

  return { message: 'If an account exists, a recovery link has been sent.' };
});
```

Deliverables:
- [ ] Endpoint created and documented
- [ ] Email template for admin recovery with expiring link
- [ ] Generic success response (no enumeration)

Acceptance Criteria:
- Submitting a valid admin email sends a recovery link
- Non-admin or non-existent emails do not reveal user existence

#### Task 6.3: Password Authentication

**File**: `apps/auth/src/routes/auth.ts`

Add endpoint: `POST /login-password`

```typescript
// Login with email and password
fastify.post('/login-password', async (request, reply) => {
  const { email, password } = request.body;
  
  // Find user
  const [user] = await db.select().from(users).where(eq(users.email, email));
  
  if (!user || !user.passwordHash) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
  
  // Check if must reset password
  if (user.mustResetPassword) {
    const resetToken = await createPasswordResetToken(user.id);
    return reply.code(403).send({
      error: 'Password reset required',
      code: 'MUST_RESET_PASSWORD',
      resetToken
    });
  }
  
  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = await generateRefreshToken(user.id);
  
  return { accessToken, user };
});
```

Add endpoint: `POST /reset-password`

```typescript
// Reset password
fastify.post('/reset-password', async (request, reply) => {
  const { token, newPassword } = request.body;
  
  // Validate token
  const validation = await validatePasswordResetToken(token);
  if (!validation.valid) {
    return reply.code(400).send({ error: validation.error });
  }
  
  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  // Update user
  await db.update(users)
    .set({ 
      passwordHash,
      mustResetPassword: false 
    })
    .where(eq(users.id, validation.userId));
  
  // Mark token as used
  await markResetTokenAsUsed(token);
  
  return { message: 'Password reset successful' };
});
```

**Deliverables**:
- [ ] Password login endpoint
- [ ] Password reset endpoint
- [ ] Password reset token service
- [ ] Error handling

**Acceptance Criteria**:
- Admins can login with password
- First login forces reset
- Reset token expires
- Password hashing with bcrypt
 - Reset endpoint returns tokens so admin UI can auto-sign-in after reset

---

## Week 3: Admin App Setup & Testing

### Day 1-2: Admin App Generation

#### Task 7.1: Generate Admin Next.js App

```bash
npx nx g @nx/next:app admin --directory=apps/admin --style=css --appDir=true
```

**Structure**:
```
apps/admin/
  ├── src/
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx              # Dashboard
  │   │   ├── login/page.tsx       # Admin login
  │   │   ├── reset-password/page.tsx
  │   │   └── invites/
  │   │       ├── page.tsx         # List invites
  │   │       └── new/page.tsx     # Send invite
  │   ├── components/
  │   │   ├── InviteList.tsx
  │   │   ├── InviteForm.tsx
  │   │   └── AdminLayout.tsx
  │   └── stores/
  ├── .storybook/
  ├── stories/
  ├── Dockerfile
  └── project.json
```

#### Task 7.2: Copy Storybook Config from Web App

```bash
# Copy Storybook configuration
cp -r apps/web/.storybook apps/admin/.storybook
cp -r apps/web/stories apps/admin/stories

# Update Storybook port in project.json
# web: 4400, admin: 4401
```

#### Task 7.3: Update Package.json Scripts

Add Storybook commands for both apps:

```json
{
  "scripts": {
    "storybook": "nx run web:storybook",
    "storybook:admin": "nx run admin:storybook",
    "storybook:web": "nx run web:storybook",
    "build-storybook:web": "nx run web:build-storybook",
    "build-storybook:admin": "nx run admin:build-storybook"
  }
}
```

**Deliverables**:
- [ ] Admin app generated
- [ ] Storybook config copied
- [ ] Scripts updated
- [ ] App structure created

**Acceptance Criteria**:
- Admin app runs on separate port
- Storybook works for both apps
- No conflicts with web app

### Day 3-4: Admin UI Implementation (UPDATED)

#### Task 8.1: Replace Admin Login with Recovery Screen

**File**: `apps/admin/src/app/login/page.tsx`

- Single email field and “Send recovery link” button
- Calls `POST /admin/recovery-request`
- Remove helper text about default credentials
- Show success state regardless of email validity

#### Task 8.2: Password Reset Page

**File**: `apps/admin/src/app/reset-password/page.tsx`

- Get reset token from query params
- Password and confirm password fields
- Validate passwords match and strength
- Submit reset request
- On success, store tokens and redirect to dashboard

#### Task 8.3: Invite List Page

**File**: `apps/admin/src/app/invites/page.tsx`

- Display table of invites
- Show email, created date, expiry, status
- Pagination
- Resend button for non-used invites
- Status badges (Pending, Used, Expired)

#### Task 8.4: Send Invite Form

**File**: `apps/admin/src/app/invites/new/page.tsx`

- Email input
- Validation
- Submit to API
- Success/error messages
- Redirect to list on success

**Deliverables**:
- [ ] All admin pages created
- [ ] Forms working
- [ ] API integration
- [ ] Error handling
- [ ] Navigation working

**Acceptance Criteria**:
- Can login with password
- Can reset password
- Can view invites
- Can send invites
- Proper error messages
- Responsive design

### Day 5: MailHog Testing

#### Task 9.1: Full End-to-End Testing

**Test Plan**:

```bash
# 1. Start all services
pnpm docker:up
pnpm dev

# 2. Seed initial data
pnpm seed:all

# 3. Request recovery on admin app
# http://localhost:3003/login
# Enter seeded admin email → submit → check MailHog for recovery email

# 4. Click recovery link → reset-password page
# 5. Set new password (enforced strength)
# 6. After submit, user should be signed in and land on dashboard
# 7. Send invite to test@example.com
# 8. Check MailHog: http://localhost:8025
# 9. Click invite link
# 10. Complete registration
```

**Test Cases**:
1. ✅ Admin cannot login directly; must request recovery
2. ✅ Recovery email appears in MailHog
3. ✅ Recovery link expires appropriately
4. ✅ Admin can set new password
5. ✅ Admin can send invites
6. ✅ Invite email appears in MailHog
7. ✅ Invite link works
8. ✅ Registration validates invite token
9. ✅ Invalid/expired/used tokens rejected
10. ✅ Valid invite creates user
11. ✅ Invite marked as used

**Deliverables**:
- [ ] All services running
- [ ] MailHog showing emails
- [ ] Invite flow working
- [ ] Password auth working
- [ ] All tests passing

**Acceptance Criteria**:
- Can see emails in MailHog
- Invite links work
- Registration validates properly
- Password reset works
- All edge cases handled
- No errors in logs

---

## Implementation Checklist

### Week 1: Database & Roles ✅
- [x] Create roles schema (`libs/database/src/schemas/auth/roles.ts`)
- [x] Create user-roles junction table
- [x] Create password-reset-tokens schema
- [x] Create invites schema
- [x] Update users schema (passwordHash, mustResetPassword)
- [ ] Run all migrations
- [x] Create seed script for roles
- [x] Create seed script for admin users
- [x] Update package.json with seed commands
- [ ] Test database setup

### Week 2: Invite System & Admin API
-- [ ] Implement InviteService
-- [ ] Create admin routes
-- [ ] Create admin middleware with role checking
-- [ ] Add admin recovery request endpoint
-- [ ] Add password reset endpoint (returns tokens on success)
-- [ ] Create password reset token service
-- [ ] Update registration flow to require invite
-- [ ] Update auth client

### Week 3: Admin App & Testing
- [ ] Generate admin Next.js app
- [ ] Copy Storybook config
- [ ] Update package.json scripts
- [ ] Create admin recovery screen (email-only)
- [ ] Remove default credentials helper text
- [ ] Create password reset page
- [ ] Create invite list page
- [ ] Create send invite form
- [ ] Set up MailHog testing
- [ ] Test full invite flow
- [ ] Document local development

---

## Files Created

### Database Schemas
- ✅ `libs/database/src/schemas/auth/roles.ts`
- ✅ `libs/database/src/schemas/auth/user-roles.ts`
- ✅ `libs/database/src/schemas/auth/password-reset-tokens.ts`
- [ ] `libs/database/src/schemas/auth/invites.ts` (update existing)
- [ ] Migration files

### Seed Scripts
- ✅ `tools/scripts/seed-roles.ts`
- ✅ `tools/scripts/seed-admins.ts`

### Services
- [ ] `apps/auth/src/services/invite.service.ts`
- [ ] `apps/auth/src/services/password-reset.service.ts`

### Routes & Middleware
- [ ] `apps/auth/src/routes/admin.ts`
- [ ] `apps/auth/src/middleware/admin.middleware.ts`
- [ ] Update `apps/auth/src/routes/auth.ts`

### Admin App
- [ ] `apps/admin/` (generated)
- [ ] `apps/admin/src/app/login/page.tsx` (Recovery screen)
- [ ] `apps/admin/src/app/reset-password/page.tsx`
- [ ] `apps/admin/src/app/invites/page.tsx`
- [ ] `apps/admin/src/app/invites/new/page.tsx`
- [ ] `apps/admin/.storybook/` (copied)
- [ ] `apps/admin/stories/` (copied)

### Updates
- ✅ Updated `libs/database/src/index.ts`
- ✅ Updated `libs/database/src/schemas/index.ts`
- ✅ Updated `libs/database/src/schemas/auth/users.ts`
- ✅ Updated `package.json`
 - [ ] Remove default credentials helper text from admin login UI
 - [ ] Add admin recovery request endpoint to auth service

---

## Success Criteria

### Roles System
- [ ] Users can have roles
- [ ] Many-to-many relationship working
- [ ] Admin middleware checks roles
- [ ] Can query user roles
- [ ] Cascade deletes working

### Password Authentication
- [ ] Admins cannot login directly from admin UI; must use recovery
- [ ] Password hashing with bcrypt
- [ ] First login forces password reset
- [ ] Password reset tokens expire
- [ ] Reset endpoint returns tokens and signs admin into app

### Invite System
- [ ] No self-service signup
- [ ] Invites required for registration
- [ ] Invite tokens expire after 7 days
- [ ] Used invites cannot be reused
- [ ] Admin can send invites

### Admin App
- [ ] Admin recovery flow works (email-only)
- [ ] Admin can send invites
- [ ] Admin can view invite list
- [ ] Admin can resend invites
- [ ] Storybook working for admin app

### Local Development
- [ ] MailHog integration working
- [ ] All services run in Docker
- [ ] Invite flow tested end-to-end
- [ ] Password reset tested end-to-end
- [ ] Seeding working

---

## Next Steps

After Phase 8 completion:
- Move to Phase 9: AWS Staging Deployment
- Set up CloudFormation infrastructure
- Configure CI/CD pipeline
- Deploy to staging environment
