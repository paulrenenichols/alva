import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { TokenService } from '../services/token.service';

const registerSchema = z.object({
  email: z.string().email()
});

const verifySchema = z.object({
  token: z.string()
});

export async function authRoutes(fastify: FastifyInstance) {
  const tokenService = new TokenService();

  // Register user
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>, reply: FastifyReply) => {
    const { email } = request.body;
    
    try {
      // TODO: Implement database operations
      // For now, just return success
      
      // Generate magic link token (simplified for now)
      const magicToken = tokenService.generateRefreshToken();

      // TODO: Send email with magic link
      console.log(`Magic link for ${email}: ${magicToken}`);

      return { 
        message: 'User registered successfully. Check your email for verification link.',
        userId: 'temp-user-id' 
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Verify magic link
  fastify.post('/verify-magic-link', {
    schema: {
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: z.infer<typeof verifySchema> }>, reply: FastifyReply) => {
    const { token } = request.body;

    try {
      // TODO: Verify magic link token against database
      // For now, we'll create a mock verification
      
      // Generate tokens
      const accessToken = tokenService.generateAccessToken({
        userId: 'mock-user-id',
        email: 'mock@example.com'
      });

      const refreshToken = tokenService.generateRefreshToken();

      // Set refresh token as httpOnly cookie
      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return {
        accessToken,
        user: {
          id: 'mock-user-id',
          email: 'mock@example.com'
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user
  fastify.get('/me', {
    preHandler: async (request, reply) => {
      // TODO: Implement JWT validation middleware
    }
  }, async (request, reply) => {
    return {
      user: {
        id: 'mock-user-id',
        email: 'mock@example.com'
      }
    };
  });
}
