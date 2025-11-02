/**
 * @fileoverview Unit tests for password reset email template
 */

import { getPasswordResetTemplate } from './password-reset.template';

describe('getPasswordResetTemplate', () => {
  it('should include reset URL in template', () => {
    const url = 'http://example.com/reset?token=abc123';
    const template = getPasswordResetTemplate(url);

    expect(template).toContain(url);
    expect(template).toContain('Reset your password');
    expect(template).toContain('Set New Password');
  });

  it('should include link as both button and text link', () => {
    const url = 'http://test.com/reset?token=xyz';
    const template = getPasswordResetTemplate(url);

    // Should have button with href
    expect(template).toContain(`<a href="${url}"`);
    // Should have text link
    expect(template).toContain(`<a href="${url}" style="color: #f97316;">${url}</a>`);
  });

  it('should include expiration notice', () => {
    const url = 'http://example.com/reset?token=abc';
    const template = getPasswordResetTemplate(url);

    expect(template).toContain('1 hour');
  });

  it('should handle special characters in URL', () => {
    const url = 'http://example.com/reset?token=abc%20123&ref=test';
    const template = getPasswordResetTemplate(url);

    expect(template).toContain(url);
  });
});

