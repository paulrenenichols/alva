import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export class OpenAIService {
  async generatePPCPlan(clientProfile: ClientProfile): Promise<any> {
    const basePlan = {
      plan: {
        client_id: clientProfile.user_profile.business_name,
        window_start: '2025-08-01',
        window_end: '2025-12-31',
        weekly_capacity_hours:
          parseInt(clientProfile.constraints_tools.weekly_time_commitment) ||
          10,
      },
      tasks: [],
      meta: {
        generated_at: new Date().toISOString(),
        governance_version: '1.0',
      },
    };

    const prompt = `You are a senior PPC strategist. Generate a comprehensive PPC marketing plan based on the client profile provided.

    Client Profile:
    ${JSON.stringify(clientProfile, null, 2)}

    Base Plan Structure:
    ${JSON.stringify(basePlan, null, 2)}

    Generate a detailed PPC plan with specific tasks, campaigns, and recommendations. Return ONLY valid JSON that exactly matches the base plan's structure.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You are a senior PPC strategist. Return ONLY valid JSON that exactly matches the base plan structure.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
