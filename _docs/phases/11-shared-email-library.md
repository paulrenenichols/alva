# Phase 11: Shared Email Library

**@fileoverview** Implementation plan for creating a shared email library to centralize email sending logic and eliminate conditional email provider logic spread across services.

---

## Overview

This phase implements:

1. **Shared email library** (`@alva/email-client`) that encapsulates Mailpit (dev) and Resend (prod) logic
2. **Unified email API** with simple interface: `sendEmail(to, subject, html)`
3. **Centralized email templates** for all email types
4. **Refactored auth service** to use the shared library instead of local email service
5. **Future-proof architecture** that can easily add SMS, push notifications, or extract to a service later

**Estimated Duration**: 1 week (40 hours)

**Builds On**: Phase 10 - requires separated user tables and optimized docker compose local development setup

---

## Current State

### ✅ Already Implemented

1. **Email Functionality**: Mailpit (dev) + Resend (prod) integration working ✅
2. **Email Templates**: Verification, invite, and password reset templates exist ✅
3. **Conditional Logic**: Environment-based email provider selection in auth service ✅

### ❌ Problem

1. **Scattered Logic**: Email sending logic duplicated in auth service with conditional branching
2. **Tight Coupling**: Auth service directly depends on Mailpit/Resend implementations
3. **Hard to Test**: Conditional logic makes testing more complex
4. **Future Growth**: No clear path for adding SMS, push notifications, or extracting to a service

---

## Implementation Plan

### Day 1-2: Create Shared Email Library

#### Step 1.1: Initialize Email Client Library

**File Structure**:

```
libs/email-client/
  ├── src/
  │   ├── index.ts                 # Public API exports
  │   ├── email-client.ts          # Main email client class
  │   ├── providers/
  │   │   ├── mailpit.provider.ts  # Mailpit implementation
  │   │   ├── resend.provider.ts   # Resend implementation
  │   │   └── types.ts             # Provider interface
  │   ├── templates/
  │   │   ├── verification.template.ts
  │   │   ├── invite.template.ts
  │   │   └── password-reset.template.ts
  │   └── types.ts                 # Shared types
  ├── project.json
  ├── tsconfig.json
  └── package.json
```

**Tasks**:

- [ ] Create `libs/email-client` directory structure
- [ ] Initialize Nx library project
- [ ] Add dependencies: `resend`, `nodemailer`, `@types/nodemailer`
- [ ] Configure TypeScript and exports

#### Step 1.2: Implement Provider Interface

**File**: `libs/email-client/src/providers/types.ts`

```typescript
/**
 * @fileoverview Provider interface for email sending implementations
 */

export interface EmailProvider {
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

#### Step 1.3: Implement Mailpit Provider

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

#### Step 1.4: Implement Resend Provider

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

#### Step 1.5: Implement Email Client

**File**: `libs/email-client/src/email-client.ts`

```typescript
/**
 * @fileoverview Unified email client that automatically selects provider based on environment
 */

import { EmailProvider, SendEmailOptions, SendEmailResult } from './providers/types';
import { MailpitProvider } from './providers/mailpit.provider';
import { ResendProvider } from './providers/resend.provider';

export class EmailClient {
  private provider: EmailProvider;

  constructor() {
    // Select provider based on environment
    if (process.env['NODE_ENV'] === 'development') {
      this.provider = new MailpitProvider();
    } else {
      this.provider = new ResendProvider();
    }
  }

  /**
   * @description Send an email using the appropriate provider (Mailpit for dev, Resend for prod)
   */
  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    return this.provider.sendEmail(options);
  }

  /**
   * @description Send verification email
   */
  async sendVerificationEmail(email: string, verificationUrl: string): Promise<SendEmailResult> {
    const html = this.getVerificationEmailTemplate(verificationUrl);
    return this.sendEmail({
      to: email,
      subject: 'Verify your email - Alva',
      html,
    });
  }

  /**
   * @description Send invite email
   */
  async sendInviteEmail(email: string, inviteUrl: string, token: string): Promise<SendEmailResult> {
    const html = this.getInviteEmailTemplate(inviteUrl, token);
    return this.sendEmail({
      to: email,
      subject: "You're invited to join Alva",
      html,
    });
  }

  /**
   * @description Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<SendEmailResult> {
    const html = this.getPasswordResetTemplate(resetUrl);
    return this.sendEmail({
      to: email,
      subject: 'Reset your admin password - Alva',
      html,
    });
  }

  private getVerificationEmailTemplate(verificationUrl: string): string {
    // Move existing template from auth service
    return `...`;
  }

  private getInviteEmailTemplate(inviteUrl: string, token: string): string {
    // Move existing template from auth service
    return `...`;
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    // Move existing template from auth service
    return `...`;
  }
}
```

#### Step 1.6: Export Public API

**File**: `libs/email-client/src/index.ts`

```typescript
/**
 * @fileoverview Public API exports for @alva/email-client
 */

export { EmailClient } from './email-client';
export type { SendEmailOptions, SendEmailResult } from './providers/types';
```

### Day 3-4: Refactor Auth Service

#### Step 2.1: Update Auth Service Dependencies

**File**: `apps/auth/project.json`

Add dependency on email-client library.

#### Step 2.2: Replace Email Service in Auth Service

**File**: `apps/auth/src/services/email.service.ts` (REPLACE)

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

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env['WEB_URL']}/verify?token=${token}`;
    return this.emailClient.sendVerificationEmail(email, verificationUrl);
  }

  async sendInviteEmail(email: string, token: string) {
    const inviteUrl = `${process.env['WEB_URL']}/signup?token=${token}`;
    return this.emailClient.sendInviteEmail(email, inviteUrl, token);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const adminBaseUrl = process.env['ADMIN_URL'] || 'http://localhost:3003';
    const resetUrl = `${adminBaseUrl}/reset-password?token=${token}`;
    return this.emailClient.sendPasswordResetEmail(email, resetUrl);
  }
}
```

#### Step 2.3: Update Package Dependencies

**File**: `apps/auth/package.json`

Remove direct dependencies on `resend` and `nodemailer` (moved to email-client library).

### Day 5: Testing & Validation

#### Step 3.1: Unit Tests

**File**: `libs/email-client/src/__tests__/email-client.test.ts`

- Test provider selection (dev vs prod)
- Test email sending for each provider
- Test template generation
- Mock providers for testing

#### Step 3.2: Integration Tests

**File**: `apps/auth/src/__tests__/email.service.test.ts`

- Test auth service uses email client correctly
- Verify email sending in dev mode (Mailpit)
- Verify email sending in prod mode (mocked Resend)

#### Step 3.3: Manual Testing

- [ ] Verify verification emails work in dev mode
- [ ] Verify invite emails work in dev mode
- [ ] Verify password reset emails work in dev mode
- [ ] Test with Mailpit web UI
- [ ] Verify no breaking changes to auth flows

---

## Implementation Checklist

### Week 1: Email Library & Refactoring

- [ ] Create `@alva/email-client` library structure
- [ ] Implement provider interface
- [ ] Implement Mailpit provider
- [ ] Implement Resend provider
- [ ] Implement EmailClient class
- [ ] Move email templates to library
- [ ] Export public API
- [ ] Update auth service to use library
- [ ] Remove direct dependencies from auth service
- [ ] Write unit tests for email client
- [ ] Write integration tests for auth service
- [ ] Manual testing in dev environment
- [ ] Update documentation

---

## Success Criteria

✅ **Centralized Email Logic**

- All email sending logic in `@alva/email-client` library
- No conditional logic in auth or api services
- Single source of truth for email configuration

✅ **Simplified Service Code**

- Auth service uses simple `EmailClient` API
- Removed direct Mailpit/Resend dependencies from services
- Cleaner, more maintainable code

✅ **Easy to Test**

- Providers can be mocked independently
- Email client has clear testing interface
- Integration tests verify end-to-end flow

✅ **Future-Proof Architecture**

- Easy to add new providers (SMS, push, etc.)
- Can extract to microservice later if needed
- Clear separation of concerns

✅ **All Features Working**

- Verification emails working
- Invite emails working
- Password reset emails working
- No regressions in existing functionality

---

## Benefits

### Technical Benefits

1. **Single Source of Truth**: Email logic lives in one place
2. **Easier Testing**: Mock the email client instead of multiple providers
3. **Cleaner Code**: Services don't need to know about Mailpit vs Resend
4. **Better Organization**: Email templates centralized

### Future Benefits

1. **Easy Extension**: Add SMS, push notifications to the same library
2. **Service Extraction**: Can extract to a communication service later without code changes
3. **Provider Flexibility**: Swap providers without touching service code
4. **Centralized Monitoring**: All communication logic in one place

---

## Migration Notes

### Breaking Changes

None - this is a refactoring that maintains the same public API for the auth service.

### Rollback Plan

If issues arise, can revert auth service to previous implementation. The email library can be introduced gradually.

---

## Next Steps

After Phase 11 completion:

- Move to Phase 12: AWS Staging Deployment
- Consider adding SMS provider to email-client library
- Monitor email delivery rates and performance
- Consider extracting to communication service if volume grows
