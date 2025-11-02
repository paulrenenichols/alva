/**
 * @fileoverview Email template for password reset
 */

export function getPasswordResetTemplate(resetUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 24px;">Reset your password</h1>
      </div>

      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          You (or someone) requested a password reset for your admin account. This link will expire in 1 hour.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
           style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Set New Password
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 14px; color: #6b7280;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #f97316;">${resetUrl}</a>
        </p>
      </div>
    </div>
  `;
}

