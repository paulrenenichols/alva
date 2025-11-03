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
    const apiKey = process.env['RESEND_API_KEY'];
    if (!apiKey) {
      console.error('[ResendProvider] RESEND_API_KEY not configured');
      return { success: false, error: 'Email service not configured: RESEND_API_KEY missing' };
    }

    // Check if API key is just whitespace or placeholder
    if (apiKey.trim().length === 0 || apiKey.includes('placeholder') || apiKey.includes('YOUR_')) {
      console.error('[ResendProvider] RESEND_API_KEY appears to be invalid or placeholder');
      return { success: false, error: 'Email service not configured: RESEND_API_KEY invalid' };
    }

    try {
      // Default to alva.paulrenenichols.com domain (verified in Resend)
      // Can be overridden via RESEND_FROM_EMAIL env var or options.from
      const fromAddress = options.from || process.env['RESEND_FROM_EMAIL'] || 'Alva <noreply@alva.paulrenenichols.com>';
      
      console.log('[ResendProvider] Sending email:', {
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey.substring(0, 7) + '...',
      });

      const result = await this.resend.emails.send({
        from: fromAddress,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      console.log('[ResendProvider] Email sent successfully:', {
        messageId: result.data?.id,
        to: options.to,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error: any) {
      console.error('[ResendProvider] Email send error:', {
        error: error?.message || error,
        errorDetails: error?.response?.data || error,
        stack: error?.stack,
        to: options.to,
      });
      
      // Extract more detailed error message
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send email';
      return { success: false, error: errorMessage };
    }
  }
}

