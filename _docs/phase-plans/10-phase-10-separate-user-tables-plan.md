# Phase 10 Implementation Plan: Separate Admin and Web User Tables

**@fileoverview** Detailed implementation plan for Phase 10 - separating admin and web users into distinct tables to enable self-invite testing and proper role isolation between applications.

---

## Implementation Overview

**Goal**: Separate admin users and web app users into distinct database tables with proper foreign key relationships and authentication context separation.

**Duration**: 2-3 weeks (80-120 hours)

**Success Criteria**:
- ✅ Separate `admin_users` and `web_users` tables
- ✅ Duplicate auth-related tables for each user type
- ✅ Proper foreign key relationships maintained
- ✅ JWT tokens include user type context
- ✅ Middleware validates user type appropriately
- ✅ Admins can invite themselves to web app
- ✅ All existing functionality preserved
- ✅ Zero data loss during migration

**Builds On**: Phase 9 - requires completed docker compose local development setup

---

## Week 1: Database Schema Refactoring

### Day 1-2: Create New User Tables and Auth Schemas

#### Task 1.1: Create Admin Users Schema

**File**: `libs/database/src/schemas/admin/admin-users.ts` (NEW)

```typescript
/**
 * @fileoverview Database schema definitions for admin users
 */

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(true),
  mustResetPassword: boolean('must_reset_password').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Tasks**:
- [ ] Create admin-users.ts schema file
- [ ] Export from schemas/index.ts
- [ ] Verify table structure

#### Task 1.2: Create Web Users Schema

**File**: `libs/database/src/schemas/web/web-users.ts` (NEW)

```typescript
/**
 * @fileoverview Database schema definitions for web app users
 */

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const webUsers = pgTable('web_users', {
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
- [ ] Create web-users.ts schema file
- [ ] Export from schemas/index.ts
- [ ] Verify table structure

#### Task 1.3: Create Admin Auth Tables

**Objective**: Create auth-related tables for admin users

**Files to Create**:
- `libs/database/src/schemas/admin/admin-roles.ts`
- `libs/database/src/schemas/admin/admin-user-roles.ts`
- `libs/database/src/schemas/admin/admin-refresh-tokens.ts`
- `libs/database/src/schemas/admin/admin-password-reset-tokens.ts`
- `libs/database/src/schemas/admin/admin-invites.ts`

**Pattern**: Duplicate all auth tables with admin_users references

**Example** (`libs/database/src/schemas/admin/admin-roles.ts`):
```typescript
export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Example** (`libs/database/src/schemas/admin/admin-user-roles.ts`):
```typescript
export const adminUserRoles = pgTable('admin_user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id')
    .notNull()
    .references(() => adminRoles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Tasks**:
- [ ] Create all admin auth schema files
- [ ] Update references to use adminUsers
- [ ] Export from schemas/index.ts
- [ ] Generate migration

#### Task 1.4: Create Web Auth Tables

**Objective**: Create auth-related tables for web users

**Files to Create**:
- `libs/database/src/schemas/web/web-roles.ts`
- `libs/database/src/schemas/web/web-user-roles.ts`
- `libs/database/src/schemas/web/web-refresh-tokens.ts`
- `libs/database/src/schemas/web/web-verification-tokens.ts`
- `libs/database/src/schemas/web/web-invites.ts`

**Pattern**: Duplicate all auth tables with web_users references

**Tasks**:
- [ ] Create all web auth schema files
- [ ] Update references to use webUsers
- [ ] Export from schemas/index.ts
- [ ] Generate migration

#### Task 1.5: Update App Tables Foreign Keys

**Objective**: Duplicate app tables for both user types

**Files to Update**:
- `libs/database/src/schemas/admin/admin-client-profiles.ts` (NEW)
- `libs/database/src/schemas/admin/admin-marketing-plans.ts` (NEW)
- `libs/database/src/schemas/web/web-client-profiles.ts` (NEW)
- `libs/database/src/schemas/web/web-marketing-plans.ts` (NEW)

**Note**: Web app users only need client profiles and marketing plans. Admin users may need admin-specific tables in the future.

**Example** (`libs/database/src/schemas/web/web-client-profiles.ts`):
```typescript
export const webClientProfiles = pgTable('web_client_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => webUsers.id, { onDelete: 'cascade' }),
  profileData: jsonb('profile_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Tasks**:
- [ ] Create web app schemas with proper foreign keys
- [ ] Create admin app schemas (if needed)
- [ ] Export all from schemas/index.ts
- [ ] Generate migration

---

### Day 3: Database Migration and Data Migration

#### Task 2.1: Generate Database Migration

**Commands**:
```bash
cd libs/database
pnpm db:generate
pnpm db:migrate
```

**Tasks**:
- [ ] Review generated migration SQL
- [ ] Verify all tables created correctly
- [ ] Check foreign key constraints

#### Task 2.2: Create Data Migration Script

**Objective**: Migrate existing users data to appropriate tables

**File**: `tools/scripts/migrate-users.ts` (NEW)

**Logic**:
1. Check existing users for admin role
2. If has admin role → insert into admin_users
3. If no admin role → insert into web_users
4. Map old IDs to new IDs
5. Migrate related auth records with new IDs

**Tasks**:
- [ ] Create migration script
- [ ] Test on dev database
- [ ] Document rollback procedure

---

## Week 2: JWT Token and Authentication Updates

### Day 1-2: Update JWT Token Payload

#### Task 3.1: Add User Type to Token Payload

**File**: `apps/auth/src/services/token.service.ts`

**Change**:
```typescript
export interface TokenPayload {
  userId: string;
  email: string;
  userType: 'admin' | 'web'; // NEW
}

generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, this.signKey, {
    algorithm: this.algorithm,
    expiresIn: process.env['JWT_ACCESS_EXPIRY'] || '15m',
  } as any);
}
```

**Tasks**:
- [ ] Update TokenPayload interface
- [ ] Update all generateAccessToken calls
- [ ] Add userType to all token generation

#### Task 3.2: Update Token Generation in Auth Routes

**File**: `apps/auth/src/routes/auth.ts`

**Files to Update**:
- `loginPasswordRoute` - Add userType based on which table user is in
- `verifyEmailRoute` - Add userType
- `resetPasswordRoute` - Add userType

**Example**:
```typescript
const accessToken = tokenService.generateAccessToken({
  userId: user.id,
  email: user.email,
  userType: 'admin', // or 'web'
});
```

**Tasks**:
- [ ] Update all token generation points
- [ ] Test token payload structure
- [ ] Verify JWT still validates correctly

### Day 3-4: Update Authentication Middleware

#### Task 4.1: Update Admin Middleware

**File**: `apps/auth/src/middleware/admin.middleware.ts`

**Changes**:
1. Check userType from JWT
2. Validate admin user exists in admin_users table
3. Check admin roles

**Example**:
```typescript
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user;

  if (!user || user.userType !== 'admin') {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  // Check if user exists in admin_users table
  const [adminUser] = await request.db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, user.userId))
    .limit(1);

  if (!adminUser) {
    return reply.code(401).send({ error: 'Invalid admin user' });
  }

  // Check admin role...
}
```

**Tasks**:
- [ ] Update admin middleware
- [ ] Test admin route protection
- [ ] Verify admin login works

#### Task 4.2: Update Auth Middleware

**File**: `apps/auth/src/middleware/auth.middleware.ts`

**Changes**:
1. Decode JWT with userType
2. Validate user exists in correct table (admin_users or web_users)
3. Attach full user object to request

**Example**:
```typescript
export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return reply.code(401).send({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    
    // Validate user in appropriate table based on userType
    if (decoded.userType === 'admin') {
      const user = await request.db.query.admin_users.findFirst({
        where: eq(adminUsers.id, decoded.userId),
      });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'admin' };
    } else if (decoded.userType === 'web') {
      const user = await request.db.query.web_users.findFirst({
        where: eq(webUsers.id, decoded.userId),
      });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid token' });
      }
      request.user = { ...user, userType: 'web' };
    } else {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    return reply.code(403).send({ error: 'Invalid token' });
  }
}
```

**Tasks**:
- [ ] Update auth middleware
- [ ] Test web app authentication
- [ ] Test admin app authentication

#### Task 4.3: Update API Middleware

**File**: `apps/api/src/middleware/auth.ts`

**Changes**:
1. Accept userType in JWT payload
2. Validate userType for route access
3. Optionally validate user exists in database

**Example**:
```typescript
export async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorate('authenticate', async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7);
      const publicKey = process.env['JWT_PUBLIC_KEY']!;

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
        userId: string;
        email: string;
        userType: 'admin' | 'web';
      };

      // Validate userType if needed
      if (decoded.userType !== 'web') {
        return reply.code(403).send({ error: 'Web app access only' });
      }

      request.user = decoded;
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });
}
```

**Tasks**:
- [ ] Update API middleware
- [ ] Add userType validation
- [ ] Test API authentication

---

## Week 3: Service Layer and Registration Updates

### Day 1-2: Update User Services

#### Task 5.1: Create Admin User Service

**File**: `apps/auth/src/services/admin-user.service.ts` (NEW)

**Methods**:
- `createAdminUser(email, passwordHash)`
- `findAdminUserByEmail(email)`
- `createAdminRefreshToken(userId, token)`
- `createAdminPasswordResetToken(userId, token)`

**Tasks**:
- [ ] Create admin user service
- [ ] Implement all CRUD methods
- [ ] Test admin user operations

#### Task 5.2: Create Web User Service

**File**: `apps/auth/src/services/web-user.service.ts` (NEW)

**Methods**:
- `createWebUser(email)`
- `findWebUserByEmail(email)`
- `createWebVerificationToken(userId, token)`
- `createWebRefreshToken(userId, token)`

**Tasks**:
- [ ] Create web user service
- [ ] Implement all CRUD methods
- [ ] Test web user operations

#### Task 5.3: Update Existing Services

**File**: `apps/auth/src/services/user.service.ts`

**Objective**: Deprecate or refactor to use new user services

**Tasks**:
- [ ] Review current user service usage
- [ ] Refactor to use admin/web user services
- [ ] Update all references

### Day 3-4: Update Registration and Invite Flow

#### Task 6.1: Update Invite Service

**File**: `apps/auth/src/services/invite.service.ts`

**Changes**:
1. Web invites reference web_users
2. Store created_by and used_by with proper types
3. Allow admin users to invite themselves

**Example**:
```typescript
async createInvite(email: string, createdBy: string, expiryDays: number = 7) {
  // Check if invite already exists
  const [existing] = await this.database
    .select()
    .from(webInvites)
    .where(eq(webInvites.email, email))
    .limit(1);

  if (existing && !existing.usedAt && new Date(existing.expiresAt) > new Date()) {
    throw new Error('Invite already exists and is still valid');
  }

  const token = this.generateInviteToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const [invite] = await this.database
    .insert(webInvites)
    .values({
      email,
      token,
      createdBy: createdBy, // admin user ID
      expiresAt,
    })
    .returning();

  return invite;
}
```

**Tasks**:
- [ ] Update invite service for web users
- [ ] Allow self-invite for admins
- [ ] Test invite creation

#### Task 6.2: Update Registration Endpoint

**File**: `apps/auth/src/routes/auth.ts`

**Changes**:
1. Create web_users instead of users
2. Use web_invites table
3. Use web_verification_tokens
4. Add userType to generated tokens

**Example**:
```typescript
async function registerUserRoute(
  fastify: FastifyInstance,
  webUserService: WebUserService,
  emailService: EmailService,
  inviteService: InviteService
): Promise<void> {
  fastify.post('/register', async (request, reply) => {
    const { email, inviteToken } = request.body;

    // Validate invite
    const validation = await inviteService.validateInvite(inviteToken);
    if (!validation.valid) {
      return reply.code(400).send({ error: validation.error });
    }

    // Check if web user exists
    const existing = await webUserService.findWebUserByEmail(email);
    if (existing) {
      return reply.code(400).send({ error: 'User already exists' });
    }

    // Create web user
    const user = await webUserService.createWebUser(email);

    // Mark invite as used
    await inviteService.markInviteAsUsed(inviteToken, user.id);

    // Create verification token
    const token = await webUserService.createWebVerificationToken(user.id);
    await emailService.sendVerificationEmail(email, token);

    return { message: 'User registered successfully', userId: user.id };
  });
}
```

**Tasks**:
- [ ] Update registration endpoint
- [ ] Test web user registration
- [ ] Verify invite validation

#### Task 6.3: Update Login Endpoints

**File**: `apps/auth/src/routes/auth.ts`

**Changes**:
1. Admin login checks admin_users table
2. Adds userType: 'admin' to token
3. Web user login checks web_users table (if implemented)
4. Adds userType: 'web' to token

**Tasks**:
- [ ] Update admin login
- [ ] Update web login if exists
- [ ] Test all login flows

---

## Week 4: Testing and Migration

### Day 1-2: Update Seed Scripts

#### Task 7.1: Update Admin Seed Script

**File**: `tools/scripts/seed-admins.ts`

**Changes**:
- Use adminUsers instead of users
- Use adminUserRoles instead of userRoles

**Tasks**:
- [ ] Update seed script
- [ ] Test admin seeding
- [ ] Verify admin roles assigned

#### Task 7.2: Create Web User Seed Script (Optional)

**File**: `tools/scripts/seed-web-users.ts` (NEW - Optional)

**Objective**: Create test web users if needed

**Tasks**:
- [ ] Create web user seed script
- [ ] Test web user seeding

### Day 3-5: End-to-End Testing

#### Task 8.1: Admin Self-Invite Test

**Test Flow**:
1. Login to admin app with seeded admin
2. Send invite to admin's own email
3. Click invite link
4. Complete registration
5. Verify web user created
6. Login to web app

**Tasks**:
- [ ] Test full admin self-invite flow
- [ ] Verify both accounts exist
- [ ] Verify separate login works

#### Task 8.2: Web User Invite Test

**Test Flow**:
1. Admin sends invite to new email
2. New user clicks link and registers
3. Verify web user created
4. Test web app login

**Tasks**:
- [ ] Test web user invite flow
- [ ] Verify invite validation
- [ ] Test web app access

#### Task 8.3: API Integration Testing

**Test Flow**:
1. Login to web app
2. Create client profile
3. Generate marketing plan
4. Verify data stored with correct userId

**Tasks**:
- [ ] Test web app API integration
- [ ] Verify foreign key relationships
- [ ] Test data isolation

#### Task 8.4: Admin App Testing

**Test Flow**:
1. Login to admin app
2. View invites
3. Send invites
4. Resend invites

**Tasks**:
- [ ] Test all admin functionality
- [ ] Verify admin-only access
- [ ] Test admin role checks

### Day 4-5: Cleanup and Documentation

#### Task 9.1: Remove Old Schemas

**Objective**: Remove or deprecate old unified users table

**Tasks**:
- [ ] Review all uses of old users table
- [ ] Update or remove old schemas
- [ ] Update exports

#### Task 9.2: Update Documentation

**Files to Update**:
- `README.md` - Update database schema docs
- `_docs/phases/10-separate-user-tables.md` - Phase documentation
- API documentation

**Tasks**:
- [ ] Update README
- [ ] Document new schema structure
- [ ] Update API docs

---

## Testing Checklist

### Database Schema
- [ ] All tables created correctly
- [ ] Foreign keys working
- [ ] Unique constraints enforced
- [ ] Indexes created

### Authentication
- [ ] Admin login works
- [ ] Web user registration works
- [ ] JWT tokens include userType
- [ ] Token validation works for both types

### Authorization
- [ ] Admin middleware blocks non-admins
- [ ] API middleware validates userType
- [ ] Web app access restricted to web users
- [ ] Admin app access restricted to admins

### Invite System
- [ ] Admins can create invites
- [ ] Self-invite works for admins
- [ ] Invite validation works
- [ ] Used invites can't be reused

### Data Migration
- [ ] Existing data migrated correctly
- [ ] No data loss
- [ ] All relationships preserved
- [ ] Rollback tested

### End-to-End
- [ ] Admin can invite themselves to web app
- [ ] Admin can invite new users
- [ ] New users can register
- [ ] Both apps function independently
- [ ] Data isolation working

---

## Risk Mitigation

### Migration Risks

**Risk**: Data loss during migration
- **Mitigation**: Comprehensive backup, test migration on copy first

**Risk**: Foreign key constraint violations
- **Mitigation**: Careful mapping of old IDs to new IDs, verify all relationships

**Risk**: Breaking existing authentication
- **Mitigation**: Thorough testing, gradual rollout if possible

### Architecture Risks

**Risk**: Token validation complexity
- **Mitigation**: Clear separation in middleware, comprehensive tests

**Risk**: Duplicate code across admin/web schemas
- **Mitigation**: Consider shared utilities, document pattern clearly

**Risk**: Performance impact of additional tables
- **Mitigation**: Proper indexing, query optimization testing

---

## Success Metrics

### Functionality
- ✅ Admins can invite themselves to web app
- ✅ Separate authentication for admin and web apps
- ✅ All existing features work
- ✅ Zero data loss

### Code Quality
- ✅ Clean schema separation
- ✅ Proper foreign key relationships
- ✅ Reusable service patterns
- ✅ Comprehensive test coverage

### Developer Experience
- ✅ Clear documentation
- ✅ Straightforward migration process
- ✅ Easy to understand architecture
- ✅ Fast development iteration

---

## Deliverables

1. **Database Schemas**
   - admin_users table
   - web_users table
   - All duplicated auth tables
   - Proper foreign keys

2. **JWT Updates**
   - userType in token payload
   - Updated token generation
   - Updated validation

3. **Services**
   - Admin user service
   - Web user service
   - Updated invite service

4. **Documentation**
   - Updated schema docs
   - Migration guide
   - Testing guide

5. **Tests**
   - Admin self-invite test
   - Web user invite test
   - Full integration tests

6. **Web App Authentication Pages**
   - `/login` page with email/password for web users
   - `/signup` page for invite-based registration with password setup
   - Updated auth client with proper invite flow
   - Password login route for web users

---

## Week 3: Web App Authentication Implementation

### Day 1-2: Create Web Login and Signup Pages

#### Task 3.1: Create /login Page for Web App

**File**: `apps/web/app/login/page.tsx` (NEW)

**Objective**: Create password-based login page for web users

**Key Features**:
- Email and password input fields
- Proper dark mode styling
- Error handling
- Redirect to dashboard on success
- Link to signup/recovery if needed

**Tasks**:
- [ ] Create /login page with password form
- [ ] Add proper dark mode styling
- [ ] Handle authentication errors
- [ ] Test login flow end-to-end

#### Task 3.2: Create /signup Page for Invite-Based Registration

**File**: `apps/web/app/signup/page.tsx` (NEW)

**Objective**: Create invite-based signup page with password setup

**Key Features**:
- Accepts invite token from query params
- Email and password setup form
- Password confirmation
- Validates invite token
- Marks invite as used on success
- Redirects to onboarding/dashboard

**Tasks**:
- [ ] Create /signup page with token validation
- [ ] Add password setup form
- [ ] Connect to backend invite validation
- [ ] Handle expired/invalid invites
- [ ] Test signup flow end-to-end

### Day 3: Update Auth Service for Web Password Login

#### Task 3.3: Add Web User Password Login Route

**File**: `apps/auth/src/routes/auth.ts` (UPDATE)

**Objective**: Add password-based login for web users

**Key Features**:
- Separate route from admin login
- Validates web user credentials
- Returns JWT with userType='web'
- Creates refresh token for web users

**Implementation**:
```typescript
async function loginWebPasswordRoute(
  fastify: FastifyInstance,
  webUserService: WebUserService,
  tokenService: TokenService
): Promise<void> {
  fastify.post('/login-web-password', {
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
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
    
    try {
      const user = await webUserService.findWebUserByEmail(email);
      if (!user || !user.passwordHash) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const accessToken = tokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        userType: 'web',
      });
      const refreshToken = tokenService.generateRefreshToken();
      await webUserService.createWebRefreshToken(user.id, refreshToken);
      
      setRefreshTokenCookie(reply, refreshToken);
      
      return {
        accessToken,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
```

**Tasks**:
- [ ] Add web password login route
- [ ] Test with web user credentials
- [ ] Verify JWT includes userType='web'
- [ ] Test refresh token creation

### Day 4: Update Auth Client and Registration Flow

#### Task 3.4: Update Auth Client for Invite-Based Registration

**File**: `libs/auth-client/src/lib/auth-client.ts` (UPDATE)

**Objective**: Update auth client to support invite-based registration

**Key Changes**:
- Add `registerWithInvite(email, inviteToken, password)` method
- Add `loginWithPassword(email, password)` method
- Update error handling

**Tasks**:
- [ ] Add invite-based registration method
- [ ] Add password login method
- [ ] Update error handling
- [ ] Test all auth flows

#### Task 3.5: Update Web User Service for Password Management

**File**: `apps/auth/src/services/web-user.service.ts` (UPDATE)

**Objective**: Add password hashing and verification methods

**Key Features**:
- Hash password on user creation
- Update password method
- Verify password on login

**Tasks**:
- [ ] Add password hashing to user creation
- [ ] Add password update method
- [ ] Test password operations

---

## Next Steps

After Phase 10 completion:
- Move to Phase 11: AWS Staging Deployment
  - Deploy separated user tables to staging environment
  - Test admin self-invite functionality in staging
- Continue with Phase 12-14 as planned
- Monitor admin self-invite feature usage in production

