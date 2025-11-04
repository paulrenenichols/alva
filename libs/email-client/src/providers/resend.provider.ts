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
      console.error('[ResendProvider] RESEND_API_KEY not configured', {
        step: 'api_key_check',
        hasApiKey: false,
      });
      return { success: false, error: 'Email service not configured: RESEND_API_KEY missing' };
    }

    // Check if API key is just whitespace or placeholder
    if (apiKey.trim().length === 0 || apiKey.includes('placeholder') || apiKey.includes('YOUR_')) {
      console.error('[ResendProvider] RESEND_API_KEY appears to be invalid or placeholder', {
        step: 'api_key_validation',
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 10) + '...',
        isPlaceholder: apiKey.includes('placeholder') || apiKey.includes('YOUR_'),
      });
      return { success: false, error: 'Email service not configured: RESEND_API_KEY invalid' };
    }

    // Default to alva.paulrenenichols.com domain (verified in Resend)
    // Can be overridden via RESEND_FROM_EMAIL env var or options.from
    const fromAddress = options.from || process.env['RESEND_FROM_EMAIL'] || 'Alva <noreply@alva.paulrenenichols.com>';

    try {
      console.log('[ResendProvider] Sending email', {
        step: 'sending_start',
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey.substring(0, 7) + '...',
        htmlLength: options.html?.length || 0,
      });

      const result = await this.resend.emails.send({
        from: fromAddress,
        to: [options.to],
        subject: options.subject,
        html: options.html,
      });

      console.log('[ResendProvider] Email sent successfully', {
        step: 'sending_success',
        messageId: result.data?.id,
        to: options.to,
        from: fromAddress,
        subject: options.subject,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error: any) {
      console.error('[ResendProvider] Email send error', {
        step: 'sending_error',
        error: error?.message || String(error),
        errorCode: error?.response?.status || error?.code,
        errorDetails: error?.response?.data || undefined,
        errorStack: error?.stack,
        to: options.to,
        from: fromAddress,
        subject: options.subject,
        errorType: error?.constructor?.name || typeof error,
      });
      
      // Extract more detailed error message
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send email';
      return { success: false, error: errorMessage };
    }
  }
}

