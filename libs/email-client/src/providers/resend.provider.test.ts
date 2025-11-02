/**
 * @fileoverview Unit tests for ResendProvider
 */

import { ResendProvider } from './resend.provider';
import { Resend } from 'resend';

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe('ResendProvider', () => {
  let provider: ResendProvider;
  let mockResendInstance: any;
  let mockSendEmail: jest.Mock;

  beforeEach(() => {
    mockSendEmail = jest.fn();
    mockResendInstance = {
      emails: {
        send: mockSendEmail,
      },
    };

    (Resend as jest.Mock).mockImplementation(() => mockResendInstance);

    // Reset environment
    delete process.env['RESEND_API_KEY'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create Resend instance with API key', () => {
      process.env['RESEND_API_KEY'] = 'test-api-key';

      provider = new ResendProvider();

      expect(Resend).toHaveBeenCalledWith('test-api-key');
    });

    it('should create Resend instance even without API key', () => {
      delete process.env['RESEND_API_KEY'];

      provider = new ResendProvider();

      expect(Resend).toHaveBeenCalledWith(undefined);
    });

    it('should log warning when API key is missing', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      delete process.env['RESEND_API_KEY'];

      provider = new ResendProvider();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'RESEND_API_KEY not configured'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('sendEmail', () => {
    beforeEach(() => {
      process.env['RESEND_API_KEY'] = 'test-api-key';
      provider = new ResendProvider();
    });

    it('should send email successfully', async () => {
      mockSendEmail.mockResolvedValue({
        data: {
          id: 'resend-message-id',
        },
      });

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      });

      expect(mockSendEmail).toHaveBeenCalledWith({
        from: 'Alva <noreply@alva.app>',
        to: ['test@example.com'],
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('resend-message-id');
    });

    it('should use custom from address when provided', async () => {
      mockSendEmail.mockResolvedValue({
        data: { id: 'test-id' },
      });

      await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        })
      );
    });

    it('should return error when API key is not configured', async () => {
      delete process.env['RESEND_API_KEY'];
      provider = new ResendProvider();

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service not configured');
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it('should handle send errors gracefully', async () => {
      const error = new Error('Resend API error');
      mockSendEmail.mockRejectedValue(error);

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send email');
    });

    it('should handle missing message ID gracefully', async () => {
      mockSendEmail.mockResolvedValue({
        data: undefined,
      });

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeUndefined();
    });

    it('should log error on failure', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('API error');
      mockSendEmail.mockRejectedValue(error);

      await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Email send error:', error);

      consoleErrorSpy.mockRestore();
    });
  });
});

