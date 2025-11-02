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

