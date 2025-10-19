import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.WEB_URL}/verify?token=${token}`;

    return await resend.emails.send({
      from: 'Alva <noreply@alva.app>',
      to: [email],
      subject: 'Verify your email - Alva',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Alva!</h1>
          <p>Click the button below to verify your email and access your personalized marketing plan:</p>
          <a href="${verificationUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });
  }
}
