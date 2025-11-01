/**
 * @fileoverview Authentication routes for user registration, verification, and profile management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { users, verificationTokens, passwordResetTokens, refreshTokens, roles, userRoles } from '@alva/database';
import { UserService } from '../services/user.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { InviteService } from '../services/invite.service';
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
 * @description Registers authentication routes with the Fastify instance
 * @param fastify - Fastify instance to register routes with
 */
export async function authRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify.db);
  const emailService = new EmailService();
  const tokenService = new TokenService();
  const inviteService = new InviteService(fastify.db);

  await registerUserRoute(fastify, userService, emailService, inviteService);
  await verifyEmailRoute(fastify, userService, tokenService);
  await loginPasswordRoute(fastify, userService, tokenService);
  await resetPasswordRoute(fastify);
  await recoveryRequestRoute(fastify, emailService);
  await getCurrentUserRoute(fastify);
}

/**
 * @description Registers the user registration route
 * @param fastify - Fastify instance
 * @param userService - User service instance
 * @param emailService - Email service instance
 */
async function registerUserRoute(
  fastify: FastifyInstance,
  userService: UserService,
  emailService: EmailService,
  inviteService: InviteService
): Promise<void> {
  fastify.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'inviteToken'],
          properties: {
            email: { type: 'string', format: 'email' },
            inviteToken: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, inviteToken } = request.body as { email: string; inviteToken: string };

      try {
        // Validate invite token
        const validation = await inviteService.validateInvite(inviteToken);
        if (!validation.valid) {
          return reply.code(400).send({
            error: validation.error,
            code: 'INVALID_INVITE',
          });
        }

        const existingUser = await checkExistingUser(fastify, email);
        if (existingUser) {
          return reply.code(400).send({
            error: 'User already exists',
            code: 'USER_EXISTS',
          });
        }

        const user = await userService.createUser(email);
        
        // Mark invite as used
        await inviteService.markInviteAsUsed(inviteToken, user.id);

        const token = await userService.createVerificationToken(user.id);
        await emailService.sendVerificationEmail(email, token);

        return {
          message: 'User registered successfully. Check your email for verification link.',
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
  userService: UserService,
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
        const userId = await userService.verifyToken(token);
        if (!userId) {
          return reply.code(400).send({ error: 'Invalid or expired token' });
        }

        const accessToken = tokenService.generateAccessToken({
          userId,
          email: '',
        });
        const refreshToken = tokenService.generateRefreshToken();

        await userService.createRefreshToken(userId, refreshToken);
        setRefreshTokenCookie(reply, refreshToken);

        return {
          accessToken,
          user: { id: userId },
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
async function loginPasswordRoute(fastify: FastifyInstance, userService: UserService, tokenService: TokenService): Promise<void> {
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
        // Find user
        const [user] = await fastify.db.select().from(users).where(eq(users.email, email)).limit(1);

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
          const resetToken = crypto.randomBytes(32).toString('hex');

          await fastify.db.insert(passwordResetTokens).values({
            userId: user.id,
            token: resetToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          });

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
        });
        const refreshToken = tokenService.generateRefreshToken();
        await userService.createRefreshToken(user.id, refreshToken);

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
async function resetPasswordRoute(fastify: FastifyInstance): Promise<void> {
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
          .from(passwordResetTokens)
          .where(eq(passwordResetTokens.token, token))
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

        // Update user
        await fastify.db.update(users)
          .set({
            passwordHash,
            mustResetPassword: false,
          })
          .where(eq(users.id, resetToken.userId));

        // Mark token as used
        await fastify.db.update(passwordResetTokens)
          .set({ usedAt: new Date() })
          .where(eq(passwordResetTokens.token, token));

        // Generate tokens and set refresh cookie
        const tokenService = new TokenService();
        const accessToken = tokenService.generateAccessToken({ userId: resetToken.userId, email: '' });
        const refreshToken = tokenService.generateRefreshToken();

        // Store hashed refresh token via service helper (handles hashing/tokenHash column)
        const userService = new UserService(fastify.db);
        await userService.createRefreshToken(resetToken.userId, refreshToken);
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
async function recoveryRequestRoute(fastify: FastifyInstance, emailService: EmailService): Promise<void> {
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
        // Lookup user
        const [user] = await fastify.db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user) {
          // Check admin role
          const [adminRole] = await fastify.db.select().from(roles).where(eq(roles.name, 'admin')).limit(1);
          if (adminRole) {
            const [userRole] = await fastify.db
              .select()
              .from(userRoles)
              .where(and(eq(userRoles.userId, user.id), eq(userRoles.roleId, adminRole.id)))
              .limit(1);

            if (userRole) {
              // Create reset token (1 hour expiry)
              const resetToken = crypto.randomBytes(32).toString('hex');
              await fastify.db.insert(passwordResetTokens).values({ userId: user.id, token: resetToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000) });
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
 * @description Checks if a user with the given email already exists
 * @param fastify - Fastify instance
 * @param email - Email address to check
 * @returns User object if exists, null otherwise
 */
async function checkExistingUser(fastify: FastifyInstance, email: string) {
  return await fastify.db.query.users.findFirst({
    where: eq(users.email, email),
  });
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
