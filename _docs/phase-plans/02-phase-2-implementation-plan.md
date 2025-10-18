# Phase 2: MVP Implementation Plan

**@fileoverview** Detailed step-by-step implementation plan for Phase 2 of the Alva project, building the complete MVP with onboarding flow, plan generation, and dashboard interface based on the web mockups.

---

## Implementation Overview

**Goal**: Deliver a complete, usable MVP that provides end-to-end value from landing page to personalized marketing plan delivery.

**Estimated Duration**: 3-4 weeks (120-160 hours)

**Success Criteria**: Users can complete the full journey from email capture through onboarding to receiving a personalized marketing plan and accessing their dashboard.

**Visual Reference**: Based on desktop mockups in `_docs/mockups/web/`:

- Marketing Plan dashboard interface
- Daily Quick Wins task management
- Settings page layout
- To Do list interface
- General UI component patterns

---

## Implementation Steps

### Step 1: Landing Page & Email Capture

**Objective**: Create a conversion-optimized landing page with email capture

**Estimated Time**: 12-16 hours

#### 1.1 Landing Page Design Implementation

```bash
# Create landing page component
mkdir -p apps/web/app/(marketing)
cat > apps/web/app/(marketing)/page.tsx << 'EOF'
import { EmailCaptureForm } from '@/components/forms/EmailCaptureForm';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Your AI Marketing Assistant
          </h1>
          <p className="text-xl text-secondary-600 mb-12">
            Get a personalized marketing plan in minutes, not months
          </p>
          <EmailCaptureForm />
        </div>
      </div>
    </div>
  );
}
EOF
```

#### 1.2 Email Capture Form Component

```bash
# Create email capture form
mkdir -p apps/web/components/forms
cat > apps/web/components/forms/EmailCaptureForm.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authClient } from '@alva/auth-client';

export function EmailCaptureForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authClient.register(email);
      // Redirect to onboarding welcome
      window.location.href = '/onboarding/welcome';
    } catch (err) {
      setError('Please enter a valid email address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={isLoading} className="bg-primary-500">
          {isLoading ? 'Sending...' : 'Get Started'}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </form>
  );
}
EOF
```

#### 1.3 Auth Client Implementation

```bash
# Create auth client
cat > libs/auth-client/src/lib/auth-client.ts << 'EOF'
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002';

export class AuthClient {
  async register(email: string) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  }

  async verifyMagicLink(token: string) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/verify-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Verification failed');
    }

    return response.json();
  }
}

export const authClient = new AuthClient();
EOF
```

**Validation**: Landing page loads, email capture works, redirects to onboarding welcome.

---

### Step 2: Onboarding Welcome & Progress System

**Objective**: Create welcome screen and progress tracking system

**Estimated Time**: 8-12 hours

#### 2.1 Welcome Screen Component

```bash
# Create onboarding welcome page
mkdir -p apps/web/app/onboarding
cat > apps/web/app/onboarding/welcome/page.tsx << 'EOF'
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OnboardingWelcome() {
  const { startOnboarding } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Welcome to Alva!
        </h1>
        <p className="text-secondary-600 mb-6">
          Let's create your personalized marketing plan in just 5 minutes
        </p>
        <div className="bg-primary-100 rounded-lg p-4 mb-6">
          <p className="text-primary-800 font-medium">26 cards • 5 minutes</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={startOnboarding}
            className="w-full bg-primary-500 text-white"
          >
            Let's Go
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
EOF
```

#### 2.2 Onboarding State Management

```bash
# Create onboarding store
mkdir -p apps/web/stores
cat > apps/web/stores/onboardingStore.ts << 'EOF'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentSection: number;
  currentCard: number;
  responses: Record<string, any>;
  isCompleted: boolean;
  startOnboarding: () => void;
  updateResponse: (cardId: string, response: any) => void;
  nextCard: () => void;
  prevCard: () => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentSection: 1,
      currentCard: 1,
      responses: {},
      isCompleted: false,

      startOnboarding: () => {
        set({ currentSection: 1, currentCard: 1 });
      },

      updateResponse: (cardId, response) => {
        set((state) => ({
          responses: { ...state.responses, [cardId]: response }
        }));
      },

      nextCard: () => {
        const { currentSection, currentCard } = get();
        const sectionCardCounts = [6, 4, 6, 5, 5]; // Cards per section

        if (currentCard < sectionCardCounts[currentSection - 1]) {
          set({ currentCard: currentCard + 1 });
        } else if (currentSection < 5) {
          set({ currentSection: currentSection + 1, currentCard: 1 });
        } else {
          get().completeOnboarding();
        }
      },

      prevCard: () => {
        const { currentSection, currentCard } = get();

        if (currentCard > 1) {
          set({ currentCard: currentCard - 1 });
        } else if (currentSection > 1) {
          const sectionCardCounts = [6, 4, 6, 5, 5];
          set({
            currentSection: currentSection - 1,
            currentCard: sectionCardCounts[currentSection - 2]
          });
        }
      },

      completeOnboarding: () => {
        set({ isCompleted: true });
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
EOF
```

**Validation**: Welcome screen displays, progress state initializes, navigation works.

---

### Step 3: Onboarding Card System (26 Cards)

**Objective**: Build the complete 26-card onboarding system

**Estimated Time**: 40-50 hours

#### 3.1 Onboarding Card Framework

```bash
# Create onboarding card component
mkdir -p apps/web/components/onboarding
cat > apps/web/components/onboarding/OnboardingCard.tsx << 'EOF'
'use client';

import { useOnboardingStore } from '@/stores/onboardingStore';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface OnboardingCardProps {
  cardId: string;
  sectionTitle: string;
  question: string;
  description?: string;
  children: React.ReactNode;
  isRequired?: boolean;
  validation?: (value: any) => boolean;
}

export function OnboardingCard({
  cardId,
  sectionTitle,
  question,
  description,
  children,
  isRequired = false,
  validation
}: OnboardingCardProps) {
  const {
    currentSection,
    currentCard,
    responses,
    updateResponse,
    nextCard,
    prevCard
  } = useOnboardingStore();

  const currentResponse = responses[cardId];
  const sectionCardCounts = [6, 4, 6, 5, 5];
  const totalCards = sectionCardCounts.reduce((sum, count) => sum + count, 0);
  const currentCardNumber = sectionCardCounts
    .slice(0, currentSection - 1)
    .reduce((sum, count) => sum + count, 0) + currentCard;

  const progress = (currentCardNumber / totalCards) * 100;

  const handleNext = () => {
    if (validation && !validation(currentResponse)) {
      return;
    }
    nextCard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <ProgressBar value={progress} className="mb-8" />

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-primary-600 mb-2">
              {sectionTitle}
            </h2>
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              {question}
            </h1>
            {description && (
              <p className="text-secondary-600">{description}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            {children}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentSection === 1 && currentCard === 1}
            >
              Back
            </Button>

            <div className="flex gap-3">
              {!isRequired && (
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={isRequired && (!currentResponse || !validation?.(currentResponse))}
                className="bg-primary-500 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF
```

#### 3.2 Input Components for Cards

```bash
# Create specialized input components
cat > apps/web/components/onboarding/inputs/PillSelector.tsx << 'EOF'
'use client';

interface PillSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  maxSelections?: number;
}

export function PillSelector({
  options,
  selected,
  onChange,
  multiSelect = true,
  maxSelections
}: PillSelectorProps) {
  const handleToggle = (option: string) => {
    if (multiSelect) {
      const newSelected = selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option];

      if (!maxSelections || newSelected.length <= maxSelections) {
        onChange(newSelected);
      }
    } else {
      onChange([option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected.includes(option)
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
EOF
```

#### 3.3 Section 1: Brand Clarity Cards (6 cards)

```bash
# Create brand clarity section
mkdir -p apps/web/app/onboarding/brand-clarity
cat > apps/web/app/onboarding/brand-clarity/[card]/page.tsx << 'EOF'
'use client';

import { useParams } from 'next/navigation';
import { OnboardingCard } from '@/components/onboarding/OnboardingCard';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PillSelector } from '@/components/onboarding/inputs/PillSelector';
import { useOnboardingStore } from '@/stores/onboardingStore';

const brandClarityCards = [
  {
    id: 'business-name',
    question: "What's your business name?",
    description: "The name you use to represent your business",
    component: 'text-input'
  },
  {
    id: 'business-description',
    question: "How would you describe your business?",
    description: "A brief description of what you do",
    component: 'textarea'
  },
  {
    id: 'brand-vibe',
    question: "What's your brand vibe?",
    description: "Select all that apply",
    component: 'pill-selector',
    options: ['Professional', 'Friendly', 'Luxury', 'Playful', 'Minimalist', 'Bold', 'Elegant', 'Modern']
  },
  {
    id: 'dream-customers',
    question: "Who are your dream customers?",
    description: "Describe your ideal customer",
    component: 'textarea'
  },
  {
    id: 'focus-areas',
    question: "What are your main business focus areas?",
    description: "Select up to 3",
    component: 'pill-selector',
    options: ['Sales', 'Brand Awareness', 'Customer Retention', 'Lead Generation', 'Product Launch', 'Event Promotion', 'Community Building', 'Thought Leadership'],
    maxSelections: 3
  },
  {
    id: 'differentiators',
    question: "What makes you unique?",
    description: "What sets you apart from competitors?",
    component: 'textarea'
  }
];

export default function BrandClarityCard() {
  const params = useParams();
  const cardNumber = parseInt(params.card as string);
  const card = brandClarityCards[cardNumber - 1];

  const { responses, updateResponse } = useOnboardingStore();
  const currentResponse = responses[card.id];

  const handleResponseChange = (value: any) => {
    updateResponse(card.id, value);
  };

  const renderInput = () => {
    switch (card.component) {
      case 'text-input':
        return (
          <Input
            value={currentResponse || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Enter your business name"
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentResponse || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Describe your business..."
            rows={4}
            className="w-full"
          />
        );

      case 'pill-selector':
        return (
          <PillSelector
            options={card.options}
            selected={currentResponse || []}
            onChange={handleResponseChange}
            maxSelections={card.maxSelections}
          />
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingCard
      cardId={card.id}
      sectionTitle="Brand Clarity"
      question={card.question}
      description={card.description}
      isRequired={true}
      validation={(value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value && value.trim().length > 0;
      }}
    >
      {renderInput()}
    </OnboardingCard>
  );
}
EOF
```

#### 3.4 Auto-save to API Server

```bash
# Create API client for onboarding
cat > libs/api-client/src/lib/api-client.ts << 'EOF'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async saveOnboardingSection(section: string, data: any) {
    return this.request('/onboarding/save-section', {
      method: 'POST',
      body: JSON.stringify({ section, data }),
    });
  }

  async finalizeOnboarding(profileData: any) {
    return this.request('/onboarding/finalize', {
      method: 'POST',
      body: JSON.stringify({ profileData }),
    });
  }

  async generatePlan(clientProfile: any) {
    return this.request('/plans/generate', {
      method: 'POST',
      body: JSON.stringify({ clientProfile }),
    });
  }

  async getPlanStatus(planId: string) {
    return this.request(`/plans/${planId}/status`);
  }

  async getPlan(planId: string) {
    return this.request(`/plans/${planId}`);
  }
}

export const apiClient = new ApiClient();
EOF
```

**Validation**: All 26 cards render correctly, input types work, progress tracking accurate, auto-save functions.

---

### Step 4: Client Profile Generation & API Integration

**Objective**: Transform onboarding responses into structured client profile

**Estimated Time**: 16-20 hours

#### 4.1 Client Profile Schema

```bash
# Create client profile schema
cat > libs/shared-types/src/lib/client-profile.ts << 'EOF'
import { z } from 'zod';

export const ClientProfileSchema = z.object({
  user_profile: z.object({
    user_name: z.string(),
    business_name: z.string(),
    description: z.string(),
  }),
  brand_identity: z.object({
    vibe_tags: z.array(z.string()),
    primary_colors: z.array(z.string()),
    fonts: z.array(z.string()),
    differentiators: z.string(),
  }),
  products_offers: z.object({
    categories: z.array(z.string()),
    special_offers: z.array(z.string()),
    sales_channels: z.array(z.string()),
    promotional_strategies: z.array(z.string()),
  }),
  content_social: z.object({
    online_presence: z.array(z.string()),
    content_types: z.array(z.string()),
    creation_preferences: z.array(z.string()),
    face_voice_presence: z.array(z.string()),
    competitor_analysis: z.string(),
    inspiration_accounts: z.array(z.string()),
  }),
  goals_growth: z.object({
    top_goals: z.array(z.string()),
    growth_focus: z.array(z.string()),
    automation_preferences: z.array(z.string()),
    past_successes: z.string(),
    past_failures: z.string(),
  }),
  constraints_tools: z.object({
    weekly_time_commitment: z.string(),
    marketing_budget: z.string(),
    existing_tools: z.array(z.string()),
    brand_restrictions: z.array(z.string()),
    additional_context: z.string(),
  }),
});

export type ClientProfile = z.infer<typeof ClientProfileSchema>;
EOF
```

#### 4.2 Profile Mapper Service

```bash
# Create profile mapper in API service
mkdir -p apps/api/src/services/profile
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

    // Validate the profile
    return ClientProfileSchema.parse(profile);
  }
}

export const profileMapperService = new ProfileMapperService();
EOF
```

#### 4.3 API Routes for Onboarding

```bash
# Update API routes
cat > apps/api/src/routes/onboarding.ts << 'EOF'
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
  fastify.post('/save-section', {
    schema: {
      body: saveSectionSchema
    },
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Body: z.infer<typeof saveSectionSchema> }>, reply: FastifyReply) => {
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
  });

  // Finalize onboarding and create client profile
  fastify.post('/finalize', {
    schema: {
      body: finalizeSchema
    },
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Body: z.infer<typeof finalizeSchema> }>, reply: FastifyReply) => {
    try {
      const { profileData } = request.body;
      const userId = (request as any).user.userId;

      // Map onboarding responses to client profile
      const clientProfile = profileMapperService.mapOnboardingResponses(profileData);

      // Store in database
      const [profile] = await fastify.db.insert(clientProfiles).values({
        userId,
        profileData: clientProfile,
      }).returning();

      return {
        success: true,
        profileId: profile.id,
        profile: clientProfile
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
EOF
```

**Validation**: Profile schema validates, mapping covers all fields, database stores correctly.

---

### Step 5: Marketing Plan Generation (PPC Module)

**Objective**: Generate marketing plans using LLM in API server

**Estimated Time**: 20-24 hours

#### 5.1 OpenAI Integration

```bash
# Create OpenAI client in API service
mkdir -p apps/api/src/lib
cat > apps/api/src/lib/openai.client.ts << 'EOF'
import OpenAI from 'openai';
import { ClientProfile } from '@alva/shared-types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  async generatePPCPlan(clientProfile: ClientProfile): Promise<any> {
    const basePlan = {
      plan: {
        client_id: clientProfile.user_profile.business_name,
        window_start: "2025-08-01",
        window_end: "2025-12-31",
        weekly_capacity_hours: parseInt(clientProfile.constraints_tools.weekly_time_commitment) || 10,
      },
      tasks: [],
      meta: {
        generated_at: new Date().toISOString(),
        governance_version: "1.0",
      }
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
            content: 'You are a senior PPC strategist. Return ONLY valid JSON that exactly matches the base plan structure.'
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
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();
EOF
```

#### 5.2 Plan Generation Routes

```bash
# Create plan generation routes
cat > apps/api/src/routes/plans.ts << 'EOF'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { openaiService } from '../lib/openai.client';
import { ClientProfileSchema } from '@alva/shared-types';

const generatePlanSchema = z.object({
  clientProfile: ClientProfileSchema,
});

export async function planRoutes(fastify: FastifyInstance) {
  // Generate marketing plan
  fastify.post('/generate', {
    schema: {
      body: generatePlanSchema
    },
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Body: z.infer<typeof generatePlanSchema> }>, reply: FastifyReply) => {
    try {
      const { clientProfile } = request.body;
      const userId = (request as any).user.userId;

      // Generate plan using OpenAI
      const plan = await openaiService.generatePPCPlan(clientProfile);

      // Store plan in database (simplified for MVP)
      const planId = `plan_${userId}_${Date.now()}`;

      // TODO: Store in database table
      console.log(`Generated plan ${planId} for user ${userId}`);

      return {
        planId,
        plan,
        status: 'completed'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to generate plan' });
    }
  });

  // Get plan status
  fastify.get('/:id/status', {
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // TODO: Check actual status from database
      return {
        planId: id,
        status: 'completed'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to get plan status' });
    }
  });

  // Get plan
  fastify.get('/:id', {
    preHandler: fastify.authenticate
  }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      // TODO: Retrieve from database
      return {
        planId: id,
        plan: {
          // Mock plan data
          plan: {
            client_id: "Sample Business",
            window_start: "2025-08-01",
            window_end: "2025-12-31",
            weekly_capacity_hours: 10,
          },
          tasks: [
            {
              id: "task_1",
              title: "Set up Google Ads account",
              description: "Create and configure Google Ads account with proper tracking",
              estimated_hours: 2,
              priority: "high",
              due_date: "2025-08-15",
              status: "planned"
            }
          ],
          meta: {
            generated_at: new Date().toISOString(),
            governance_version: "1.0",
          }
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to get plan' });
    }
  });
}
EOF
```

**Validation**: Plan generates successfully, JSON validates, API routes work.

---

### Step 6: Processing & Summary Preview

**Objective**: Create processing screen and summary preview

**Estimated Time**: 12-16 hours

#### 6.1 Processing Screen

```bash
# Create processing screen
cat > apps/web/app/onboarding/processing/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { apiClient } from '@alva/api-client';

export default function ProcessingScreen() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Analyzing your responses...');
  const { responses, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    const processOnboarding = async () => {
      try {
        // Step 1: Finalize client profile
        setProgress(25);
        setStatus('Creating your profile...');

        const profileResult = await apiClient.finalizeOnboarding(responses);

        // Step 2: Generate marketing plan
        setProgress(50);
        setStatus('Generating your marketing plan...');

        const planResult = await apiClient.generatePlan(profileResult.profile);

        // Step 3: Processing complete
        setProgress(100);
        setStatus('Complete!');

        // Redirect to summary
        setTimeout(() => {
          completeOnboarding();
          window.location.href = '/onboarding/summary';
        }, 2000);

      } catch (error) {
        console.error('Processing error:', error);
        setStatus('Something went wrong. Please try again.');
      }
    };

    processOnboarding();
  }, [responses, completeOnboarding]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Crunching your answers...
          </h1>
          <p className="text-secondary-600 mb-6">{status}</p>
        </div>

        <div className="bg-white rounded-lg p-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-secondary-500">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
}
EOF
```

#### 6.2 Summary Preview Component

```bash
# Create summary preview
cat > apps/web/app/onboarding/summary/page.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SummaryPreview() {
  const { responses } = useOnboardingStore();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch generated plan
    setPlan({
      tasks: [
        {
          id: "task_1",
          title: "Set up Google Ads account",
          description: "Create and configure Google Ads account",
          estimated_hours: 2,
          priority: "high",
          status: "planned"
        }
      ]
    });
  }, []);

  const summarySections = [
    {
      title: 'Business Profile',
      data: {
        'Business Name': responses['business-name'] || 'Not provided',
        'Description': responses['business-description'] || 'Not provided',
        'Brand Vibe': Array.isArray(responses['brand-vibe'])
          ? responses['brand-vibe'].join(', ')
          : 'Not provided'
      }
    },
    {
      title: 'Marketing Goals',
      data: {
        'Top Goals': Array.isArray(responses['top-goals'])
          ? responses['top-goals'].join(', ')
          : 'Not provided',
        'Growth Focus': Array.isArray(responses['growth-focus'])
          ? responses['growth-focus'].join(', ')
          : 'Not provided'
      }
    },
    {
      title: 'Resources',
      data: {
        'Weekly Time': responses['weekly-time-commitment'] || 'Not provided',
        'Budget': responses['marketing-budget'] || 'Not provided',
        'Existing Tools': Array.isArray(responses['existing-tools'])
          ? responses['existing-tools'].join(', ')
          : 'Not provided'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Your Marketing Plan is Ready!
            </h1>
            <p className="text-secondary-600">
              Here's a summary of what we learned about your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {summarySections.map((section, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-secondary-700">
                        {key}:
                      </span>
                      <p className="text-sm text-secondary-600 mt-1">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {plan && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Your Marketing Plan Preview
              </h3>
              <div className="space-y-3">
                {plan.tasks?.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-secondary-900">{task.title}</h4>
                      <p className="text-sm text-secondary-600">{task.description}</p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                      {task.estimated_hours}h
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="text-center space-y-4">
            <Button
              onClick={() => window.location.href = '/verify'}
              className="bg-primary-500 text-white px-8 py-3"
            >
              Verify Email & Access Full Plan
            </Button>
            <div>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/onboarding/brand-clarity/1'}
                className="text-secondary-600"
              >
                Edit My Answers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF
```

**Validation**: Processing screen shows progress, summary displays data, edit functionality works.

---

### Step 7: Email Verification System

**Objective**: Implement email verification flow

**Estimated Time**: 12-16 hours

#### 7.1 Verification Page

```bash
# Create verification page
cat > apps/web/app/verify/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@alva/auth-client';
import { useAuthStore } from '@/stores/authStore';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const result = await authClient.verifyMagicLink(token);
        setAccessToken(result.accessToken);
        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);

      } catch (error) {
        setStatus('error');
        setError('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [token, setAccessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Verifying your email...
            </h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Email verified successfully!
            </h1>
            <p className="text-secondary-600">
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Verification failed
            </h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
EOF
```

#### 7.2 Auth Store Implementation

```bash
# Create auth store
cat > apps/web/stores/authStore.ts << 'EOF'
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (token: string) => {
    set({
      accessToken: token,
      isAuthenticated: true
    });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      isAuthenticated: false
    });
  },
}));
EOF
```

**Validation**: Email verification works, tokens stored correctly, redirects to dashboard.

---

### Step 8: Dashboard Implementation (Based on Mockups)

**Objective**: Create dashboard interface based on web mockups

**Estimated Time**: 20-24 hours

#### 8.1 Dashboard Layout (Based on Marketing Plan mockup)

```bash
# Create dashboard layout
cat > apps/web/app/dashboard/layout.tsx << 'EOF'
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
EOF
```

#### 8.2 Dashboard Navigation

```bash
# Create dashboard navigation
cat > apps/web/components/dashboard/DashboardNav.tsx << 'EOF'
'use client';

import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export function DashboardNav() {
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary-600">Alva</h1>
            <span className="text-sm text-gray-500">Marketing Assistant</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
EOF
```

#### 8.3 Dashboard Sidebar (Based on mockups)

```bash
# Create dashboard sidebar
cat > apps/web/components/dashboard/DashboardSidebar.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Marketing Plan', href: '/dashboard/plan', icon: '📋' },
  { name: 'Daily Quick Wins', href: '/dashboard/quick-wins', icon: '⚡' },
  { name: 'To Do', href: '/dashboard/tasks', icon: '✅' },
  { name: 'Chat', href: '/dashboard/chat', icon: '💬' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
EOF
```

#### 8.4 Dashboard Home Page (Based on Daily Quick Wins mockup)

```bash
# Create dashboard home page
cat > apps/web/app/dashboard/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@alva/api-client';

interface QuickWin {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
}

export default function DashboardPage() {
  const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch quick wins from API
    setQuickWins([
      {
        id: '1',
        title: 'Set up Google Analytics',
        description: 'Install Google Analytics tracking code on your website',
        estimatedTime: 15,
        priority: 'high',
        status: 'planned'
      },
      {
        id: '2',
        title: 'Create Facebook Business Page',
        description: 'Set up your business presence on Facebook',
        estimatedTime: 20,
        priority: 'medium',
        status: 'planned'
      }
    ]);
    setLoading(false);
  }, []);

  const handleStartTask = (taskId: string) => {
    // TODO: Update task status
    console.log('Starting task:', taskId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's on your agenda today.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Wins Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daily Quick Wins</h2>
              <span className="text-sm text-gray-500">⚡ High Impact</span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                quickWins.map((win) => (
                  <div key={win.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{win.title}</h3>
                      <p className="text-sm text-gray-600">{win.description}</p>
                      <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        {win.estimatedTime} min
                      </span>
                    </div>
                    <Button
                      onClick={() => handleStartTask(win.id)}
                      className="bg-primary-500 text-white"
                    >
                      Start Task
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Plan Overview */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Overview</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">12</div>
                <div className="text-sm text-gray-600">Tasks Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10h</div>
                <div className="text-sm text-gray-600">Weekly Capacity</div>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-primary-500 text-white"
              onClick={() => window.location.href = '/dashboard/plan'}
            >
              View Full Plan
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
EOF
```

**Validation**: Dashboard loads correctly, navigation works, quick wins display, responsive design.

---

### Step 9: UI Component Library

**Objective**: Build reusable components based on mockups

**Estimated Time**: 16-20 hours

#### 9.1 Core UI Components

```bash
# Create button component
mkdir -p apps/web/components/ui
cat > apps/web/components/ui/Button.tsx << 'EOF'
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
EOF
```

#### 9.2 Card Component

```bash
# Create card component
cat > apps/web/components/ui/Card.tsx << 'EOF'
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {children}
    </div>
  );
}
EOF
```

#### 9.3 Input Components

```bash
# Create input component
cat > apps/web/components/ui/Input.tsx << 'EOF'
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        className
      )}
      {...props}
    />
  );
}
EOF
```

#### 9.4 Progress Bar Component

```bash
# Create progress bar component
cat > apps/web/components/ui/ProgressBar.tsx << 'EOF'
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
      <div
        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
EOF
```

**Validation**: All components render correctly, styling matches mockups, responsive design works.

---

### Step 10: Testing & Validation

**Objective**: Implement comprehensive testing

**Estimated Time**: 12-16 hours

#### 10.1 E2E Tests for MVP Flow

```bash
# Create E2E test for complete flow
cat > apps/web-e2e/src/mvp-flow.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('MVP Flow', () => {
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
});
EOF
```

#### 10.2 Unit Tests for Components

```bash
# Create component tests
mkdir -p apps/web/__tests__/components
cat > apps/web/__tests__/components/Button.test.tsx << 'EOF'
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-500');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
EOF
```

**Validation**: E2E tests pass, unit tests cover components, integration tests work.

---

## Final Validation & Deployment

### Step 11: End-to-End Testing

**Objective**: Validate complete MVP functionality

**Estimated Time**: 8-12 hours

#### 11.1 Complete Flow Testing

```bash
# Test complete user journey
pnpm run test:e2e
pnpm run test:unit
pnpm run test:integration
```

#### 11.2 Performance Testing

```bash
# Check performance metrics
npx nx e2e web-e2e --project=chromium
# Verify LCP < 2.5s, FID < 100ms
```

#### 11.3 Mobile Responsiveness

```bash
# Test mobile viewport
npx nx e2e web-e2e --project=webkit
# Verify responsive design works
```

### Step 12: Documentation & Deployment Prep

**Objective**: Prepare for deployment

**Estimated Time**: 4-6 hours

#### 12.1 Update Documentation

- Update README.md with MVP features
- Document API endpoints
- Create deployment guide

#### 12.2 Environment Setup

- Configure production environment variables
- Set up staging environment
- Prepare deployment scripts

---

## Success Criteria Validation

### ✅ **Functional Requirements**

- [ ] Landing page converts visitors to email sign-ups
- [ ] 26-card onboarding completes successfully
- [ ] Client profile JSON generated and stored
- [ ] PPC marketing plan generated via LLM
- [ ] Summary preview shows collected data
- [ ] Email verification works end-to-end
- [ ] User can access their dashboard
- [ ] Dashboard displays quick wins and plan overview

### ✅ **Technical Requirements**

- [ ] All services communicate correctly
- [ ] Authentication flow works securely
- [ ] Database operations function properly
- [ ] API endpoints respond correctly
- [ ] UI components match mockups
- [ ] Mobile responsive design
- [ ] Performance meets targets (LCP < 2.5s)

### ✅ **User Experience**

- [ ] Onboarding completion time < 7 minutes
- [ ] Plan generation time < 30 seconds
- [ ] Error handling provides clear feedback
- [ ] Loading states are smooth
- [ ] Navigation is intuitive

---

## Next Steps

After Phase 2 MVP completion, proceed to **Phase 3: Core Modules** to add:

- Blog module integration
- Email module integration
- Social media module integration
- Governance logic for plan merging
- Advanced task scheduling
- Enhanced dashboard features

---

**Total Estimated Time**: 120-160 hours (3-4 weeks)
**Key Deliverables**: Complete MVP with onboarding, plan generation, and dashboard
**Visual Reference**: All implementation based on desktop mockups in `_docs/mockups/web/`
