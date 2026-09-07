import {
  CustomerState,
  IntentResult,
  ObjectionResult,
  QuoteResult,
  RecommendedAction,
  ProductTier,
  CrmLead,
  CalendarBooking,
  AnalyticsData,
} from '../types/salespilot';

export interface ConversationTurnResponse {
  state: CustomerState;
  intent: IntentResult;
  objections: ObjectionResult;
  quote: QuoteResult;
  action: RecommendedAction;
  agentResponse: string;
  analysis?: any;
}

export const apiService = {
  async sendMessage(
    conversationId: string,
    text: string,
    meta?: {
      speakerName?: string;
      speakerId?: string;
      activeSpeakerId?: string;
      activeSpeakerName?: string;
    }
  ): Promise<ConversationTurnResponse> {
    const res = await fetch('/api/conversation/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        text,
        speaker: 'customer',
        ...meta,
      }),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  },

  async getCustomer(id: string): Promise<CustomerState> {
    const res = await fetch(`/api/customer/${id}`);
    if (!res.ok) throw new Error(`Failed to load customer state: ${res.status}`);
    return res.json();
  },

  async getCustomerMemory(id: string): Promise<{ memory: string[] }> {
    const res = await fetch(`/api/customer/${id}/memory`);
    if (!res.ok) throw new Error(`Failed to load memory: ${res.status}`);
    return res.json();
  },

  async calculateQuote(userCount: number, plan?: string): Promise<QuoteResult> {
    const res = await fetch('/api/quote/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_count: userCount, plan }),
    });
    if (!res.ok) throw new Error(`Quote calculation failed: ${res.status}`);
    return res.json();
  },

  async searchKnowledge(query: string): Promise<Array<{ source: string; snippet: string; score: number }>> {
    const res = await fetch('/api/knowledge/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  },

  async getProducts(): Promise<ProductTier[]> {
    const res = await fetch('/api/products');
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  },

  async getAgoraToken(channelName: string, uid?: number | string) {
    const res = await fetch('/api/agora/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, uid }),
    });
    if (!res.ok) throw new Error('Failed to obtain Agora token');
    return res.json();
  },

  async createLead(lead: Partial<CrmLead>): Promise<{ success: boolean; lead: CrmLead }> {
    const res = await fetch('/api/crm/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error('Failed to create CRM lead');
    return res.json();
  },

  async bookDemo(booking: Partial<CalendarBooking>): Promise<{ success: boolean; booking: CalendarBooking }> {
    const res = await fetch('/api/calendar/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error('Failed to book demo');
    return res.json();
  },

  async escalate(conversationId: string, reason?: string) {
    const res = await fetch('/api/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, reason }),
    });
    if (!res.ok) throw new Error('Escalation failed');
    return res.json();
  },

  async runUnitTests(): Promise<{ success: boolean; total: number; passed: number; results: Array<{ name: string; passed: boolean; details: string }> }> {
    const res = await fetch('/api/tests/run');
    if (!res.ok) throw new Error('Failed to run test suite');
    return res.json();
  },

  async getCustomerSessions(): Promise<{ activeSessionId: string; sessions: any[] }> {
    const res = await fetch('/api/customers/sessions');
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async switchActiveSession(sessionId: string): Promise<{ success: boolean; session?: any; resumePrompt?: string }> {
    const res = await fetch('/api/customers/switch-active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) throw new Error('Failed to switch active session');
    return res.json();
  },
};
