/**
 * @fileoverview Unit tests for verification email template
 */

import { getVerificationEmailTemplate } from './verification.template';

describe('getVerificationEmailTemplate', () => {
  it('should include verification URL in template', () => {
    const url = 'http://example.com/verify?token=abc123';
    const template = getVerificationEmailTemplate(url);

    expect(template).toContain(url);
    expect(template).toContain('Welcome to Alva!');
    expect(template).toContain('Verify Email Address');
  });

  it('should include link as both button and text link', () => {
    const url = 'http://test.com/verify?token=xyz';
    const template = getVerificationEmailTemplate(url);

    // Should have button with href
    expect(template).toContain(`<a href="${url}"`);
    // Should have text link
    expect(template).toContain(`<a href="${url}" style="color: #f97316;">${url}</a>`);
  });

  it('should include expiration notice', () => {
    const url = 'http://example.com/verify?token=abc';
    const template = getVerificationEmailTemplate(url);

    expect(template).toContain('24 hours');
    expect(template).toContain('security reasons');
  });

  it('should handle special characters in URL', () => {
    const url = 'http://example.com/verify?token=abc%20123&ref=test';
    const template = getVerificationEmailTemplate(url);

    expect(template).toContain(url);
  });
});

