/**
 * @fileoverview Admin routes for managing invites
 */

import { FastifyInstance } from 'fastify';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { WebInviteService } from '../services/web-invite.service';
import { EmailService } from '../services/email.service';
import { webInvites } from '@alva/database';
import { eq } from 'drizzle-orm';

export async function adminRoutes(fastify: FastifyInstance) {
  // Require authentication for all admin routes
  fastify.addHook('preHandler', authenticateToken);
  fastify.addHook('preHandler', requireAdmin);

  const webInviteService = new WebInviteService(fastify.db);
  const emailService = new EmailService();

  // Send invite
  fastify.post(
    '/admin/invites',
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
    async (request, reply) => {
      try {
        const { email } = request.body as { email: string };
        const userId = request.user?.id;

        if (!userId) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        const invite = await webInviteService.createInvite(email, userId);
        await emailService.sendInviteEmail(email, invite.token);

        return {
          message: 'Invite sent successfully',
          invite,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to send invite' });
      }
    }
  );

  // List invites
  fastify.get(
    '/admin/invites',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'string' },
            limit: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { page = '1', limit = '20' } = request.query as {
          page?: string;
          limit?: string;
        };
        const result = await webInviteService.getInvites(
          parseInt(page),
          parseInt(limit)
        );

        return result;
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to fetch invites' });
      }
    }
  );

  // Resend invite
  fastify.post(
    '/admin/invites/:inviteId/resend',
    {
      schema: {
        params: {
          type: 'object',
          required: ['inviteId'],
          properties: {
            inviteId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { inviteId } = request.params as { inviteId: string };

        const [invite] = await fastify.db
          .select()
          .from(webInvites)
          .where(eq(webInvites.id, inviteId));

        if (!invite) {
          return reply.code(404).send({ error: 'Invite not found' });
        }

        if (new Date(invite.expiresAt) < new Date()) {
          return reply.code(400).send({ error: 'Invite has expired' });
        }

        await emailService.sendInviteEmail(invite.email, invite.token);

        return { message: 'Invite resent successfully' };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to resend invite' });
      }
    }
  );
}
