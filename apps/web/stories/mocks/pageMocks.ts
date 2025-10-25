/**
 * @fileoverview Mock utilities and data for page stories in Storybook
 */

// Mock Data
export const mockQuickWins = [
  {
    id: '1',
    title: 'Set up Google Analytics',
    description: 'Track website traffic and user behavior',
    estimatedHours: 2,
    priority: 'high' as const,
    status: 'planned' as const,
    category: 'analytics' as const,
  },
  {
    id: '2',
    title: 'Create social media accounts',
    description: 'Establish presence on key social platforms',
    estimatedHours: 3,
    priority: 'medium' as const,
    status: 'in-progress' as const,
    category: 'social' as const,
  },
  {
    id: '3',
    title: 'Write first blog post',
    description: 'Create engaging content for your audience',
    estimatedHours: 4,
    priority: 'low' as const,
    status: 'completed' as const,
    category: 'content' as const,
  },
];

export const mockTasks = [
  {
    id: '1',
    title: 'Research target audience',
    description: 'Identify and analyze your ideal customers',
    status: 'completed' as const,
    priority: 'high' as const,
    dueDate: '2024-01-15',
    category: 'research',
  },
  {
    id: '2',
    title: 'Create brand guidelines',
    description: 'Develop consistent visual identity',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: '2024-01-20',
    category: 'branding',
  },
  {
    id: '3',
    title: 'Launch email campaign',
    description: 'Send welcome series to new subscribers',
    status: 'planned' as const,
    priority: 'low' as const,
    dueDate: '2024-01-25',
    category: 'email',
  },
];

export const mockModules = [
  {
    id: 'ppc',
    name: 'Pay-Per-Click',
    description: 'Google Ads and social media advertising',
    icon: '🎯',
    status: 'active' as const,
    tasks: 12,
    completed: 8,
  },
  {
    id: 'blog',
    name: 'Content Marketing',
    description: 'Blog posts and content strategy',
    icon: '📝',
    status: 'active' as const,
    tasks: 15,
    completed: 5,
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social media management and posting',
    icon: '📱',
    status: 'inactive' as const,
    tasks: 8,
    completed: 0,
  },
];

export const mockOnboardingCard = {
  id: 'business-name',
  title: 'What\'s your business name?',
  description: 'Tell us about your business',
  type: 'text',
  required: true,
  placeholder: 'Enter your business name',
  validation: {
    minLength: 2,
    maxLength: 100,
  },
};

export const mockOnboardingResponses = {
  'business-name': 'Acme Corp',
  'business-description': 'We provide innovative solutions for small businesses',
  'dream-customers': 'Small business owners looking to grow',
  'primary-goal': 'increase-sales',
  'monthly-budget': '1000-5000',
  'team-size': '1-5',
  'time-commitment': '5-10-hours',
  'project-timeline': '1-3-months',
};

export const mockMarketingPlan = {
  id: 'plan-123',
  userId: 'user-123',
  clientProfile: mockOnboardingResponses,
  modules: mockModules,
  tasks: mockTasks,
  quickWins: mockQuickWins,
  generatedAt: '2024-01-10T10:00:00Z',
  status: 'active' as const,
};

// Mock API responses
export const mockApiResponses = {
  getUserPlans: () => Promise.resolve([mockMarketingPlan]),
  generatePlan: (data: any) => Promise.resolve({ 
    success: true, 
    plan: mockMarketingPlan,
    error: null 
  }),
  saveOnboardingData: () => Promise.resolve({ success: true }),
  getQuickWins: () => Promise.resolve(mockQuickWins),
  getTasks: () => Promise.resolve(mockTasks),
  getModules: () => Promise.resolve(mockModules),
};

// Mock Auth responses
export const mockAuthResponses = {
  register: () => Promise.resolve({ success: true }),
  sendMagicLink: () => Promise.resolve({ success: true }),
  verifyToken: () => Promise.resolve({ user: { id: 'user-123', email: 'test@example.com' } }),
  logout: () => Promise.resolve({ success: true }),
};

// Mock Store states
export const mockStoreStates = {
  onboarding: {
    responses: mockOnboardingResponses,
    currentCard: 1,
    totalCards: 26,
    getCurrentCard: () => mockOnboardingCard,
    getCurrentSection: () => ({ id: 'business', name: 'Business Information' }),
    getProgress: () => ({ current: 1, total: 26, percentage: 3.8 }),
  },
  auth: {
    user: { id: 'user-123', email: 'test@example.com' },
    isLoading: false,
    error: null,
    isSignupMode: true,
  },
};