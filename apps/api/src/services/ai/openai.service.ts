import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey:
    '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',
});

export class OpenAIService {
  async generateMarketingPlan(clientProfile: ClientProfile): Promise<any> {
    const prompt = this.buildPlanPrompt(clientProfile);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You are a senior marketing strategist. Generate comprehensive, actionable marketing plans in valid JSON format.',
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
      throw new Error('Failed to generate marketing plan');
    }
  }

  private buildPlanPrompt(profile: ClientProfile): string {
    return `
Generate a comprehensive marketing plan for this business:

Business: ${profile.user_profile.business_name}
Description: ${profile.user_profile.description}
Industry Focus: ${profile.brand_identity.vibe_tags.join(', ')}
Target Audience: ${profile.content_social.competitor_analysis}
Goals: ${profile.goals_growth.top_goals.join(', ')}
Budget: ${profile.constraints_tools.marketing_budget}
Time Available: ${profile.constraints_tools.weekly_time_commitment}

Return a JSON object with this structure:
{
  "plan": {
    "client_id": "${profile.user_profile.business_name}",
    "window_start": "2025-01-01",
    "window_end": "2025-12-31",
    "weekly_capacity_hours": ${
      parseInt(profile.constraints_tools.weekly_time_commitment) || 10
    }
  },
  "tasks": [
    {
      "id": "task_1",
      "title": "Task Title",
      "description": "Detailed description",
      "estimated_hours": 2,
      "priority": "high|medium|low",
      "due_date": "2025-01-15",
      "status": "planned",
      "category": "setup|content|ads|analytics"
    }
  ],
  "meta": {
    "generated_at": "${new Date().toISOString()}",
    "governance_version": "1.0"
  }
}
`;
  }
}
