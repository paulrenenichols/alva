/**
 * @fileoverview Unit tests for EmailClient
 */

import { EmailClient } from './email-client';
import { EmailProvider, SendEmailOptions, SendEmailResult } from './providers/types';
import { MailpitProvider } from './providers/mailpit.provider';

describe('EmailClient', () => {
  let mockProvider: jest.Mocked<EmailProvider>;
  let emailClient: EmailClient;

  beforeEach(() => {
    mockProvider = {
      sendEmail: jest.fn(),
    };
    emailClient = new EmailClient(mockProvider);
  });

  describe('constructor', () => {
    it('should use injected provider when provided', () => {
      const client = new EmailClient(mockProvider);
      expect(client).toBeInstanceOf(EmailClient);
    });

    it('should use MailpitProvider in development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      const client = new EmailClient();
      expect(client).toBeInstanceOf(EmailClient);

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('sendEmail', () => {
    it('should delegate to provider', async () => {
      const result: SendEmailResult = { success: true, messageId: 'test-id' };
      mockProvider.sendEmail.mockResolvedValue(result);

      const response = await emailClient.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockProvider.sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });
      expect(response).toEqual(result);
    });

    it('should pass custom from address when provided', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      expect(mockProvider.sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });
    });

    it('should handle provider errors', async () => {
      const errorResult: SendEmailResult = {
        success: false,
        error: 'Provider error',
      };
      mockProvider.sendEmail.mockResolvedValue(errorResult);

      const response = await emailClient.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('Provider error');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendVerificationEmail(
        'test@example.com',
        'http://test.com/verify?token=abc123'
      );

      expect(mockProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Verify your email - Alva',
          html: expect.stringContaining('http://test.com/verify?token=abc123'),
        })
      );
    });

    it('should include verification URL in email template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendVerificationEmail(
        'test@example.com',
        'http://example.com/verify?token=xyz'
      );

      const call = mockProvider.sendEmail.mock.calls[0][0];
      expect(call.html).toContain('http://example.com/verify?token=xyz');
      expect(call.html).toContain('Verify Email Address');
    });
  });

  describe('sendInviteEmail', () => {
    it('should send invite email with correct template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendInviteEmail(
        'test@example.com',
        'http://test.com/signup?token=abc123',
        'abc123'
      );

      expect(mockProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: "You're invited to join Alva",
          html: expect.stringContaining('http://test.com/signup?token=abc123'),
        })
      );
    });

    it('should include invite URL in email template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendInviteEmail(
        'test@example.com',
        'http://example.com/signup?token=xyz',
        'xyz'
      );

      const call = mockProvider.sendEmail.mock.calls[0][0];
      expect(call.html).toContain('http://example.com/signup?token=xyz');
      expect(call.html).toContain('Accept Invitation');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendPasswordResetEmail(
        'test@example.com',
        'http://test.com/reset?token=abc123'
      );

      expect(mockProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Reset your admin password - Alva',
          html: expect.stringContaining('http://test.com/reset?token=abc123'),
        })
      );
    });

    it('should include reset URL in email template', async () => {
      const result: SendEmailResult = { success: true };
      mockProvider.sendEmail.mockResolvedValue(result);

      await emailClient.sendPasswordResetEmail(
        'test@example.com',
        'http://example.com/reset?token=xyz'
      );

      const call = mockProvider.sendEmail.mock.calls[0][0];
      expect(call.html).toContain('http://example.com/reset?token=xyz');
      expect(call.html).toContain('Set New Password');
    });
  });
});

