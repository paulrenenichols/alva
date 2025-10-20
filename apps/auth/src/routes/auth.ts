import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users, verificationTokens } from '@alva/database';
import { UserService } from '../services/user.service';
import { EmailService } from '../services/email.service';
import { TokenService } from '../services/token.service';
import { authenticateToken } from '../middleware/auth.middleware';

const registerSchema = z.object({
  email: z.string().email(),
});

const verifySchema = z.object({
  token: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify.db);
  const emailService = new EmailService();
  const tokenService = new TokenService();

  // Register user
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
      request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>,
      reply: FastifyReply
    ) => {
      const { email } = request.body;

      try {
        // Check if user already exists
        const existingUser = await fastify.db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (existingUser) {
          return reply.code(400).send({ error: 'User already exists' });
        }

        // Create user
        const user = await userService.createUser(email);

        // Generate verification token
        const token = await userService.createVerificationToken(user.id);

        // Send verification email
        await emailService.sendVerificationEmail(email, token);

        return {
          message:
            'User registered successfully. Check your email for verification link.',
          userId: user.id,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Verify email with real token validation
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
      request: FastifyRequest<{ Body: z.infer<typeof verifySchema> }>,
      reply: FastifyReply
    ) => {
      const { token } = request.body;

      try {
        const userId = await userService.verifyToken(token);

        if (!userId) {
          return reply.code(400).send({ error: 'Invalid or expired token' });
        }

        // Generate JWT tokens
        const accessToken = tokenService.generateAccessToken({
          userId,
          email: '',
        });
        const refreshToken = tokenService.generateRefreshToken();

        // Store refresh token
        await userService.createRefreshToken(userId, refreshToken);

        // Set refresh token cookie
        reply.setCookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env['NODE_ENV'] === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

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

  // Get current user
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
