/**
 * @fileoverview Service for generating social media content using OpenAI
 */

import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export class SocialMediaService {
  async generateSocialContent(
    profile: ClientProfile,
    platform: string,
    contentType: string
  ): Promise<any> {
    const prompt = this.buildSocialPrompt(profile, platform, contentType);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content:
              'You are a social media expert. Generate engaging content optimized for specific platforms.',
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
        throw new Error('No content generated for social media post');
      }
      
      return JSON.parse(content);
    } catch (error) {
      console.error('Social media generation error:', error);
      throw new Error('Failed to generate social media content');
    }
  }

  private buildSocialPrompt(
    profile: ClientProfile,
    platform: string,
    contentType: string
  ): string {
    return `
Generate ${contentType} content for ${platform} for ${
      profile.user_profile.business_name
    }.

Business Context:
- Business: ${profile.user_profile.business_name}
- Description: ${profile.user_profile.description}
- Brand Voice: ${profile.brand_identity.vibe_tags.join(', ')}
- Target Audience: ${profile.content_social.competitor_analysis}
- Products/Services: ${profile.products_offers.categories.join(', ')}

Platform: ${platform}
Content Type: ${contentType}

Return JSON with:
{
  "posts": [
    {
      "content": "Post content",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "media_suggestions": "Image/video suggestions",
      "posting_time": "Best time to post",
      "engagement_tips": "Tips for engagement"
    }
  ]
}
`;
  }

  async generateContentCalendar(
    profile: ClientProfile,
    platform: string,
    weeks: number = 4
  ): Promise<any> {
    const contentTypes = this.getContentTypesForPlatform(platform);
    const calendar = [];

    for (let week = 1; week <= weeks; week++) {
      const weekContent: Array<{
        type: string;
        status: string;
        due_date: string;
      }> = [];

      contentTypes.forEach((type) => {
        weekContent.push({
          type,
          status: 'planned',
          due_date: this.getDateForWeek(week),
        });
      });

      calendar.push({
        week,
        platform,
        content: weekContent,
      });
    }

    return { calendar };
  }

  private getContentTypesForPlatform(platform: string): string[] {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return ['post', 'story', 'reel'];
      case 'facebook':
        return ['post', 'story', 'video'];
      case 'linkedin':
        return ['post', 'article', 'poll'];
      case 'twitter':
        return ['tweet', 'thread', 'poll'];
      default:
        return ['post'];
    }
  }

  private getDateForWeek(week: number): string {
    const date = new Date();
    date.setDate(date.getDate() + week * 7);
    return date.toISOString().split('T')[0];
  }
}
