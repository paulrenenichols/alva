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
