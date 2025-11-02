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
