/**
 * @fileoverview Unit tests for MailpitProvider
 */

import { MailpitProvider } from './mailpit.provider';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('MailpitProvider', () => {
  let provider: MailpitProvider;
  let mockTransporter: any;
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    mockSendMail = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail,
    };

    (nodemailer.createTransport as jest.Mock) = jest.fn(() => mockTransporter);

    // Reset environment
    delete process.env['MAILPIT_HOST'];
    delete process.env['MAILPIT_PORT'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create transporter with default settings', () => {
      provider = new MailpitProvider();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'mailpit',
        port: 1025,
        secure: false,
      });
    });

    it('should use environment variables for host and port', () => {
      process.env['MAILPIT_HOST'] = 'custom-host';
      process.env['MAILPIT_PORT'] = '2525';

      provider = new MailpitProvider();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'custom-host',
        port: 2525,
        secure: false,
      });
    });
  });

  describe('sendEmail', () => {
    beforeEach(() => {
      provider = new MailpitProvider();
    });

    it('should send email successfully', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-message-id',
      });

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'Alva <noreply@alva.local>',
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-message-id');
    });

    it('should use custom from address when provided', async () => {
      mockSendMail.mockResolvedValue({
        messageId: 'test-id',
      });

      await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        })
      );
    });

    it('should handle send errors gracefully', async () => {
      const error = new Error('SMTP connection failed');
      mockSendMail.mockRejectedValue(error);
      
      // Mock console.error to prevent test failures in CI
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send email');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Mailpit email error:', error);
      
      consoleErrorSpy.mockRestore();
    });

    it('should log email sent message on success', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockSendMail.mockResolvedValue({
        messageId: 'test-id',
      });

      await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Email sent to Mailpit (dev): test@example.com'
      );

      consoleSpy.mockRestore();
    });

    it('should log error on failure', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Connection failed');
      mockSendMail.mockRejectedValue(error);

      await provider.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Mailpit email error:',
        error
      );

      consoleErrorSpy.mockRestore();
    });
  });
});

