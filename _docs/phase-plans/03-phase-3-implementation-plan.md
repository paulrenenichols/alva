# Phase 3: Core Modules & Production Readiness - Implementation Plan

**@fileoverview** Comprehensive implementation plan for Phase 3 of the Alva project, addressing unimplemented Phase 1/2 work and implementing core modules, advanced features, and production readiness.

---

## Implementation Overview

**Goal**: Complete the production-ready application with core modules, advanced features, and enterprise-grade infrastructure

**Estimated Duration**: 4-6 weeks (160-240 hours)

**Success Criteria**: Fully functional marketing platform with blog, email, social media modules, governance logic, comprehensive testing, and production deployment

**Builds On**: Phase 1 (Setup) and Phase 2 (MVP) - addresses gaps and adds advanced functionality

---

## Phase 1 & 2 Gap Analysis

### ❌ **Unimplemented Phase 1 Work**

1. **Database Implementation**

   - Missing actual database schemas and migrations
   - No Drizzle ORM integration in services
   - Missing database initialization scripts
   - No connection pooling setup

2. **Authentication System**

   - Mock authentication only (no real database operations)
   - No email service integration (Resend/SendGrid)
   - No magic link token storage/validation
   - Missing refresh token database storage
   - No JWT middleware implementation in API service

3. **CI/CD Pipeline**

   - No GitHub Actions workflows
   - Missing deployment automation
   - No automated testing pipeline
   - Missing Docker registry integration

4. **Development Tools**
   - Missing comprehensive testing infrastructure
   - No E2E test implementation
   - Missing development utilities and scripts
   - No proper error handling and logging

### ❌ **Unimplemented Phase 2 Work**

1. **Complete Onboarding System**

   - Only 2 cards implemented (need all 26)
   - Missing specialized input components
   - No progress persistence
   - Missing validation logic

2. **Client Profile Generation**

   - No profile mapping service
   - Missing structured data transformation
   - No database storage of profiles

3. **Plan Generation**

   - Mock plan generation only
   - No OpenAI integration
   - Missing plan storage and retrieval

4. **Email Verification**

   - No actual email sending
   - Missing verification flow completion
   - No token management

5. **Dashboard Implementation**
   - Basic structure only
   - Missing plan display
   - No task management
   - Missing chat interface

---

## Implementation Steps

### Step 1: Complete Phase 1 Foundation (Critical)

**Objective**: Implement missing Phase 1 infrastructure

**Estimated Time**: 20-24 hours

#### 1.1 Database Implementation

```bash
# Create actual database schemas
mkdir -p libs/database/src/schemas/{auth,app}
cat > libs/database/src/schemas/auth/users.ts << 'EOF'
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'auth'
});
EOF

cat > libs/database/src/schemas/auth/refresh-tokens.ts << 'EOF'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, {
  schema: 'auth'
});
EOF

cat > libs/database/src/schemas/auth/verification-tokens.ts << 'EOF'
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, {
  schema: 'auth'
});
EOF

cat > libs/database/src/schemas/app/client-profiles.ts << 'EOF'
import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  profileData: jsonb('profile_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'app'
});
EOF

cat > libs/database/src/schemas/app/marketing-plans.ts << 'EOF'
import { pgTable, uuid, jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from '../auth/users';

export const marketingPlans = pgTable('marketing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planData: jsonb('plan_data').notNull(),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, {
  schema: 'app'
});
EOF
```

#### 1.2 Real Authentication Implementation

```bash
# Update auth service with real database operations
cat > apps/auth/src/services/user.service.ts << 'EOF'
import { eq } from 'drizzle-orm';
import { users, verificationTokens, refreshTokens } from '@alva/database';
import { Database } from '@alva/database';
import { randomBytes } from 'crypto';
import { createHash } from 'crypto';

export class UserService {
  constructor(private db: Database) {}

  async findUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: eq(users.email, email)
    });
  }

  async createUser(email: string) {
    const [user] = await this.db.insert(users).values({
      email,
      emailVerified: false
    }).returning();
    return user;
  }

  async createVerificationToken(userId: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.db.insert(verificationTokens).values({
      token,
      userId,
      expiresAt
    });

    return token;
  }

  async verifyToken(token: string) {
    const verificationToken = await this.db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token)
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return null;
    }

    // Mark user as verified
    await this.db.update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, verificationToken.userId));

    // Delete used token
    await this.db.delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    return verificationToken.userId;
  }

  async createRefreshToken(userId: string, token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.db.insert(refreshTokens).values({
      tokenHash,
      userId,
      expiresAt
    });
  }

  async validateRefreshToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const refreshToken = await this.db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.tokenHash, tokenHash)
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId;
  }
}
EOF
```

#### 1.3 Email Service Implementation

```bash
# Create email service
cat > apps/auth/src/services/email.service.ts << 'EOF'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.WEB_URL}/verify?token=${token}`;

    return await resend.emails.send({
      from: 'Alva <noreply@alva.app>',
      to: [email],
      subject: 'Verify your email - Alva',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Alva!</h1>
          <p>Click the button below to verify your email and access your personalized marketing plan:</p>
          <a href="${verificationUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `
    });
  }
}
EOF
```

**Validation**: Database schemas created, migrations run, authentication works with real database operations.

---

### Step 2: Complete Phase 2 MVP (Critical)

**Objective**: Implement missing Phase 2 features

**Estimated Time**: 32-40 hours

#### 2.1 Complete 26-Card Onboarding System

```bash
# Create comprehensive onboarding cards data
cat > apps/web/data/onboarding-cards.ts << 'EOF'
export interface OnboardingCard {
  id: string;
  question: string;
  description?: string;
  component: 'text-input' | 'textarea' | 'pill-selector' | 'radio-selector' | 'multi-selector' | 'number-input';
  options?: string[];
  maxSelections?: number;
  isRequired?: boolean;
  placeholder?: string;
  validation?: (value: any) => boolean;
}

export interface OnboardingSection {
  id: string;
  title: string;
  cards: OnboardingCard[];
}

export const onboardingSections: OnboardingSection[] = [
  {
    id: 'brand-clarity',
    title: 'Brand Clarity',
    cards: [
      {
        id: 'business-name',
        question: "What's your business name?",
        description: 'The name you use to represent your business',
        component: 'text-input',
        isRequired: true,
        placeholder: 'Enter your business name'
      },
      {
        id: 'business-description',
        question: 'How would you describe your business?',
        description: 'A brief description of what you do',
        component: 'textarea',
        isRequired: true,
        placeholder: 'Describe your business...'
      },
      {
        id: 'brand-vibe',
        question: "What's your brand vibe?",
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Professional', 'Friendly', 'Luxury', 'Playful', 'Minimalist', 'Bold', 'Elegant', 'Modern'],
        isRequired: true
      },
      {
        id: 'dream-customers',
        question: 'Who are your dream customers?',
        description: 'Describe your ideal customer',
        component: 'textarea',
        isRequired: true,
        placeholder: 'Describe your ideal customers...'
      },
      {
        id: 'focus-areas',
        question: 'What are your main business focus areas?',
        description: 'Select up to 3',
        component: 'pill-selector',
        options: ['Sales', 'Brand Awareness', 'Customer Retention', 'Lead Generation', 'Product Launch', 'Event Promotion', 'Community Building', 'Thought Leadership'],
        maxSelections: 3,
        isRequired: true
      },
      {
        id: 'differentiators',
        question: 'What makes you unique?',
        description: 'What sets you apart from competitors?',
        component: 'textarea',
        isRequired: true,
        placeholder: 'What makes you different...'
      }
    ]
  },
  {
    id: 'products-offers',
    title: 'Products & Offers',
    cards: [
      {
        id: 'product-categories',
        question: 'What do you sell?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Physical Products', 'Digital Products', 'Services', 'Consulting', 'Courses', 'Memberships', 'Events', 'Software'],
        isRequired: true
      },
      {
        id: 'special-offers',
        question: 'Do you have any special offers?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Discounts', 'Free Trials', 'Bundles', 'Limited Time Offers', 'Loyalty Programs', 'Referral Bonuses', 'Seasonal Promotions'],
        isRequired: false
      },
      {
        id: 'sales-channels',
        question: 'Where do you sell?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Website', 'E-commerce Store', 'Social Media', 'Marketplaces', 'Physical Store', 'Pop-up Events', 'Direct Sales', 'Affiliates'],
        isRequired: true
      },
      {
        id: 'promotional-strategies',
        question: 'How do you currently promote your business?',
        description: 'Select all that apply',
        component: 'pill-selector',
        options: ['Social Media', 'Email Marketing', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Influencer Partnerships', 'SEO', 'Word of Mouth'],
        isRequired: false
      }
    ]
  },
  // ... Continue with remaining 4 sections (18 more cards)
];

export const totalCards = onboardingSections.reduce((sum, section) => sum + section.cards.length, 0);
EOF
```

#### 2.2 Profile Mapping Service

```bash
# Create comprehensive profile mapper
cat > apps/api/src/services/profile/profile-mapper.service.ts << 'EOF'
import { ClientProfile, ClientProfileSchema } from '@alva/shared-types';

export class ProfileMapperService {
  mapOnboardingResponses(responses: Record<string, any>): ClientProfile {
    const profile: ClientProfile = {
      user_profile: {
        user_name: responses['user-name'] || '',
        business_name: responses['business-name'] || '',
        description: responses['business-description'] || '',
      },
      brand_identity: {
        vibe_tags: responses['brand-vibe'] || [],
        primary_colors: responses['brand-colors'] || [],
        fonts: responses['brand-fonts'] || [],
        differentiators: responses['differentiators'] || '',
      },
      products_offers: {
        categories: responses['product-categories'] || [],
        special_offers: responses['special-offers'] || [],
        sales_channels: responses['sales-channels'] || [],
        promotional_strategies: responses['promotional-strategies'] || [],
      },
      content_social: {
        online_presence: responses['online-presence'] || [],
        content_types: responses['content-types'] || [],
        creation_preferences: responses['creation-preferences'] || [],
        face_voice_presence: responses['face-voice-presence'] || [],
        competitor_analysis: responses['competitor-analysis'] || '',
        inspiration_accounts: responses['inspiration-accounts'] || [],
      },
      goals_growth: {
        top_goals: responses['top-goals'] || [],
        growth_focus: responses['growth-focus'] || [],
        automation_preferences: responses['automation-preferences'] || [],
        past_successes: responses['past-successes'] || '',
        past_failures: responses['past-failures'] || '',
      },
      constraints_tools: {
        weekly_time_commitment: responses['weekly-time-commitment'] || '',
        marketing_budget: responses['marketing-budget'] || '',
        existing_tools: responses['existing-tools'] || [],
        brand_restrictions: responses['brand-restrictions'] || [],
        additional_context: responses['additional-context'] || '',
      },
    };

    return ClientProfileSchema.parse(profile);
  }
}
EOF
```

#### 2.3 OpenAI Integration

```bash
# Create real OpenAI service
cat > apps/api/src/services/ai/openai.service.ts << 'EOF'
import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
            content: 'You are a senior marketing strategist. Generate comprehensive, actionable marketing plans in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
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
    "weekly_capacity_hours": ${parseInt(profile.constraints_tools.weekly_time_commitment) || 10}
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
EOF
```

**Validation**: All 26 onboarding cards work, profile mapping creates valid JSON, OpenAI generates real plans.

---

### Step 3: Core Modules Implementation

**Objective**: Implement blog, email, and social media modules

**Estimated Time**: 48-60 hours

#### 3.1 Blog Module

```bash
# Create blog content generation service
cat > apps/api/src/services/modules/blog.service.ts << 'EOF'
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
            content: 'You are a professional content writer. Generate engaging, SEO-optimized blog posts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Blog generation error:', error);
      throw new Error('Failed to generate blog post');
    }
  }

  async generateContentCalendar(profile: ClientProfile, weeks: number = 4): Promise<any> {
    const topics = this.generateTopicIdeas(profile);

    return {
      calendar: topics.slice(0, weeks * 2).map((topic, index) => ({
        week: Math.floor(index / 2) + 1,
        posts: [
          {
            title: topic,
            type: 'blog',
            status: 'planned',
            due_date: this.getDateForWeek(Math.floor(index / 2) + 1)
          }
        ]
      }))
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
      `Why ${business} Chooses Quality Over Quantity`
    ];
  }

  private getDateForWeek(week: number): string {
    const date = new Date();
    date.setDate(date.getDate() + (week * 7));
    return date.toISOString().split('T')[0];
  }
}
EOF
```

#### 3.2 Email Module

```bash
# Create email campaign service
cat > apps/api/src/services/modules/email.service.ts << 'EOF'
import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class EmailService {
  async generateEmailCampaign(profile: ClientProfile, campaignType: string): Promise<any> {
    const prompt = this.buildEmailPrompt(profile, campaignType);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are an expert email marketer. Generate compelling email campaigns that drive engagement and conversions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Email generation error:', error);
      throw new Error('Failed to generate email campaign');
    }
  }

  private buildEmailPrompt(profile: ClientProfile, campaignType: string): string {
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
        return basePrompt + `
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
}`;

      case 'promotional':
        return basePrompt + `
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
}`;

      case 'newsletter':
        return basePrompt + `
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
}`;

      default:
        throw new Error(`Unknown campaign type: ${campaignType}`);
    }
  }
}
EOF
```

#### 3.3 Social Media Module

```bash
# Create social media content service
cat > apps/api/src/services/modules/social.service.ts << 'EOF'
import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class SocialMediaService {
  async generateSocialContent(profile: ClientProfile, platform: string, contentType: string): Promise<any> {
    const prompt = this.buildSocialPrompt(profile, platform, contentType);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content: 'You are a social media expert. Generate engaging content optimized for specific platforms.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error) {
      console.error('Social media generation error:', error);
      throw new Error('Failed to generate social media content');
    }
  }

  private buildSocialPrompt(profile: ClientProfile, platform: string, contentType: string): string {
    return `
Generate ${contentType} content for ${platform} for ${profile.user_profile.business_name}.

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

  async generateContentCalendar(profile: ClientProfile, platform: string, weeks: number = 4): Promise<any> {
    const contentTypes = this.getContentTypesForPlatform(platform);
    const calendar = [];

    for (let week = 1; week <= weeks; week++) {
      const weekContent = [];

      contentTypes.forEach(type => {
        weekContent.push({
          type,
          status: 'planned',
          due_date: this.getDateForWeek(week)
        });
      });

      calendar.push({
        week,
        platform,
        content: weekContent
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
    date.setDate(date.getDate() + (week * 7));
    return date.toISOString().split('T')[0];
  }
}
EOF
```

**Validation**: All modules generate content, integrate with OpenAI, return structured data.

---

### Step 4: Governance Logic Implementation

**Objective**: Implement plan merging and conflict resolution

**Estimated Time**: 24-32 hours

#### 4.1 Plan Governance Service

```bash
# Create governance logic for plan merging
cat > apps/api/src/services/governance/plan-governance.service.ts << 'EOF'
import { ClientProfile } from '@alva/shared-types';

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  status: 'planned' | 'in-progress' | 'completed';
  category: 'setup' | 'content' | 'ads' | 'analytics' | 'social' | 'email' | 'blog';
  dependencies?: string[];
}

export interface MergedPlan {
  plan: {
    client_id: string;
    window_start: string;
    window_end: string;
    weekly_capacity_hours: number;
  };
  tasks: PlanTask[];
  meta: {
    generated_at: string;
    governance_version: string;
    modules_merged: string[];
    conflicts_resolved: number;
  };
}

export class PlanGovernanceService {
  mergePlans(
    basePlan: any,
    blogPlan: any,
    emailPlan: any,
    socialPlan: any,
    profile: ClientProfile
  ): MergedPlan {
    const mergedTasks: PlanTask[] = [];
    const conflicts: string[] = [];

    // Start with base plan tasks
    if (basePlan.tasks) {
      mergedTasks.push(...basePlan.tasks);
    }

    // Merge blog tasks
    if (blogPlan.tasks) {
      const blogTasks = this.adaptBlogTasks(blogPlan.tasks);
      const conflicts_found = this.mergeTasks(mergedTasks, blogTasks, 'blog');
      conflicts.push(...conflicts_found);
    }

    // Merge email tasks
    if (emailPlan.tasks) {
      const emailTasks = this.adaptEmailTasks(emailPlan.tasks);
      const conflicts_found = this.mergeTasks(mergedTasks, emailTasks, 'email');
      conflicts.push(...conflicts_found);
    }

    // Merge social media tasks
    if (socialPlan.tasks) {
      const socialTasks = this.adaptSocialTasks(socialPlan.tasks);
      const conflicts_found = this.mergeTasks(mergedTasks, socialTasks, 'social');
      conflicts.push(...conflicts_found);
    }

    // Optimize timeline based on capacity
    this.optimizeTimeline(mergedTasks, profile.constraints_tools.weekly_time_commitment);

    // Resolve conflicts
    this.resolveConflicts(mergedTasks, conflicts);

    return {
      plan: {
        client_id: profile.user_profile.business_name,
        window_start: basePlan.plan?.window_start || new Date().toISOString().split('T')[0],
        window_end: basePlan.plan?.window_end || this.getEndDate(),
        weekly_capacity_hours: parseInt(profile.constraints_tools.weekly_time_commitment) || 10
      },
      tasks: mergedTasks,
      meta: {
        generated_at: new Date().toISOString(),
        governance_version: '1.0',
        modules_merged: ['base', 'blog', 'email', 'social'],
        conflicts_resolved: conflicts.length
      }
    };
  }

  private adaptBlogTasks(blogTasks: any[]): PlanTask[] {
    return blogTasks.map(task => ({
      id: `blog_${task.id}`,
      title: task.title || 'Blog Content Creation',
      description: task.description || 'Create blog content',
      estimated_hours: task.estimated_hours || 2,
      priority: task.priority || 'medium',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'blog' as const,
      dependencies: task.dependencies || []
    }));
  }

  private adaptEmailTasks(emailTasks: any[]): PlanTask[] {
    return emailTasks.map(task => ({
      id: `email_${task.id}`,
      title: task.title || 'Email Campaign Setup',
      description: task.description || 'Set up email campaign',
      estimated_hours: task.estimated_hours || 1,
      priority: task.priority || 'medium',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'email' as const,
      dependencies: task.dependencies || []
    }));
  }

  private adaptSocialTasks(socialTasks: any[]): PlanTask[] {
    return socialTasks.map(task => ({
      id: `social_${task.id}`,
      title: task.title || 'Social Media Content',
      description: task.description || 'Create social media content',
      estimated_hours: task.estimated_hours || 1,
      priority: task.priority || 'low',
      due_date: task.due_date || this.getDefaultDueDate(),
      status: 'planned' as const,
      category: 'social' as const,
      dependencies: task.dependencies || []
    }));
  }

  private mergeTasks(existingTasks: PlanTask[], newTasks: PlanTask[], module: string): string[] {
    const conflicts: string[] = [];

    newTasks.forEach(newTask => {
      // Check for conflicts (same title, overlapping dates)
      const conflict = existingTasks.find(existing =>
        existing.title.toLowerCase() === newTask.title.toLowerCase() ||
        this.datesOverlap(existing.due_date, newTask.due_date)
      );

      if (conflict) {
        conflicts.push(`Conflict between ${conflict.title} and ${newTask.title}`);
        // Resolve by adjusting the new task
        newTask.due_date = this.getNextAvailableDate(existingTasks);
        newTask.title = `${newTask.title} (${module})`;
      }

      existingTasks.push(newTask);
    });

    return conflicts;
  }

  private optimizeTimeline(tasks: PlanTask[], weeklyCapacity: string) {
    const capacity = parseInt(weeklyCapacity) || 10;
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    let currentWeek = 1;
    let currentWeekHours = 0;

    sortedTasks.forEach(task => {
      if (currentWeekHours + task.estimated_hours > capacity) {
        currentWeek++;
        currentWeekHours = 0;
      }

      task.due_date = this.getDateForWeek(currentWeek);
      currentWeekHours += task.estimated_hours;
    });
  }

  private resolveConflicts(tasks: PlanTask[], conflicts: string[]) {
    // Log conflicts for monitoring
    console.log('Plan conflicts resolved:', conflicts);

    // Additional conflict resolution logic can be added here
    // For now, we've handled conflicts during the merge process
  }

  private datesOverlap(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffDays = Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 3; // Consider overlapping if within 3 days
  }

  private getNextAvailableDate(tasks: PlanTask[]): string {
    const dates = tasks.map(task => new Date(task.due_date));
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    latestDate.setDate(latestDate.getDate() + 7);
    return latestDate.toISOString().split('T')[0];
  }

  private getDefaultDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  private getDateForWeek(week: number): string {
    const date = new Date();
    date.setDate(date.getDate() + (week * 7));
    return date.toISOString().split('T')[0];
  }

  private getEndDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  }
}
EOF
```

**Validation**: Plan merging works, conflicts resolved, timeline optimized based on capacity.

---

### Step 5: Advanced Dashboard Features

**Objective**: Implement comprehensive dashboard with all modules

**Estimated Time**: 32-40 hours

#### 5.1 Enhanced Dashboard Layout

```bash
# Create comprehensive dashboard with all modules
cat > apps/web/app/dashboard/plan/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { apiClient } from '@alva/api-client';

interface Task {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  status: 'planned' | 'in-progress' | 'completed';
  category: 'setup' | 'content' | 'ads' | 'analytics' | 'social' | 'email' | 'blog';
}

export default function MarketingPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans = await apiClient.getUserPlans();
        if (plans.length > 0) {
          setPlan(plans[0]);
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading your marketing plan...</p>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No marketing plan found. Please complete the onboarding to generate one.
        <Button onClick={() => (window.location.href = '/onboarding/welcome')} className="mt-4 bg-primary-500 text-white">
          Start Onboarding
        </Button>
      </Card>
    );
  }

  const tasksByCategory = (plan.tasks || []).reduce((acc: Record<string, Task[]>, task: Task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blog': return '📝';
      case 'email': return '📧';
      case 'social': return '📱';
      case 'ads': return '🎯';
      case 'analytics': return '📊';
      case 'setup': return '⚙️';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray- Merchant">Your Marketing Plan</h1>
        <p className="text-gray-600">A comprehensive strategy across all marketing channels</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks:</span>
                  <span className="font-medium">{plan.tasks?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Hours:</span>
                  <span className="font-medium">
                    {plan.tasks?.reduce((sum: number, task: Task) => sum + task.estimated_hours, 0) || 0}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Capacity:</span>
                  <span className="font-medium">{plan.plan?.weekly_capacity_hours || 10}h</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'completed').length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress:</span>
                  <span className="font-medium text-blue-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'in-progress').length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned:</span>
                  <span className="font-medium text-gray-600">
                    {plan.tasks?.filter((t: Task) => t.status === 'planned').length || 0}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modules Active</h3>
              <div className="space-y-2">
                {plan.meta?.modules_merged?.map((module: string) => (
                  <div key={module} className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    <span className="text-sm capitalize">{module}</span>
                  </div>
                )) || <span className="text-gray-500">No modules active</span>}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(tasksByCategory).map(([category, tasks]) => (
              <Card key={category} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{task.estimated_hours}h</span>
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Timeline</h3>
            <div className="space-y-4">
              {plan.tasks?.sort((a: Task, b: Task) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map((task: Task) => (
                <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{task.estimated_hours}h</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Module</h3>
              <p className="text-gray-600 mb-4">Generate blog content and manage your content calendar</p>
              <Button className="bg-primary-500 text-white">Generate Blog Post</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Module</h3>
              <p className="text-gray-600 mb-4">Create email campaigns and automate your email marketing</p>
              <Button className="bg-primary-500 text-white">Create Email Campaign</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Module</h3>
              <p className="text-gray-600 mb-4">Generate social media content for all platforms</p>
              <Button className="bg-primary-500 text-white">Generate Social Content</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Module</h3>
              <p className="text-gray-600 mb-4">Track performance and optimize your marketing efforts</p>
              <Button className="bg-primary-500 text-white">View Analytics</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
EOF
```

**Validation**: Dashboard displays comprehensive plan data, modules accessible, timeline view works.

---

### Step 6: Testing Infrastructure

**Objective**: Implement comprehensive testing suite

**Estimated Time**: 24-32 hours

#### 6.1 E2E Testing with Playwright

```bash
# Create comprehensive E2E tests
cat > apps/web-e2e/src/mvp-flow.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Complete MVP Flow', () => {
  test('complete onboarding to dashboard flow', async ({ page }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Your AI Marketing Assistant');

    // 2. Email capture
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // 3. Welcome screen
    await expect(page.locator('h1')).toContainText('Welcome to Alva!');
    await page.click('text=Let\'s Go');

    // 4. Onboarding cards (test first few)
    await expect(page.locator('h1')).toContainText('What\'s your business name?');
    await page.fill('input[placeholder="Enter your business name"]', 'Test Business');
    await page.click('text=Next');

    await expect(page.locator('h1')).toContainText('How would you describe your business?');
    await page.fill('textarea', 'A test business description');
    await page.click('text=Next');

    // 5. Processing screen
    await expect(page.locator('h1')).toContainText('Crunching your answers...');

    // 6. Summary preview
    await expect(page.locator('h1')).toContainText('Your Marketing Plan is Ready!');
  });

  test('dashboard loads correctly', async ({ page }) => {
    // Mock authentication and navigate to dashboard
    await page.goto('/dashboard');

    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Daily Quick Wins')).toBeVisible();
    await expect(page.locator('text=Plan Overview')).toBeVisible();
  });

  test('marketing plan page displays correctly', async ({ page }) => {
    await page.goto('/dashboard/plan');

    // Check plan page elements
    await expect(page.locator('h1')).toContainText('Your Marketing Plan');
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    await expect(page.locator('text=Modules')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('email verification works', async ({ page }) => {
    // Mock verification token
    await page.goto('/verify?token=mock-token');

    // Should show verification success
    await expect(page.locator('h1')).toContainText('Email verified successfully!');
  });

  test('invalid verification token shows error', async ({ page }) => {
    await page.goto('/verify?token=invalid-token');

    // Should show error
    await expect(page.locator('h1')).toContainText('Verification failed');
  });
});
EOF
```

#### 6.2 Unit Testing

```bash
# Create unit tests for critical components
cat > apps/web/__tests__/components/OnboardingCard.test.tsx << 'EOF'
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { useOnboardingStore } from '@/stores/onboardingStore';

// Mock the store
jest.mock('@/stores/onboardingStore');

const mockUseOnboardingStore = useOnboardingStore as jest.MockedFunction<typeof useOnboardingStore>;

describe('OnboardingCard Component', () => {
  beforeEach(() => {
    mockUseOnboardingStore.mockReturnValue({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      updateResponse: jest.fn(),
      nextCard: jest.fn(),
      prevCard: jest.fn(),
      getProgress: jest.fn().mockReturnValue({ current: 1, total: 26, percentage: 4 }),
    });
  });

  it('renders card with question and description', () => {
    render(
      <OnboardingCard
        cardId="test-card"
        sectionTitle="Test Section"
        question="Test Question"
        description="Test Description"
      >
        <div>Test Content</div>
      </OnboardingCard>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls nextCard when Next button is clicked', () => {
    const mockNextCard = jest.fn();
    mockUseOnboardingStore.mockReturnValue({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      updateResponse: jest.fn(),
      nextCard: mockNextCard,
      prevCard: jest.fn(),
      getProgress: jest.fn().mockReturnValue({ current: 1, total: 26, percentage: 4 }),
    });

    render(
      <OnboardingCard
        cardId="test-card"
        sectionTitle="Test Section"
        question="Test Question"
      >
        <div>Test Content</div>
      </OnboardingCard>
    );

    fireEvent.click(screen.getByText('Next'));
    expect(mockNextCard).toHaveBeenCalled();
  });
});
EOF
```

#### 6.3 Integration Testing

```bash
# Create integration tests for API services
cat > apps/api/__tests__/services/profile-mapper.service.test.ts << 'EOF'
import { ProfileMapperService } from '../services/profile/profile-mapper.service';
import { ClientProfile } from '@alva/shared-types';

describe('ProfileMapperService', () => {
  let service: ProfileMapperService;

  beforeEach(() => {
    service = new ProfileMapperService();
  });

  it('maps onboarding responses to client profile', () => {
    const responses = {
      'business-name': 'Test Business',
      'business-description': 'A test business',
      'brand-vibe': ['Professional', 'Modern'],
      'top-goals': ['Increase Sales', 'Brand Awareness'],
      'weekly-time-commitment': '10',
      'marketing-budget': '1000'
    };

    const profile = service.mapOnboardingResponses(responses);

    expect(profile.user_profile.business_name).toBe('Test Business');
    expect(profile.user_profile.description).toBe('A test business');
    expect(profile.brand_identity.vibe_tags).toEqual(['Professional', 'Modern']);
    expect(profile.goals_growth.top_goals).toEqual(['Increase Sales', 'Brand Awareness']);
    expect(profile.constraints_tools.weekly_time_commitment).toBe('10');
    expect(profile.constraints_tools.marketing_budget).toBe('1000');
  });

  it('handles missing responses gracefully', () => {
    const responses = {};

    const profile = service.mapOnboardingResponses(responses);

    expect(profile.user_profile.business_name).toBe('');
    expect(profile.brand_identity.vibe_tags).toEqual([]);
    expect(profile.goals_growth.top_goals).toEqual([]);
  });
});
EOF
```

**Validation**: All tests pass, E2E tests cover complete user journey, unit tests cover critical components.

---

### Step 7: CI/CD Pipeline Implementation

**Objective**: Implement production-ready CI/CD pipeline

**Estimated Time**: 16-20 hours

#### 7.1 GitHub Actions Workflows

```bash
# Create comprehensive CI/CD pipeline
cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm nx run-many --target=typecheck --all

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test

      - name: Run E2E tests
        run: pnpm test:e2e

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build all projects
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist/
            apps/*/dist/

  docker-build:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Web image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/web/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/web:latest
            ghcr.io/${{ github.repository }}/web:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push API image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/api/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/api:latest
            ghcr.io/${{ github.repository }}/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Auth image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/auth/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/auth:latest
            ghcr.io/${{ github.repository }}/auth:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    runs-on: ubuntu-latest
    needs: [docker-build]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
EOF
```

#### 7.2 Environment Configuration

```bash
# Create production environment configuration
cat > .env.production.example << 'EOF'
# Production Environment Variables

# Database
DATABASE_URL=postgresql://username:password@host:5432/alva_prod
REDIS_URL=redis://host:6379

# JWT Keys (generate with pnpm generate:keys)
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Service
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@alva.app

# AI/LLM
OPENAI_API_KEY=sk-...

# Security
COOKIE_SECRET=your-super-secret-cookie-key

# URLs
WEB_URL=https://alva.app
API_URL=https://api.alva.app
AUTH_URL=https://auth.alva.app

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
EOF
```

**Validation**: CI/CD pipeline runs successfully, Docker images build, deployment ready.

---

### Step 8: Monitoring and Observability

**Objective**: Implement production monitoring and logging

**Estimated Time**: 12-16 hours

#### 8.1 Logging Implementation

```bash
# Create structured logging service
cat > libs/utils/src/logger.ts << 'EOF'
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'alva' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export const createServiceLogger = (serviceName: string) => {
  return logger.child({ service: serviceName });
};
EOF
```

#### 8.2 Health Check Implementation

```bash
# Create comprehensive health check service
cat > apps/api/src/services/health.service.ts << 'EOF'
import { Database } from '@alva/database';
import { createServiceLogger } from '@alva/utils';

const logger = createServiceLogger('health');

export class HealthService {
  constructor(private db: Database) {}

  async checkDatabase(): Promise<{ status: string; latency?: number }> {
    try {
      const start = Date.now();
      await this.db.execute('SELECT 1');
      const latency = Date.now() - start;

      return { status: 'healthy', latency };
    } catch (error) {
      logger.error('Database health check failed', { error });
      return { status: 'unhealthy' };
    }
  }

  async checkRedis(): Promise<{ status: string; latency?: number }> {
    try {
      const start = Date.now();
      // Add Redis health check logic here
      const latency = Date.now() - start;

      return { status: 'healthy', latency };
    } catch (error) {
      logger.error('Redis health check failed', { error });
      return { status: 'unhealthy' };
    }
  }

  async getOverallHealth(): Promise<{
    status: string;
    timestamp: string;
    services: Record<string, any>;
  }> {
    const [dbHealth, redisHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis()
    ]);

    const allHealthy = [dbHealth, redisHealth].every(service => service.status === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        redis: redisHealth
      }
    };
  }
}
EOF
```

**Validation**: Logging works across all services, health checks return accurate status, monitoring data available.

---

## Final Validation & Deployment

### Step 9: Production Deployment

**Objective**: Deploy to production environment

**Estimated Time**: 8-12 hours

#### 9.1 Production Configuration

```bash
# Create production Docker Compose
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/var/lib/redis/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  web:
    image: ghcr.io/${GITHUB_REPOSITORY}/web:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
      - NEXT_PUBLIC_AUTH_URL=${AUTH_URL}
    depends_on:
      - api
      - auth
    restart: unless-stopped

  api:
    image: ghcr.io/${GITHUB_REPOSITORY}/api:latest
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  auth:
    image: ghcr.io/${GITHUB_REPOSITORY}/auth:latest
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
EOF
```

#### 9.2 Deployment Scripts

```bash
# Create deployment script
cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Deploying Alva to production..."

# Check environment variables
required_vars=("DATABASE_URL" "JWT_PRIVATE_KEY" "JWT_PUBLIC_KEY" "OPENAI_API_KEY" "RESEND_API_KEY")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done

# Run database migrations
echo "📊 Running database migrations..."
pnpm db:migrate

# Start services
echo "🐳 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check health
echo "🏥 Checking service health..."
curl -f http://localhost:3000/api/health || exit 1
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3002/health || exit 1

echo "✅ Deployment successful!"
echo "🌐 Web: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo "🔐 Auth: http://localhost:3002"
EOF

chmod +x scripts/deploy.sh
```

**Validation**: Production deployment successful, all services healthy, monitoring working.

---

## Success Criteria Validation

### ✅ **Phase 1 & 2 Gaps Addressed**

- [ ] Database schemas and migrations implemented
- [ ] Real authentication with email verification
- [ ] Complete 26-card onboarding system
- [ ] Profile mapping and plan generation
- [ ] Comprehensive testing infrastructure
- [ ] CI/CD pipeline functional

### ✅ **Phase 3 Core Features**

- [ ] Blog module with content generation
- [ ] Email module with campaign creation
- [ ] Social media module with content planning
- [ ] Governance logic for plan merging
- [ ] Advanced dashboard with all modules
- [ ] Production-ready deployment

### ✅ **Production Readiness**

- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] CI/CD pipeline with automated deployment
- [ ] Monitoring and logging infrastructure
- [ ] Health checks and observability
- [ ] Security best practices implemented
- [ ] Performance optimization completed

---

## Next Steps

After Phase 3 completion, the application will be production-ready with:

- Complete marketing platform functionality
- All core modules (blog, email, social media)
- Enterprise-grade infrastructure
- Comprehensive testing and monitoring
- Automated deployment pipeline

The application will be ready for:

- Production deployment
- User onboarding
- Performance monitoring
- Feature enhancements based on user feedback

---

**Total Estimated Time**: 160-240 hours (4-6 weeks)  
**Key Deliverables**: Production-ready marketing platform with all core modules  
**Dependencies**: Phase 1 (Setup) and Phase 2 (MVP) foundation  
**Risk Level**: Medium (complex integration and production deployment)
