# Phase 11 Implementation Plan: Shared Email Library

**@fileoverview** Detailed implementation plan for Phase 11 - creating a shared email library to centralize email sending logic and eliminate conditional provider logic spread across services.

---

## Implementation Overview

**Goal**: Create `@alva/email-client` library that encapsulates all email sending logic (Mailpit for dev, Resend for prod) and refactor auth service to use it, eliminating scattered conditional logic.

**Duration**: 1 week (40 hours)

**Success Criteria**:
- ✅ Shared `@alva/email-client` library created
- ✅ All email logic centralized (no conditional branching in services)
- ✅ Auth service refactored to use library
- ✅ All email templates moved to library
- ✅ Unit and integration tests passing
- ✅ No regressions in existing email functionality

**Builds On**: Phase 10 - requires separated user tables and optimized docker compose local development setup

---

## Detailed Implementation Steps

### Day 1: Library Foundation

#### Step 1.1: Create Library Structure

**Estimated Time**: 2 hours

**File Structure**:
```
libs/email-client/
  ├── src/
  │   ├── index.ts                 # Public API exports
  │   ├── email-client.ts          # Main email client class
  │   ├── providers/
  │   │   ├── index.ts
  │   │   ├── mailpit.provider.ts  # Mailpit implementation
  │   │   ├── resend.provider.ts   # Resend implementation
  │   │   └── types.ts             # Provider interface
  │   ├── templates/
  │   │   ├── index.ts
  │   │   ├── verification.template.ts
  │   │   ├── invite.template.ts
  │   │   └── password-reset.template.ts
  │   └── types.ts                 # Shared types
  ├── project.json
  ├── tsconfig.json
  └── package.json
```

**Tasks**:
- [ ] Use Nx generator to create new library: `nx generate @nx/js:library email-client --directory=libs/email-client --importPath=@alva/email-client`
- [ ] Create `providers/` directory
- [ ] Create `templates/` directory
- [ ] Add dependencies to `package.json`: `resend`, `nodemailer`, `@types/nodemailer`
- [ ] Configure TypeScript paths in `tsconfig.base.json`

**Validation**:
- [ ] Library structure exists
- [ ] Dependencies installed
- [ ] TypeScript compiles

#### Step 1.2: Define Provider Interface

**Estimated Time**: 1 hour

**File**: `libs/email-client/src/providers/types.ts`

```typescript
/**
 * @fileoverview Provider interface for email sending implementations
 */

export interface EmailProvider {
  /**
   * @description Send an email using the provider's implementation
   */
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

**Tasks**:
- [ ] Create provider interface types
- [ ] Document interface with JSDoc
- [ ] Export types

**Validation**:
- [ ] Types compile correctly
- [ ] Interface is clear and extensible

#### Step 1.3: Implement Mailpit Provider

**Estimated Time**: 2 hours

**File**: `libs/email-client/src/providers/mailpit.provider.ts`

```typescript
/**
 * @fileoverview Mailpit provider for development email sending
 */

import * as nodemailer from 'nodemailer';
import { EmailProvider, SendEmailOptions, SendEmailResult } from './types';

export class MailpitProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env['MAILPIT_HOST'] || 'mailpit',
      port: parseInt(process.env['MAILPIT_PORT'] || '1025'),
      secure: false,
    });
  }

  /**
   * @description Sends email via SMTP to Mailpit (development)
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || 'Alva <noreply@alva.local>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      console.log(`Email sent to Mailpit (dev): ${options.to}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Mailpit email error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }
}
```

**Tasks**:
- [ ] Copy Mailpit logic from auth service
- [ ] Implement EmailProvider interface
- [ ] Add error handling
- [ ] Add logging
- [ ] Use environment variables for host/port

**Validation**:
- [ ] Provider implements interface correctly
- [ ] Can send test email to Mailpit
- [ ] Error handling works

#### Step 1.4: Implement Resend Provider

**Estimated Time**: 2 hours

**File**: `libs/email-client/src/providers/resend.provider.ts`

```typescript
/**
 * @fileoverview Resend provider for production email sending
 */

import { Resend } from 'resend';
import { EmailProvider, SendEmailOptions, SendEmailResult } from './types';

export class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor() {
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured');
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * @description Sends email via Resend API (production)
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    if (!process.env['RESEND_API_KEY']) {
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await this.resend.emails.send({
        from: options.from || 'Alva <noreply@alva.app>',
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }
}
```

**Tasks**:
- [ ] Copy Resend logic from auth service
- [ ] Implement EmailProvider interface
- [ ] Add error handling
- [ ] Add logging
- [ ] Handle missing API key gracefully

**Validation**:
- [ ] Provider implements interface correctly
- [ ] Handles missing API key gracefully
- [ ] Error handling works

### Day 2: Email Client Implementation

#### Step 2.1: Implement Email Client

**Estimated Time**: 3 hours

**File**: `libs/email-client/src/email-client.ts`

```typescript
/**
 * @fileoverview Unified email client that automatically selects provider based on environment
 */

import { EmailProvider, SendEmailOptions, SendEmailResult } from './providers/types';
import { MailpitProvider } from './providers/mailpit.provider';
import { ResendProvider } from './providers/resend.provider';
import {
  getVerificationEmailTemplate,
  getInviteEmailTemplate,
  getPasswordResetTemplate,
} from './templates';

export class EmailClient {
  private provider: EmailProvider;

  constructor(provider?: EmailProvider) {
    // Allow injection for testing
    if (provider) {
      this.provider = provider;
    } else {
      // Select provider based on environment
      if (process.env['NODE_ENV'] === 'development') {
        this.provider = new MailpitProvider();
      } else {
        this.provider = new ResendProvider();
      }
    }
  }

  /**
   * @description Send an email using the appropriate provider
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    return this.provider.sendEmail(options);
  }

  /**
   * @description Send verification email
   */
  async sendVerificationEmail(
    email: string,
    verificationUrl: string
  ): Promise<SendEmailResult> {
    const html = getVerificationEmailTemplate(verificationUrl);
    return this.sendEmail({
      to: email,
      subject: 'Verify your email - Alva',
      html,
    });
  }

  /**
   * @description Send invite email
   */
  async sendInviteEmail(
    email: string,
    inviteUrl: string,
    token: string
  ): Promise<SendEmailResult> {
    const html = getInviteEmailTemplate(inviteUrl, token);
    return this.sendEmail({
      to: email,
      subject: 'You\'re invited to join Alva',
      html,
    });
  }

  /**
   * @description Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string
  ): Promise<SendEmailResult> {
    const html = getPasswordResetTemplate(resetUrl);
    return this.sendEmail({
      to: email,
      subject: 'Reset your admin password - Alva',
      html,
    });
  }
}
```

**Tasks**:
- [ ] Create EmailClient class
- [ ] Implement provider selection logic
- [ ] Add convenience methods for each email type
- [ ] Allow provider injection for testing
- [ ] Add comprehensive JSDoc

**Validation**:
- [ ] Provider selection works correctly
- [ ] All convenience methods work
- [ ] Can inject provider for testing

#### Step 2.2: Move Email Templates

**Estimated Time**: 2 hours

**File**: `libs/email-client/src/templates/verification.template.ts`

```typescript
/**
 * @fileoverview Email template for email verification
 */

export function getVerificationEmailTemplate(verificationUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px;">Welcome to Alva!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          Thank you for signing up! Click the button below to verify your email and access your personalized marketing plan.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Verify Email Address
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 14px; color: #6b7280;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #f97316;">${verificationUrl}</a>
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
          This link will expire in 24 hours for security reasons.
        </p>
      </div>
    </div>
  `;
}
```

**Files to create**:
- [ ] `templates/verification.template.ts`
- [ ] `templates/invite.template.ts`
- [ ] `templates/password-reset.template.ts`
- [ ] `templates/index.ts` (exports all templates)

**Tasks**:
- [ ] Copy templates from auth service
- [ ] Convert to pure functions
- [ ] Remove any service-specific logic
- [ ] Export all templates

**Validation**:
- [ ] Templates render correctly
- [ ] No service-specific dependencies
- [ ] Templates are testable

#### Step 2.3: Export Public API

**Estimated Time**: 1 hour

**File**: `libs/email-client/src/index.ts`

```typescript
/**
 * @fileoverview Public API exports for @alva/email-client
 */

export { EmailClient } from './email-client';
export type { SendEmailOptions, SendEmailResult } from './providers/types';
```

**Tasks**:
- [ ] Export EmailClient class
- [ ] Export types
- [ ] Ensure clean public API

**Validation**:
- [ ] Can import from `@alva/email-client`
- [ ] Only necessary exports are public

### Day 3: Refactor Auth Service

#### Step 3.1: Update Dependencies

**Estimated Time**: 1 hour

**Tasks**:
- [ ] Add `@alva/email-client` to auth service dependencies in `project.json`
- [ ] Remove `resend` and `nodemailer` from auth service `package.json`
- [ ] Run `pnpm install`

**Validation**:
- [ ] Auth service can import from `@alva/email-client`
- [ ] Old dependencies removed
- [ ] Build succeeds

#### Step 3.2: Refactor Email Service

**Estimated Time**: 3 hours

**File**: `apps/auth/src/services/email.service.ts` (REPLACE ENTIRE FILE)

```typescript
/**
 * @fileoverview Email service for sending authentication and verification emails
 * Uses shared @alva/email-client library
 */

import { EmailClient } from '@alva/email-client';

export class EmailService {
  private emailClient: EmailClient;

  constructor() {
    this.emailClient = new EmailClient();
  }

  /**
   * @description Sends verification email
   */
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env['WEB_URL']}/verify?token=${token}`;
    return this.emailClient.sendVerificationEmail(email, verificationUrl);
  }

  /**
   * @description Sends invite email
   */
  async sendInviteEmail(email: string, token: string) {
    const inviteUrl = `${process.env['WEB_URL']}/signup?token=${token}`;
    return this.emailClient.sendInviteEmail(email, inviteUrl, token);
  }

  /**
   * @description Sends password reset email for admins (recovery flow)
   */
  async sendPasswordResetEmail(email: string, token: string) {
    const adminBaseUrl = process.env['ADMIN_URL'] || 'http://localhost:3003';
    const resetUrl = `${adminBaseUrl}/reset-password?token=${token}`;
    return this.emailClient.sendPasswordResetEmail(email, resetUrl);
  }
}
```

**Tasks**:
- [ ] Replace entire email service file
- [ ] Remove all conditional logic
- [ ] Remove template methods
- [ ] Use EmailClient for all email sending
- [ ] Maintain same public API

**Validation**:
- [ ] Service compiles
- [ ] No conditional logic remains
- [ ] Public API unchanged

#### Step 3.3: Verify No Breaking Changes

**Estimated Time**: 1 hour

**Tasks**:
- [ ] Check all files that import EmailService
- [ ] Verify method signatures match
- [ ] Ensure return types are compatible
- [ ] Run TypeScript compiler

**Validation**:
- [ ] No TypeScript errors
- [ ] All imports resolve
- [ ] No breaking changes to API

### Day 4: Testing

#### Step 4.1: Unit Tests for Email Client

**Estimated Time**: 3 hours

**File**: `libs/email-client/src/__tests__/email-client.test.ts`

```typescript
/**
 * @fileoverview Unit tests for EmailClient
 */

import { EmailClient } from '../email-client';
import { EmailProvider, SendEmailResult } from '../providers/types';

describe('EmailClient', () => {
  let mockProvider: jest.Mocked<EmailProvider>;
  let emailClient: EmailClient;

  beforeEach(() => {
    mockProvider = {
      sendEmail: jest.fn(),
    };
    emailClient = new EmailClient(mockProvider);
  });

  describe('sendEmail', () => {
    it('should delegate to provider', async () => {
      const result: SendEmailResult = { success: true, messageId: 'test-id' };
      mockProvider.sendEmail.mockResolvedValue(result);

      const response = await emailClient.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockProvider.sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
      expect(response).toEqual(result);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendVerificationEmail('test@example.com', 'http://test.com/verify?token=abc');

      expect(mockProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Verify your email - Alva',
          html: expect.stringContaining('http://test.com/verify?token=abc'),
        })
      );
    });
  });

  // Add tests for other convenience methods
});
```

**Tasks**:
- [ ] Write tests for EmailClient
- [ ] Test provider selection (dev vs prod)
- [ ] Test each convenience method
- [ ] Test error handling
- [ ] Mock providers

**Validation**:
- [ ] All tests pass
- [ ] Good test coverage (>80%)

#### Step 4.2: Integration Tests

**Estimated Time**: 2 hours

**File**: `apps/auth/src/__tests__/email.service.test.ts`

**Tasks**:
- [ ] Test EmailService uses EmailClient correctly
- [ ] Test email sending flows
- [ ] Mock EmailClient
- [ ] Verify no regressions

**Validation**:
- [ ] Integration tests pass
- [ ] Auth flows still work

### Day 5: Manual Testing & Documentation

#### Step 5.1: Manual Testing

**Estimated Time**: 3 hours

**Tasks**:
- [ ] Start dev environment with Mailpit
- [ ] Test verification email flow
- [ ] Test invite email flow
- [ ] Test password reset email flow
- [ ] Verify emails appear in Mailpit UI
- [ ] Check email content is correct
- [ ] Verify no console errors

**Validation**:
- [ ] All email flows work
- [ ] Emails appear in Mailpit
- [ ] Email content is correct
- [ ] No errors in logs

#### Step 5.2: Update Documentation

**Estimated Time**: 2 hours

**Tasks**:
- [ ] Update architecture docs to mention email-client library
- [ ] Document email library usage
- [ ] Update deployment docs if needed
- [ ] Add examples of using EmailClient

**Validation**:
- [ ] Documentation is accurate
- [ ] Examples are clear

---

## Rollback Plan

If issues arise during implementation:

1. **Keep old EmailService as backup**: Don't delete until fully validated
2. **Gradual migration**: Can keep both implementations temporarily
3. **Git branches**: Implement in feature branch for easy rollback

---

## Success Metrics

### Technical Metrics

- ✅ Zero conditional email logic in services
- ✅ All email logic in `@alva/email-client`
- ✅ 100% test coverage for email client
- ✅ No TypeScript errors
- ✅ No breaking changes

### Functional Metrics

- ✅ All email types still working (verification, invite, password reset)
- ✅ Emails appear in Mailpit in dev mode
- ✅ No regressions in auth flows
- ✅ Email content unchanged

---

## Future Enhancements

After Phase 11, consider:

1. **Add SMS Provider**: Extend library to support SMS notifications
2. **Add Push Notification Provider**: Support for web push notifications
3. **Extract to Service**: If volume grows, extract to communication service
4. **Email Analytics**: Add email delivery tracking
5. **Template Management**: UI for managing email templates

---

## Dependencies

### Internal Dependencies

- Phase 10: Separate user tables (completed)
- Auth service: Email sending functionality
- Mailpit: Running in docker-compose

### External Dependencies

- `resend` npm package
- `nodemailer` npm package
- Mailpit Docker container

---

This implementation plan provides a clear roadmap for centralizing email logic and eliminating scattered conditional code across services.

