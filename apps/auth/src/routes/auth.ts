/**
 * @fileoverview Authentication routes for user registration, verification, and profile management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { adminUsers, adminPasswordResetTokens, adminRoles, adminUserRoles, webUsers } from '@alva/database';
import { WebUserService } from '../services/web-user.service';
import { AdminUserService } from '../services/admin-user.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { WebInviteService } from '../services/web-invite.service';
import { authenticateToken } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

declare module 'fastify' {
  interface FastifyInstance {
    db: any;
  }
}

const REGISTER_SCHEMA = z.object({
  email: z.string().email(),
});

const VERIFY_SCHEMA = z.object({
  token: z.string(),
});

const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * @description Registers the user registration route
 * @param fastify - Fastify instance
 * @param userService - User service instance
 * @param emailService - Email service instance
 */
async function registerUserRoute(
  fastify: FastifyInstance,
  webUserService: WebUserService,
  emailService: EmailService,
  webInviteService: WebInviteService
): Promise<void> {
  fastify.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'inviteToken', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            inviteToken: { type: 'string' },
            password: { type: 'string', minLength: 8 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, inviteToken, password } = request.body as { email: string; inviteToken: string; password: string };

      try {
        // Validate invite token
        const validation = await webInviteService.validateInvite(inviteToken);
        if (!validation.valid) {
          return reply.code(400).send({
            error: validation.error,
            code: 'INVALID_INVITE',
          });
        }

        const existingUser = await webUserService.findWebUserByEmail(email);
        if (existingUser) {
          return reply.code(400).send({
            error: 'User already exists',
            code: 'USER_EXISTS',
          });
        }

        const user = await webUserService.createWebUser(email, password);
        
        // Mark invite as used
        await webInviteService.markInviteAsUsed(inviteToken, user.id);

        return {
          message: 'User registered successfully.',
          userId: user.id,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the email verification route
 * @param fastify - Fastify instance
 * @param userService - User service instance
 * @param tokenService - Token service instance
 */
async function verifyEmailRoute(
  fastify: FastifyInstance,
  webUserService: WebUserService,
  tokenService: TokenService
): Promise<void> {
  fastify.post(
    '/verify',
    {
      schema: {
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof VERIFY_SCHEMA> }>,
      reply: FastifyReply
    ) => {
      const { token } = request.body;

      try {
        const userId = await webUserService.verifyWebToken(token);
        if (!userId) {
          return reply.code(400).send({ error: 'Invalid or expired token' });
        }

        const webUser = await webUserService.findWebUserById(userId);
        if (!webUser) {
          return reply.code(400).send({ error: 'User not found' });
        }

        const accessToken = tokenService.generateAccessToken({
          userId,
          email: webUser.email,
          userType: 'web',
        });
        const refreshToken = tokenService.generateRefreshToken();

        await webUserService.createWebRefreshToken(userId, refreshToken);
        setRefreshTokenCookie(reply, refreshToken);

        return {
          accessToken,
          user: { id: userId, email: webUser.email },
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the password login route
 * @param fastify - Fastify instance
 * @param userService - User service instance
 * @param tokenService - Token service instance
 */
async function loginPasswordRoute(fastify: FastifyInstance, adminUserService: AdminUserService, tokenService: TokenService): Promise<void> {
  fastify.post(
    '/login-password',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as { email: string; password: string };

      try {
        // Find admin user
        const [user] = await fastify.db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

        if (!user || !user.passwordHash) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Check if password reset required
        if (user.mustResetPassword) {
          const resetToken = await adminUserService.createAdminPasswordResetToken(user.id);

          return reply.code(403).send({
            error: 'Password reset required',
            code: 'MUST_RESET_PASSWORD',
            resetToken: resetToken,
          });
        }

        // Generate tokens
        const accessToken = tokenService.generateAccessToken({
          userId: user.id,
          email: user.email,
          userType: 'admin',
        });
        const refreshToken = tokenService.generateRefreshToken();
        await adminUserService.createAdminRefreshToken(user.id, refreshToken);

        setRefreshTokenCookie(reply, refreshToken);

        return {
          accessToken,
          user: { id: user.id, email: user.email },
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the web user password login route
 * @param fastify - Fastify instance
 * @param webUserService - Web user service instance
 * @param tokenService - Token service instance
 */
async function loginWebPasswordRoute(
  fastify: FastifyInstance,
  webUserService: WebUserService,
  tokenService: TokenService
): Promise<void> {
  fastify.post(
    '/login-web-password',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body as { email: string; password: string };

      try {
        const user = await webUserService.findWebUserByEmail(email);
        if (!user || !user.passwordHash) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const accessToken = tokenService.generateAccessToken({
          userId: user.id,
          email: user.email,
          userType: 'web',
        });
        const refreshToken = tokenService.generateRefreshToken();
        await webUserService.createWebRefreshToken(user.id, refreshToken);

        setRefreshTokenCookie(reply, refreshToken);

        return {
          accessToken,
          user: { id: user.id, email: user.email },
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the password reset route
 * @param fastify - Fastify instance
 */
async function resetPasswordRoute(fastify: FastifyInstance, adminUserService: AdminUserService): Promise<void> {
  fastify.post(
    '/reset-password',
    {
      schema: {
        body: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: { type: 'string' },
            newPassword: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { token, newPassword } = request.body as { token: string; newPassword: string };

      try {
        // Validate token
        const [resetToken] = await fastify.db
          .select()
          .from(adminPasswordResetTokens)
          .where(eq(adminPasswordResetTokens.token, token))
          .limit(1);

        if (!resetToken) {
          return reply.code(400).send({ error: 'Invalid reset token' });
        }

        if (resetToken.usedAt) {
          return reply.code(400).send({ error: 'Token has already been used' });
        }

        if (new Date(resetToken.expiresAt) < new Date()) {
          return reply.code(400).send({ error: 'Token has expired' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update admin user
        await adminUserService.updateAdminUserPassword(resetToken.adminUserId, passwordHash);

        // Mark token as used
        await fastify.db.update(adminPasswordResetTokens)
          .set({ usedAt: new Date() })
          .where(eq(adminPasswordResetTokens.token, token));

        // Generate tokens and set refresh cookie
        const tokenService = new TokenService();
        const adminUser = await adminUserService.findAdminUserById(resetToken.adminUserId);
        const accessToken = tokenService.generateAccessToken({ 
          userId: resetToken.adminUserId, 
          email: adminUser?.email || '',
          userType: 'admin',
        });
        const refreshToken = tokenService.generateRefreshToken();

        // Store hashed refresh token via service helper (handles hashing/tokenHash column)
        await adminUserService.createAdminRefreshToken(resetToken.adminUserId, refreshToken);
        setRefreshTokenCookie(reply, refreshToken);

        return { message: 'Password reset successful', accessToken };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Admin recovery request route (no auth). Sends password reset email if admin user exists.
 */
async function recoveryRequestRoute(fastify: FastifyInstance, emailService: EmailService, adminUserService: AdminUserService): Promise<void> {
  fastify.post(
    '/recovery-request',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: { email: { type: 'string', format: 'email' } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email } = request.body as { email: string };
      try {
        // Lookup admin user
        const user = await adminUserService.findAdminUserByEmail(email);

        if (user) {
          // Check admin role
          const [adminRole] = await fastify.db.select().from(adminRoles).where(eq(adminRoles.name, 'admin')).limit(1);
          if (adminRole) {
            const [userRole] = await fastify.db
              .select()
              .from(adminUserRoles)
              .where(and(eq(adminUserRoles.adminUserId, user.id), eq(adminUserRoles.roleId, adminRole.id)))
              .limit(1);

            if (userRole) {
              // Create reset token (1 hour expiry)
              const resetToken = await adminUserService.createAdminPasswordResetToken(user.id);
              // Send recovery email
              await emailService.sendPasswordResetEmail(email, resetToken);
            }
          }
        }

        // Always return success (no enumeration)
        return { message: 'If an account exists, a recovery link has been sent.' };
      } catch (error) {
        fastify.log.error(error);
        // Still return success to avoid leaking state
        return { message: 'If an account exists, a recovery link has been sent.' };
      }
    }
  );
}

/**
 * @description Registers the current user profile route
 * @param fastify - Fastify instance
 */
async function getCurrentUserRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/me',
    {
      preHandler: authenticateToken,
    },
    async (request, reply) => {
      return {
        user: request.user,
      };
    }
  );
}

/**
 * @description Sets the refresh token as an HTTP-only cookie
 * @param reply - Fastify reply object
 * @param refreshToken - Refresh token to set
 */
function setRefreshTokenCookie(
  reply: FastifyReply,
  refreshToken: string
): void {
  const isProduction = process.env['NODE_ENV'] === 'production';

  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * @description Registers authentication routes with the Fastify instance
 * @param fastify - Fastify instance to register routes with
 */
export async function authRoutes(fastify: FastifyInstance) {
  const webUserService = new WebUserService(fastify.db);
  const adminUserService = new AdminUserService(fastify.db);
  const emailService = new EmailService();
  const tokenService = new TokenService();
  const webInviteService = new WebInviteService(fastify.db);

  await registerUserRoute(fastify, webUserService, emailService, webInviteService);
  await verifyEmailRoute(fastify, webUserService, tokenService);
  await loginPasswordRoute(fastify, adminUserService, tokenService);
  await loginWebPasswordRoute(fastify, webUserService, tokenService);
  await resetPasswordRoute(fastify, adminUserService);
  await recoveryRequestRoute(fastify, emailService, adminUserService);
  await getCurrentUserRoute(fastify);
}
