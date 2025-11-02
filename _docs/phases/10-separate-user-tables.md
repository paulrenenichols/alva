# Phase 10: Separate Admin and Web User Tables

**@fileoverview** Phase documentation for separating admin and web users into distinct database tables to enable proper role isolation and self-invite testing.

---

## Overview

This phase implements a major architectural change to separate admin users and web app users into distinct database tables. This enables:

1. **Self-invite testing** - Admins can invite themselves to test the web app
2. **Proper role isolation** - Admin and web app roles are completely separate
3. **Independent authentication** - Each app type has its own auth tables
4. **Data separation** - Clear boundaries between admin and user data

**Duration**: 2-3 weeks (80-120 hours)

**Priority**: High - Enables critical testing workflow

---

## Current State

### ✅ What Exists

- Unified `users` table with roles
- Admin login and web user registration working
- Invite system functional
- All auth tables (roles, user_roles, invites, etc.)

### ❌ What's Missing

- Separate user tables for admin vs web users
- Ability to test inviting yourself from admin to web app
- Complete role isolation between apps
- Proper separation of concerns

### 🔴 The Problem

Currently, admins can't invite themselves to the web app because:

- Both admin and web users exist in the same `users` table
- Registration endpoint checks if email already exists
- Same email = same user = can't create duplicate

---

## Solution Architecture

### Separate User Tables

```
admin_users
├── id (PK)
├── email
├── password_hash
├── email_verified
└── must_reset_password

web_users
├── id (PK)
├── email
├── password_hash
├── email_verified
└── must_reset_password
```

### Duplicated Auth Tables

**Admin Auth Tables**:

- admin_roles
- admin_user_roles
- admin_refresh_tokens
- admin_password_reset_tokens
- admin_invites

**Web Auth Tables**:

- web_roles
- web_user_roles
- web_refresh_tokens
- web_verification_tokens
- web_invites

### JWT Token Context

JWT tokens now include `userType`:

```typescript
{
  userId: string;
  email: string;
  userType: 'admin' | 'web'; // NEW
}
```

---

## Implementation Plan

### Week 1: Database Schema

- Create admin_users and web_users tables
- Duplicate all auth tables for both types
- Update foreign key relationships
- Generate migrations

### Week 2: Authentication Updates

- Add userType to JWT payload
- Update token generation
- Update authentication middleware
- Add userType validation

### Week 3: Services and Registration

- Create admin/user user services
- Update invite service for web users
- Update registration flow
- Update login endpoints

### Week 4: Testing and Migration

- Migrate existing data
- Update seed scripts
- End-to-end testing
- Documentation

---

## Key Changes

### Database

**Before**:

```sql
users
├── Uses single table for all users
└── roles distinguish admin vs app_user

client_profiles
└── user_id → users.id

marketing_plans
└── user_id → users.id
```

**After**:

```sql
admin_users
└── Separate table for admin users

web_users
└── Separate table for web app users

web_client_profiles
└── user_id → web_users.id

web_marketing_plans
└── user_id → web_users.id
```

### Authentication

**Before**:

```typescript
// Single user lookup
const user = await db.query.users.findFirst({
  where: eq(users.id, decoded.userId),
});
```

**After**:

```typescript
// Conditional lookup based on userType
if (decoded.userType === 'admin') {
  const user = await db.query.admin_users.findFirst({
    where: eq(adminUsers.id, decoded.userId),
  });
} else {
  const user = await db.query.web_users.findFirst({
    where: eq(webUsers.id, decoded.userId),
  });
}
```

### Invite Flow

**Before**:

- Invites reference `users` table
- Can't invite if user already exists
- Admin can't invite themselves

**After**:

- Admin invites reference `web_users` table
- Admin can invite themselves (different table)
- Separate invite tables per user type

### Web App Authentication

**Current Issues**:

- Magic link auth only - no password-based login
- Registration doesn't require invite token despite backend expecting it
- Missing `/signup` page for invite-based registration
- Missing `/login` page at root for web app
- No password setup flow from invite links

**Needed Fixes**:

1. Create `/login` page with email/password login for web users
2. Create `/signup` page that accepts invite token and allows password setup
3. Update auth client to support invite-based registration
4. Add password-based login route for web users in auth service
5. Update frontend auth flow to use proper invite + password setup

---

## Testing Strategy

### Unit Tests

- User service methods
- Token generation
- Middleware validation

### Integration Tests

- Admin login flow
- Web user registration
- Invite creation and validation

### End-to-End Tests

1. Admin invites themselves to web app
2. New user invited and registers with password
3. Web users can login with email/password
4. Admin users can login with email/password
5. Both apps function independently

---

## Migration Strategy

### Data Migration

1. **Backup existing data**
2. **Migrate users**:
   - Check for admin role
   - Copy to admin_users if admin
   - Copy to web_users if not admin
3. **Migrate auth records**:
   - Map old user IDs to new IDs
   - Update all foreign keys
4. **Verify relationships**

### Rollback Plan

1. Keep old users table until verified
2. Document ID mappings
3. Test rollback on dev database
4. Keep backups for 30 days

---

## Success Criteria

### Functional

- ✅ Admin can invite themselves to web app
- ✅ Separate authentication works for both apps
- ✅ All existing features preserved
- ✅ Zero data loss during migration
- ✅ Web app password-based login implemented
- ✅ Invite-based signup flow with password setup
- ✅ Proper login/signup pages at /login and /signup
- ✅ Dark mode styling fixes for dashboard
- ✅ WEB_URL configured for invite emails

### Technical

- ✅ Clean schema separation
- ✅ Proper foreign key relationships
- ✅ JWT tokens include userType
- ✅ Middleware validates appropriately

### Quality

- ✅ Comprehensive test coverage
- ✅ Clear documentation
- ✅ No security regressions
- ✅ Performance maintained

---

## Risks and Mitigation

| Risk                        | Impact | Mitigation                                  |
| --------------------------- | ------ | ------------------------------------------- |
| Data loss during migration  | High   | Comprehensive backups, test migration first |
| Breaking authentication     | High   | Thorough testing, gradual rollout           |
| Foreign key violations      | Medium | Careful ID mapping, validation              |
| Token validation complexity | Medium | Clear separation, extensive tests           |
| Duplicate code              | Low    | Document pattern, consider utilities        |

---

## Dependencies

### Builds On

- Phase 8: Invite System & Local Development
- Phase 9: Docker Compose Local Development

### Enables

- Self-invite testing workflow
- Future multi-tenant features
- Independent admin/web scaling

---

## Rollout Plan

### Development

1. Create new schemas in branch
2. Implement services and routes
3. Unit and integration tests
4. Code review

### Staging

1. Run migration on staging DB
2. Deploy to staging environment
3. Run full test suite
4. Admin self-invite verification

### Production

1. Backup production database
2. Schedule maintenance window
3. Run migration
4. Deploy code
5. Verify functionality
6. Monitor for issues

---

## Documentation Updates

### Technical Docs

- Database schema documentation
- Authentication flow updates
- API documentation

### User Docs

- Admin self-invite guide
- Web user registration guide

### Developer Docs

- Migration guide
- Testing procedures
- Rollback instructions

---

## Additional Work Completed

During implementation of Phase 10, additional work was completed to ensure proper functionality and user experience:

### Authentication Fixes

**JWT_SECRET Configuration**:

- Added `JWT_SECRET` generation to `.env` for development
- Auth service was failing due to missing JWT secret
- Token validation now works correctly in all environments

**TokenService Integration**:

- Updated auth middleware to use `TokenService` instead of direct `jsonwebtoken` calls
- Ensures consistent token generation and validation across the application
- Proper support for both RS256 and HS256 algorithms

**Database Access in Middleware**:

- Fixed incorrect `request.db` usage in auth middleware (should be `request.server.db`)
- Middleware now properly accesses database for user validation
- Admin authentication working correctly

**WEB_URL Configuration**:

- Added `WEB_URL` environment variable to auth service in `docker-compose.dev.yml`
- Invite emails now contain proper signup links (`http://localhost:3000/signup?token=...`)
- Previously showed `undefined/signup?token=...`

### Dark Mode Styling Fixes

**Dashboard Background**:

- Replaced `bg-gray-50` with semantic `bg-bg-primary` in dashboard layout
- Consistent dark mode backgrounds across all dashboard pages
- Removed duplicate `MainLayout` wrapper causing header duplication

**Input Field Styling**:

- Added `--color-bg-input` CSS variable to web and admin apps
- Input backgrounds properly contrasted in dark mode
- All form inputs and textareas use semantic `bg-bg-input` color

**Error and Success Messages**:

- Replaced hardcoded red/green colors with semantic `danger` and `success` colors
- Error messages: `bg-danger-muted border-danger text-danger`
- Success messages: `bg-success-muted border-success text-success`
- Works correctly in both light and dark modes

**Status Badges**:

- Updated invite status badges to use semantic colors
- Used: `bg-success-muted text-success`
- Expired: `bg-danger-muted text-danger`
- Pending: `bg-warning-muted text-warning`

### Semantic Color Audit

**Web App**:

- Replaced all `text-gray-*` with `text-text-primary`, `text-text-secondary`, or `text-text-tertiary`
- Replaced all `bg-gray-*` with semantic background colors
- Fixed login/signup error messages to use `danger` colors
- Updated settings, quick-wins, and modules pages to use semantic colors
- Removed `primary-500/600` references, using `primary` and `primary-hover`

**Admin App**:

- Fixed error messages in login, recovery, and invite pages
- Updated status badges to use semantic colors
- All alerts and notifications now theme-aware

**Component Updates**:

- ProgressBar, ModuleCard, and OnboardingCard use semantic colors
- No hardcoded color values remaining in UI components

### Code Quality Improvements

**Logging**:

- Added detailed logging to admin and authentication middleware
- Fixed Fastify error logging order (error first, then message)
- Better debugging information for authentication failures

**Error Handling**:

- Updated auth client to handle both `error` and `message` properties in API responses
- Improved error messages throughout authentication flow
- Better user feedback when operations fail

**Code Organization**:

- Fixed function hoisting issues in auth routes
- Reordered route definitions for better code clarity
- Consistent error handling patterns

## Next Steps

After Phase 10 completion:

- Phase 11: AWS Staging Deployment (separate admin/web users in staging)
- Phase 12: Critical Flow Completion (app roles specific to web app)
- Phase 13: Scale & Growth (multi-tenant with clean separation)
- Phase 14: AI Enhancement

---

## References

- [Phase 10 Implementation Plan](./phase-plans/10-phase-10-separate-user-tables-plan.md)
- [Phase 8: Invite System](./08-invite-system-local-dev.md)
- [Architecture Documentation](./project-definition/architecture.md)
