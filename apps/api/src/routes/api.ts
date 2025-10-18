import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const generatePlanSchema = z.object({
  clientProfile: z.object({
    // Define client profile structure
    businessName: z.string(),
    industry: z.string(),
    // Add more fields as needed
  })
});

export async function apiRoutes(fastify: FastifyInstance) {
  // Generate marketing plan
  fastify.post('/plans/generate', {
    schema: {
      body: generatePlanSchema
    },
    preHandler: (fastify as any).authenticate
  }, async (request: FastifyRequest<{ Body: z.infer<typeof generatePlanSchema> }>, reply: FastifyReply) => {
    try {
      const { clientProfile } = request.body;
      const userId = (request as any).user.userId;

      // TODO: Implement plan generation logic
      const plan = {
        id: 'mock-plan-id',
        userId,
        clientProfile,
        generatedAt: new Date().toISOString(),
        status: 'completed'
      };

      return { plan };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get user plans
  fastify.get('/plans', {
    preHandler: (fastify as any).authenticate
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId;

      // TODO: Implement plan retrieval logic
      const plans = [
        {
          id: 'mock-plan-id',
          userId,
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      ];

      return { plans };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Save onboarding section
  fastify.post('/onboarding/save-section', {
    schema: {
      body: z.object({
        section: z.string(),
        data: z.any()
      })
    },
    preHandler: (fastify as any).authenticate
  }, async (request: FastifyRequest<{ Body: { section: string; data: any } }>, reply: FastifyReply) => {
    try {
      const { section, data } = request.body;
      const userId = (request as any).user.userId;

      // TODO: Implement onboarding data saving logic
      console.log(`Saving onboarding section ${section} for user ${userId}:`, data);

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
