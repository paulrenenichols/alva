/**
 * @fileoverview Email service for sending authentication and verification emails
 * Supports MailHog for local development and Resend for production
 */

import { Resend } from 'resend';

const resend = new Resend(process.env['RESEND_API_KEY']);

export class EmailService {
  /**
   * @description Sends verification email using MailHog (dev) or Resend (prod)
   */
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env['WEB_URL']}/verify?token=${token}`;
    const html = this.getVerificationEmailTemplate(verificationUrl);

    // Use MailHog in development
    if (process.env['NODE_ENV'] === 'development') {
      return this.sendViaMailHog(email, 'Verify your email - Alva', html);
    }

    // Use Resend in production
    return this.sendViaResend(email, 'Verify your email - Alva', html);
  }

  /**
   * @description Sends invite email using MailHog (dev) or Resend (prod)
   */
  async sendInviteEmail(email: string, token: string) {
    const inviteUrl = `${process.env['WEB_URL']}/signup?token=${token}`;
    const html = this.getInviteEmailTemplate(inviteUrl, token);

    // Use MailHog in development
    if (process.env['NODE_ENV'] === 'development') {
      return this.sendViaMailHog(email, 'You\'re invited to join Alva', html);
    }

    // Use Resend in production
    return this.sendViaResend(email, 'You\'re invited to join Alva', html);
  }

  /**
   * @description Sends password reset email for admins (recovery flow)
   */
  async sendPasswordResetEmail(email: string, token: string) {
    const adminBaseUrl = process.env['ADMIN_URL'] || 'http://localhost:3003';
    const resetUrl = `${adminBaseUrl}/reset-password?token=${token}`;
    const html = this.getPasswordResetTemplate(resetUrl);

    if (process.env['NODE_ENV'] === 'development') {
      return this.sendViaMailHog(email, 'Reset your admin password - Alva', html);
    }

    return this.sendViaResend(email, 'Reset your admin password - Alva', html);
  }

  /**
   * @description Sends email via Resend API (production)
   */
  private async sendViaResend(email: string, subject: string, html: string) {
    if (!process.env['RESEND_API_KEY']) {
      console.warn('RESEND_API_KEY not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const result = await resend.emails.send({
        from: 'Alva <noreply@alva.app>',
        to: [email],
        subject,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }

  /**
   * @description Sends email via SMTP to MailHog (development)
   */
  private async sendViaMailHog(email: string, subject: string, html: string) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'mailhog',  // Docker service name
      port: 1025,
      secure: false,
    });

    try {
      const info = await transporter.sendMail({
        from: 'Alva <noreply@alva.local>',
        to: email,
        subject,
        html,
      });

      console.log(`Email sent to MailHog (dev): ${email}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('MailHog email error:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }

  private getInviteEmailTemplate(inviteUrl: string, token: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; font-size: 28px;">You're Invited to Alva!</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            You've been invited to join Alva, your personal AI marketing director.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Accept Invitation
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #6b7280;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${inviteUrl}" style="color: #f97316;">${inviteUrl}</a>
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
            This invitation will expire in 7 days.
          </p>
        </div>
      </div>
    `;
  }

  private getVerificationEmailTemplate(verificationUrl: string): string {
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

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; font-size: 24px;">Reset your password</h1>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            You (or someone) requested a password reset for your admin account. This link will expire in 1 hour.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Set New Password
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #6b7280;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #f97316;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `;
  }
}
