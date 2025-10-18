import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { openaiService } from '../lib/openai.client';
import { ClientProfileSchema } from '@alva/shared-types';

const generatePlanSchema = z.object({
  clientProfile: ClientProfileSchema,
});

export async function planRoutes(fastify: FastifyInstance) {
  // Generate marketing plan
  fastify.post(
    '/generate',
    {
      schema: {
        body: {
          type: 'object',
          required: ['clientProfile'],
          properties: {
            clientProfile: {
              type: 'object',
              required: ['businessName', 'industry'],
              properties: {
                businessName: { type: 'string' },
                industry: { type: 'string' },
                businessDescription: { type: 'string' },
                targetAudience: { type: 'string' },
                goals: { type: 'array', items: { type: 'string' } },
                budget: { type: 'number' },
                timeline: { type: 'string' },
                existingMarketing: { type: 'array', items: { type: 'string' } },
                competitors: { type: 'array', items: { type: 'string' } },
                uniqueValueProposition: { type: 'string' },
                brandPersonality: { type: 'array', items: { type: 'string' } },
                preferredChannels: { type: 'array', items: { type: 'string' } },
                successMetrics: { type: 'array', items: { type: 'string' } },
                constraints: { type: 'array', items: { type: 'string' } },
                additionalInfo: { type: 'string' }
              }
            }
          }
        }
      },
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof generatePlanSchema> }>,
      reply: FastifyReply
    ) => {
      try {
        const { clientProfile } = request.body;
        const userId = (request as any).user.userId;

        // Generate plan using OpenAI
        const plan = await openaiService.generatePPCPlan(clientProfile);

        // Store plan in database (simplified for MVP)
        const planId = `plan_${userId}_${Date.now()}`;

        // TODO: Store in database table
        console.log(`Generated plan ${planId} for user ${userId}`);

        return {
          planId,
          plan,
          status: 'completed',
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to generate plan' });
      }
    }
  );

  // Get plan status
  fastify.get(
    '/:id/status',
    {
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        // TODO: Check actual status from database
        return {
          planId: id,
          status: 'completed',
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to get plan status' });
      }
    }
  );

  // Get plan
  fastify.get(
    '/:id',
    {
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        // TODO: Retrieve from database
        return {
          planId: id,
          plan: {
            // Mock plan data
            plan: {
              client_id: 'Sample Business',
              window_start: '2025-08-01',
              window_end: '2025-12-31',
              weekly_capacity_hours: 10,
            },
            tasks: [
              {
                id: 'task_1',
                title: 'Set up Google Ads account',
                description:
                  'Create and configure Google Ads account with proper tracking',
                estimated_hours: 2,
                priority: 'high',
                due_date: '2025-08-15',
                status: 'planned',
              },
            ],
            meta: {
              generated_at: new Date().toISOString(),
              governance_version: '1.0',
            },
          },
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Failed to get plan' });
      }
    }
  );
}
