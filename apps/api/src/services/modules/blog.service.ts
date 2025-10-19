import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class BlogService {
  async generateBlogPost(profile: ClientProfile, topic: string): Promise<any> {
    const prompt = `
Generate a blog post for ${profile.user_profile.business_name} about "${topic}".

Business Context:
- Industry: ${profile.brand_identity.vibe_tags.join(', ')}
- Target Audience: ${profile.content_social.competitor_analysis}
- Brand Voice: ${profile.brand_identity.differentiators}
- Goals: ${profile.goals_growth.top_goals.join(', ')}

Return JSON with:
{
  "title": "Blog Post Title",
  "excerpt": "Brief description",
  "content": "Full blog post content in markdown",
  "tags": ["tag1", "tag2"],
  "estimated_read_time": "5 min",
  "seo_keywords": ["keyword1", "keyword2"],
  "call_to_action": "CTA text"
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional content writer. Generate engaging, SEO-optimized blog posts.',
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
      console.error('Blog generation error:', error);
      throw new Error('Failed to generate blog post');
    }
  }

  async generateContentCalendar(
    profile: ClientProfile,
    weeks: number = 4
  ): Promise<any> {
    const topics = this.generateTopicIdeas(profile);

    return {
      calendar: topics.slice(0, weeks * 2).map((topic, index) => ({
        week: Math.floor(index / 2) + 1,
        posts: [
          {
            title: topic,
            type: 'blog',
            status: 'planned',
            due_date: this.getDateForWeek(Math.floor(index / 2) + 1),
          },
        ],
      })),
    };
  }

  private generateTopicIdeas(profile: ClientProfile): string[] {
    const business = profile.user_profile.business_name;
    const industry = profile.brand_identity.vibe_tags[0] || 'business';

    return [
      `How ${business} Approaches ${industry} in 2025`,
      `5 ${industry} Trends Every Business Owner Should Know`,
      `Behind the Scenes: How ${business} Serves Customers`,
      `Common ${industry} Mistakes and How to Avoid Them`,
      `The Future of ${industry}: Predictions for 2025`,
      `Customer Spotlight: Success Stories from ${business}`,
      `${industry} Best Practices: What We've Learned`,
      `Why ${business} Chooses Quality Over Quantity`,
    ];
  }

  private getDateForWeek(week: number): string {
    const date = new Date();
    date.setDate(date.getDate() + week * 7);
    return date.toISOString().split('T')[0];
  }
}
