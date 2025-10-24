/**
 * @fileoverview Authentication routes for user registration, verification, and profile management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users, verificationTokens } from '@alva/database';
import { UserService } from '../services/user.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { authenticateToken } from '../middleware/auth.middleware';

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

  await registerUserRoute(fastify, userService, emailService);
  await verifyEmailRoute(fastify, userService, tokenService);
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
  emailService: EmailService
): Promise<void> {
  fastify.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof REGISTER_SCHEMA> }>,
      reply: FastifyReply
    ) => {
      const { email } = request.body;

      try {
        const existingUser = await checkExistingUser(fastify, email);
        if (existingUser) {
          return reply.code(400).send({ error: 'User already exists' });
        }

        const user = await userService.createUser(email);
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
function setRefreshTokenCookie(reply: FastifyReply, refreshToken: string): void {
  const isProduction = process.env['NODE_ENV'] === 'production';
  
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}
