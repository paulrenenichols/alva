/**
 * @fileoverview Unit tests for email-client public API
 */

import { EmailClient } from './index';
import type { SendEmailOptions, SendEmailResult } from './index';

describe('Email Client Public API', () => {
  it('should export EmailClient class', () => {
    expect(EmailClient).toBeDefined();
    expect(typeof EmailClient).toBe('function');
  });

  it('should export SendEmailOptions type', () => {
    const options: SendEmailOptions = {
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    };

    expect(options).toBeDefined();
  });

  it('should export SendEmailResult type', () => {
    const result: SendEmailResult = {
      success: true,
      messageId: 'test-id',
    };

    expect(result).toBeDefined();
  });

  it('should instantiate EmailClient from exported class', () => {
    const client = new EmailClient();
    expect(client).toBeInstanceOf(EmailClient);
  });
});

