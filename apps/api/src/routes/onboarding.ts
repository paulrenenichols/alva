import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { profileMapperService } from '../services/profile/profile-mapper.service';

const saveSectionSchema = z.object({
  section: z.string(),
  data: z.record(z.string(), z.any()),
});

const finalizeSchema = z.object({
  profileData: z.record(z.string(), z.any()),
});

export async function onboardingRoutes(fastify: FastifyInstance) {
  // Save onboarding section
  fastify.post(
    '/save-section',
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
      request: FastifyRequest<{ Body: z.infer<typeof saveSectionSchema> }>,
      reply: FastifyReply
    ) => {
      try {
        const { section, data } = request.body;
        const userId = (request as any).user.userId;

        // Store section data temporarily
        // This could be stored in Redis or a temporary table
        console.log(`Saving section ${section} for user ${userId}:`, data);

        return { success: true };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Finalize onboarding and create client profile
  fastify.post(
    '/finalize',
    {
      schema: {
        body: {
          type: 'object',
          required: ['profileData'],
          properties: {
            profileData: { type: 'object' },
          },
        },
      },
      preHandler: (fastify as any).authenticate,
    },
    async (
      request: FastifyRequest<{ Body: z.infer<typeof finalizeSchema> }>,
      reply: FastifyReply
    ) => {
      try {
        const { profileData } = request.body;
        const userId = (request as any).user.userId;

        // Map onboarding responses to client profile
        const clientProfile =
          profileMapperService.mapOnboardingResponses(profileData);

        // TODO: Store in database
        // For now, just return the profile
        console.log(`Finalizing onboarding for user ${userId}:`, clientProfile);

        return {
          success: true,
          profileId: 'temp-profile-id',
          profile: clientProfile,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}
