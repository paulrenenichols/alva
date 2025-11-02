/**
 * @fileoverview Unit tests for invite email template
 */

import { getInviteEmailTemplate } from './invite.template';

describe('getInviteEmailTemplate', () => {
  it('should include invite URL in template', () => {
    const url = 'http://example.com/signup?token=abc123';
    const token = 'abc123';
    const template = getInviteEmailTemplate(url, token);

    expect(template).toContain(url);
    expect(template).toContain("You're Invited to Alva!");
    expect(template).toContain('Accept Invitation');
  });

  it('should include link as both button and text link', () => {
    const url = 'http://test.com/signup?token=xyz';
    const token = 'xyz';
    const template = getInviteEmailTemplate(url, token);

    // Should have button with href
    expect(template).toContain(`<a href="${url}"`);
    // Should have text link
    expect(template).toContain(`<a href="${url}" style="color: #f97316;">${url}</a>`);
  });

  it('should include expiration notice', () => {
    const url = 'http://example.com/signup?token=abc';
    const token = 'abc';
    const template = getInviteEmailTemplate(url, token);

    expect(template).toContain('7 days');
  });

  it('should handle special characters in URL', () => {
    const url = 'http://example.com/signup?token=abc%20123&ref=test';
    const token = 'abc 123';
    const template = getInviteEmailTemplate(url, token);

    expect(template).toContain(url);
  });
});

