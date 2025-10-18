import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { profileMapperService } from '../services/profile/profile-mapper.service';
import { clientProfiles } from '@alva/database';
import { eq } from 'drizzle-orm';

const saveSectionSchema = z.object({
  section: z.string(),
  data: z.record(z.any()),
});

const finalizeSchema = z.object({
  profileData: z.record(z.any()),
});

export async function onboardingRoutes(fastify: FastifyInstance) {
  // Save onboarding section
  fastify.post(
    '/save-section',
    {
      schema: {
        body: saveSectionSchema,
      },
      preHandler: fastify.authenticate,
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
        body: finalizeSchema,
      },
      preHandler: fastify.authenticate,
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

        // Store in database
        const [profile] = await fastify.db
          .insert(clientProfiles)
          .values({
            userId,
            profileData: clientProfile,
          })
          .returning();

        return {
          success: true,
          profileId: profile.id,
          profile: clientProfile,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}
