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

