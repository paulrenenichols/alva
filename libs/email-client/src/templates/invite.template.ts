/**
 * @fileoverview Email template for user invites
 */

export function getInviteEmailTemplate(inviteUrl: string, token: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f97316; font-size: 28px;">You're Invited to Alva!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #374151;">
          You've been invited to join Alva, your personal AI marketing director.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" 
           style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Accept Invitation
        </a>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 14px; color: #6b7280;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${inviteUrl}" style="color: #f97316;">${inviteUrl}</a>
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    </div>
  `;
}

