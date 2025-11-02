/**
 * @fileoverview Unified email client that automatically selects provider based on environment
 */

import { EmailProvider, SendEmailOptions, SendEmailResult } from './providers/types';
import { MailpitProvider } from './providers/mailpit.provider';
// ResendProvider is kept for future production email implementation
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
      // Use MailpitProvider for all environments until production email is implemented
      // TODO: Switch to ResendProvider in production once production email is set up
      this.provider = new MailpitProvider();
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
  async sendVerificationEmail(email: string, verificationUrl: string): Promise<SendEmailResult> {
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
  async sendInviteEmail(email: string, inviteUrl: string, token: string): Promise<SendEmailResult> {
    const html = getInviteEmailTemplate(inviteUrl, token);
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
    const html = getPasswordResetTemplate(resetUrl);
    return this.sendEmail({
      to: email,
      subject: 'Reset your admin password - Alva',
      html,
    });
  }
}

