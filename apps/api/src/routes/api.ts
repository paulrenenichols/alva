/**
 * @fileoverview Main API routes for plan generation, retrieval, and onboarding data management
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const GENERATE_PLAN_SCHEMA = z.object({
  clientProfile: z.object({
    businessName: z.string(),
    industry: z.string(),
  }),
});

const SAVE_SECTION_SCHEMA = z.object({
  section: z.string(),
  data: z.record(z.any()),
});

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    userId: string;
  };
}

/**
 * @description Registers main API routes with the Fastify instance
 * @param fastify - Fastify instance to register routes with
 */
export async function apiRoutes(fastify: FastifyInstance) {
  await registerPlanGenerationRoute(fastify);
  await registerPlanRetrievalRoute(fastify);
  await registerOnboardingSaveRoute(fastify);
}

/**
 * @description Registers the marketing plan generation route
 * @param fastify - Fastify instance
 */
async function registerPlanGenerationRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/plans/generate',
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
              },
            },
          },
        },
      },
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof GENERATE_PLAN_SCHEMA> }>,
      reply: FastifyReply
    ) => {
      try {
        const { clientProfile } = request.body;
        const userId = (request as AuthenticatedRequest).user.userId;

        const plan = await generateMarketingPlan(userId, clientProfile);
        return { plan };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the user plans retrieval route
 * @param fastify - Fastify instance
 */
async function registerPlanRetrievalRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/plans',
    {
      preHandler: (fastify as any).authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as AuthenticatedRequest).user.userId;
        const plans = await getUserPlans(userId);
        return { plans };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Registers the onboarding section save route
 * @param fastify - Fastify instance
 */
async function registerOnboardingSaveRoute(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/onboarding/save-section',
    {
      schema: {
        body: {
          type: 'object',
          required: ['section', 'data'],
          properties: {
            section: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof SAVE_SECTION_SCHEMA> }>,
      reply: FastifyReply
    ) => {
      try {
        const { section, data } = request.body;
        const userId = (request as AuthenticatedRequest).user.userId;

        await saveOnboardingSection(userId, section, data);
        return { success: true };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

/**
 * @description Generates a marketing plan for the given client profile
 * @param userId - User ID requesting the plan
 * @param clientProfile - Client business profile data
 * @returns Generated marketing plan object
 */
async function generateMarketingPlan(userId: string, clientProfile: any) {
  // TODO: Implement actual plan generation logic
  return {
    id: 'mock-plan-id',
    userId,
    clientProfile,
    generatedAt: new Date().toISOString(),
    status: 'completed',
  };
}

/**
 * @description Retrieves all plans for a specific user
 * @param userId - User ID to retrieve plans for
 * @returns Array of user plans
 */
async function getUserPlans(userId: string) {
  // TODO: Implement actual plan retrieval logic
  return [
    {
      id: 'mock-plan-id',
      userId,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * @description Saves onboarding section data for a user
 * @param userId - User ID to save data for
 * @param section - Section identifier
 * @param data - Section data to save
 */
async function saveOnboardingSection(userId: string, section: string, data: any): Promise<void> {
  // TODO: Implement actual onboarding data saving logic
  console.log(`Saving onboarding section ${section} for user ${userId}:`, data);
}
