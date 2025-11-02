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
      port: parseInt(process.env['MAILPIT_PORT'] || '1025', 10),
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

