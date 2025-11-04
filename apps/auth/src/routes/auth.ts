/**
 * @fileoverview Authentication routes for user registration, verification, and profile management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import {
  adminUsers,
  adminPasswordResetTokens,
  adminRoles,
  adminUserRoles,
  webUsers,
} from '@alva/database';
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
      const { email, inviteToken, password } = request.body as {
        email: string;
        inviteToken: string;
        password: string;
      };

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
async function loginPasswordRoute(
  fastify: FastifyInstance,
  adminUserService: AdminUserService,
  tokenService: TokenService
): Promise<void> {
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
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      try {
        // Find admin user
        const [user] = await fastify.db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email))
          .limit(1);

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
          const resetToken =
            await adminUserService.createAdminPasswordResetToken(user.id);

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
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

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
async function resetPasswordRoute(
  fastify: FastifyInstance,
  adminUserService: AdminUserService
): Promise<void> {
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
      const { token, newPassword } = request.body as {
        token: string;
        newPassword: string;
      };
      const tokenPrefix = token ? token.substring(0, 8) + '***' : 'missing';

      fastify.log.info(
        {
          route: 'reset-password',
          tokenPrefix,
          step: 'request_received',
          passwordLength: newPassword?.length || 0,
        },
        '[ResetPassword] Reset password request received'
      );

      try {
        // Validate token
        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'token_validation_start',
          },
          '[ResetPassword] Validating reset token'
        );

        const [resetToken] = await fastify.db
          .select()
          .from(adminPasswordResetTokens)
          .where(eq(adminPasswordResetTokens.token, token))
          .limit(1);

        if (!resetToken) {
          fastify.log.warn(
            {
              route: 'reset-password',
              tokenPrefix,
              step: 'token_not_found',
            },
            '[ResetPassword] Invalid reset token'
          );
          return reply.code(400).send({ error: 'Invalid reset token' });
        }

        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'token_found',
            userId: resetToken.adminUserId,
            expiresAt: resetToken.expiresAt.toISOString(),
            usedAt: resetToken.usedAt?.toISOString() || null,
          },
          '[ResetPassword] Token found, checking validity'
        );

        if (resetToken.usedAt) {
          fastify.log.warn(
            {
              route: 'reset-password',
              tokenPrefix,
              step: 'token_already_used',
              userId: resetToken.adminUserId,
              usedAt: resetToken.usedAt.toISOString(),
            },
            '[ResetPassword] Token has already been used'
          );
          return reply.code(400).send({ error: 'Token has already been used' });
        }

        const now = new Date();
        if (new Date(resetToken.expiresAt) < now) {
          fastify.log.warn(
            {
              route: 'reset-password',
              tokenPrefix,
              step: 'token_expired',
              userId: resetToken.adminUserId,
              expiresAt: resetToken.expiresAt.toISOString(),
              currentTime: now.toISOString(),
            },
            '[ResetPassword] Token has expired'
          );
          return reply.code(400).send({ error: 'Token has expired' });
        }

        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'hashing_password',
            userId: resetToken.adminUserId,
          },
          '[ResetPassword] Token valid, hashing new password'
        );

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'updating_password',
            userId: resetToken.adminUserId,
          },
          '[ResetPassword] Updating admin user password'
        );

        // Update admin user
        await adminUserService.updateAdminUserPassword(
          resetToken.adminUserId,
          passwordHash
        );

        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'marking_token_used',
            userId: resetToken.adminUserId,
          },
          '[ResetPassword] Marking reset token as used'
        );

        // Mark token as used
        await fastify.db
          .update(adminPasswordResetTokens)
          .set({ usedAt: new Date() })
          .where(eq(adminPasswordResetTokens.token, token));

        fastify.log.debug(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'generating_tokens',
            userId: resetToken.adminUserId,
          },
          '[ResetPassword] Generating access and refresh tokens'
        );

        // Generate tokens and set refresh cookie
        const tokenService = new TokenService();
        const adminUser = await adminUserService.findAdminUserById(
          resetToken.adminUserId
        );
        const accessToken = tokenService.generateAccessToken({
          userId: resetToken.adminUserId,
          email: adminUser?.email || '',
          userType: 'admin',
        });
        const refreshToken = tokenService.generateRefreshToken();

        // Store hashed refresh token via service helper (handles hashing/tokenHash column)
        await adminUserService.createAdminRefreshToken(
          resetToken.adminUserId,
          refreshToken
        );
        setRefreshTokenCookie(reply, refreshToken);

        fastify.log.info(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'password_reset_success',
            userId: resetToken.adminUserId,
            emailPrefix: adminUser?.email
              ? adminUser.email.substring(0, 3) + '***'
              : 'unknown',
          },
          '[ResetPassword] Password reset successful'
        );

        return { message: 'Password reset successful', accessToken };
      } catch (error) {
        fastify.log.error(
          {
            route: 'reset-password',
            tokenPrefix,
            step: 'error',
            error: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            errorType:
              error instanceof Error ? error.constructor.name : typeof error,
          },
          '[ResetPassword] Error processing password reset'
        );
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Admin recovery request route (no auth). Sends password reset email if admin user exists.
 */
async function recoveryRequestRoute(
  fastify: FastifyInstance,
  emailService: EmailService,
  adminUserService: AdminUserService
): Promise<void> {
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
      const emailPrefix = email.substring(0, 3) + '***';

      console.log('[RecoveryRequest] Recovery request received', {
        route: 'recovery-request',
        emailPrefix,
        step: 'request_received',
      });
      fastify.log.info(
        {
          route: 'recovery-request',
          emailPrefix,
          step: 'request_received',
        },
        '[RecoveryRequest] Recovery request received'
      );

      try {
        // Lookup admin user
        fastify.log.debug(
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'user_lookup_start',
          },
          '[RecoveryRequest] Looking up admin user by email'
        );
        console.log('[RecoveryRequest] Looking up admin user by email', {
          route: 'recovery-request',
          emailPrefix,
          step: 'user_lookup_start',
        });

        const user = await adminUserService.findAdminUserByEmail(email);

        if (!user) {
          fastify.log.info(
            {
              route: 'recovery-request',
              emailPrefix,
              step: 'user_not_found',
            },
            '[RecoveryRequest] User not found (returning generic success)'
          );
          console.log(
            '[RecoveryRequest] User not found (returning generic success)',
            { route: 'recovery-request', emailPrefix, step: 'user_not_found' }
          );
          return {
            message: 'If an account exists, a recovery link has been sent.',
          };
        }

        fastify.log.debug(
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'user_found',
            userId: user.id,
          },
          '[RecoveryRequest] User found, checking admin role'
        );
        console.log('[RecoveryRequest] User found, checking admin role', {
          route: 'recovery-request',
          emailPrefix,
          step: 'user_found',
          userId: user.id,
        });

        // Check admin role
        const [adminRole] = await fastify.db
          .select()
          .from(adminRoles)
          .where(eq(adminRoles.name, 'admin'))
          .limit(1);

        if (!adminRole) {
          fastify.log.warn(
            {
              route: 'recovery-request',
              emailPrefix,
              step: 'admin_role_not_found',
              userId: user.id,
            },
            '[RecoveryRequest] Admin role not found in database'
          );
          console.log('[RecoveryRequest] Admin role not found in database', {
            route: 'recovery-request',
            emailPrefix,
            step: 'admin_role_not_found',
            userId: user.id,
          });
          return {
            message: 'If an account exists, a recovery link has been sent.',
          };
        }

        const [userRole] = await fastify.db
          .select()
          .from(adminUserRoles)
          .where(
            and(
              eq(adminUserRoles.adminUserId, user.id),
              eq(adminUserRoles.roleId, adminRole.id)
            )
          )
          .limit(1);

        if (!userRole) {
          fastify.log.info(
            {
              route: 'recovery-request',
              emailPrefix,
              step: 'user_not_admin',
              userId: user.id,
            },
            '[RecoveryRequest] User does not have admin role (returning generic success)'
          );
          return {
            message: 'If an account exists, a recovery link has been sent.',
          };
        }

        fastify.log.debug(
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'creating_reset_token',
            userId: user.id,
          },
          '[RecoveryRequest] User has admin role, creating reset token'
        );
        console.log(
          '[RecoveryRequest] User has admin role, creating reset token',
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'creating_reset_token',
            userId: user.id,
          }
        );

        // Create reset token (1 hour expiry)
        const resetToken = await adminUserService.createAdminPasswordResetToken(
          user.id
        );

        fastify.log.info(
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'reset_token_created',
            userId: user.id,
            tokenPrefix: resetToken.substring(0, 8) + '***',
          },
          '[RecoveryRequest] Reset token created, sending email'
        );
        console.log('[RecoveryRequest] Reset token created, sending email', {
          route: 'recovery-request',
          emailPrefix,
          step: 'reset_token_created',
          userId: user.id,
          tokenPrefix: resetToken.substring(0, 8) + '***',
        });

        // Send recovery email
        console.log(
          '[RecoveryRequest] Calling emailService.sendPasswordResetEmail',
          { email, tokenPrefix: resetToken.substring(0, 8) + '***' }
        );
        const emailResult = await emailService.sendPasswordResetEmail(
          email,
          resetToken
        );
        console.log('[RecoveryRequest] Email service result', {
          success: emailResult.success,
          messageId: emailResult.messageId,
          error: emailResult.error,
        });

        if (!emailResult.success) {
          fastify.log.error(
            {
              route: 'recovery-request',
              emailPrefix,
              step: 'email_send_failed',
              userId: user.id,
              error: emailResult.error,
              errorType: typeof emailResult.error,
            },
            '[RecoveryRequest] Email send failed'
          );
          console.error('[RecoveryRequest] Email send failed', {
            route: 'recovery-request',
            emailPrefix,
            step: 'email_send_failed',
            userId: user.id,
            error: emailResult.error,
            errorType: typeof emailResult.error,
          });
        } else {
          fastify.log.info(
            {
              route: 'recovery-request',
              emailPrefix,
              step: 'email_sent_success',
              userId: user.id,
              messageId: emailResult.messageId,
            },
            '[RecoveryRequest] Recovery email sent successfully'
          );
          console.log('[RecoveryRequest] Recovery email sent successfully', {
            route: 'recovery-request',
            emailPrefix,
            step: 'email_sent_success',
            userId: user.id,
            messageId: emailResult.messageId,
          });
        }

        // Always return success (no enumeration)
        return {
          message: 'If an account exists, a recovery link has been sent.',
        };
      } catch (error) {
        fastify.log.error(
          {
            route: 'recovery-request',
            emailPrefix,
            step: 'error',
            error: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            errorType:
              error instanceof Error ? error.constructor.name : typeof error,
          },
          '[RecoveryRequest] Error processing recovery request'
        );
        console.error('[RecoveryRequest] Error processing recovery request', {
          route: 'recovery-request',
          emailPrefix,
          step: 'error',
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
          errorType:
            error instanceof Error ? error.constructor.name : typeof error,
        });
        // Still return success to avoid leaking state
        return {
          message: 'If an account exists, a recovery link has been sent.',
        };
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

  await registerUserRoute(
    fastify,
    webUserService,
    emailService,
    webInviteService
  );
  await verifyEmailRoute(fastify, webUserService, tokenService);
  await loginPasswordRoute(fastify, adminUserService, tokenService);
  await loginWebPasswordRoute(fastify, webUserService, tokenService);
  await resetPasswordRoute(fastify, adminUserService);
  await recoveryRequestRoute(fastify, emailService, adminUserService);
  await getCurrentUserRoute(fastify);
}
