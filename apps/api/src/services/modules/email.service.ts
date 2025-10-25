/**
 * @fileoverview Email service for generating email marketing content using AI
 */

import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export class EmailService {
  async generateEmailCampaign(
    profile: ClientProfile,
    campaignType: string
  ): Promise<any> {
    const prompt = this.buildEmailPrompt(profile, campaignType);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert email marketer. Generate compelling email campaigns that drive engagement and conversions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Email generation error:', error);
      throw new Error('Failed to generate email campaign');
    }
  }

  private buildEmailPrompt(
    profile: ClientProfile,
    campaignType: string
  ): string {
    const basePrompt = `
Generate an email campaign for ${profile.user_profile.business_name}.

Business Context:
- Business: ${profile.user_profile.business_name}
- Description: ${profile.user_profile.description}
- Brand Voice: ${profile.brand_identity.vibe_tags.join(', ')}
- Target Audience: ${profile.content_social.competitor_analysis}
- Products/Services: ${profile.products_offers.categories.join(', ')}
- Goals: ${profile.goals_growth.top_goals.join(', ')}
`;

    switch (campaignType) {
      case 'welcome':
        return (
          basePrompt +
          `
Create a welcome email series (3 emails) for new subscribers.

Return JSON with:
{
  "campaign": {
    "name": "Welcome Series",
    "type": "welcome",
    "emails": [
      {
        "subject": "Welcome to [Business Name]!",
        "preview_text": "Preview text",
        "content": "Email content in HTML",
        "send_delay": "immediate"
      }
    ]
  }
}`
        );

      case 'promotional':
        return (
          basePrompt +
          `
Create a promotional email campaign to drive sales.

Return JSON with:
{
  "campaign": {
    "name": "Promotional Campaign",
    "type": "promotional",
    "emails": [
      {
        "subject": "Promotional Subject",
        "preview_text": "Preview text",
        "content": "Email content in HTML",
        "send_delay": "immediate"
      }
    ]
  }
}`
        );

      case 'newsletter':
        return (
          basePrompt +
          `
Create a monthly newsletter email.

Return JSON with:
{
  "campaign": {
    "name": "Monthly Newsletter",
    "type": "newsletter",
    "emails": [
      {
        "subject": "Newsletter Subject",
        "preview_text": "Preview text",
        "content": "Newsletter content in HTML",
        "sections": ["industry_news", "business_updates", "tips"]
      }
    ]
  }
}`
        );

      default:
        throw new Error(`Unknown campaign type: ${campaignType}`);
    }
  }
}
