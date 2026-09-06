import {
  CustomerState,
  IntentResult,
  ObjectionResult,
  SalesStage,
  ObjectionItem,
  RecommendedAction,
} from '../types/salespilot';

// In-memory store for active conversations
const stateStore = new Map<string, CustomerState>();

export function getInitialCustomerState(conversationId: string): CustomerState {
  return {
    conversation_id: conversationId,
    customer_profile: {
      name: 'Priya Sharma',
      company: 'ApexScale Corp',
      email: 'priya.s@apexscale.io',
      role: 'VP of Revenue Operations',
      decision_maker: true,
    },
    requirements: ['Voice AI Outbound', 'CRM Integration', 'Sub-second Latency'],
    budget: null,
    user_count: 50,
    product_interest: 'Growth Plan',
    buying_intent: 'medium',
    objections: [],
    competitors: [],
    sentiment: 'neutral',
    timeline: 'Within 30 days',
    qualification_score: 55,
    conversation_memory: [
      'Buyer identified as Priya Sharma, VP of Revenue Operations at ApexScale Corp.',
      'Initial interest registered in Growth Plan with standard CRM sync.',
    ],
    current_stage: 'Engaged',
    recommended_action: {
      action: 'Qualify Budget',
      reason: 'Lead is engaged and evaluating team size; assess user capacity and budget fit.',
      confidence: 85,
    },
    last_updated: new Date().toISOString(),
  };
}

export function calculateQualificationScore(state: Partial<CustomerState>): number {
  let score = 30; // base score for engaged conversation

  // 1. Buying Intent weighting (max 25 pts)
  if (state.buying_intent === 'high') score += 25;
  else if (state.buying_intent === 'medium') score += 15;
  else score += 5;

  // 2. Decision Maker confirmed (max 20 pts)
  if (state.customer_profile?.decision_maker) {
    score += 20;
  } else {
    score += 8;
  }

  // 3. User scale / contract size fit (max 20 pts)
  const users = state.user_count || 1;
  if (users >= 100) score += 20; // Enterprise scale
  else if (users >= 40) score += 15;
  else if (users >= 15) score += 10;
  else score += 5;

  // 4. Timeline urgency (max 15 pts)
  const timeline = (state.timeline || '').toLowerCase();
  if (timeline.includes('2 week') || timeline.includes('urgent') || timeline.includes('immediate') || timeline.includes('this month')) {
    score += 15;
  } else if (timeline.includes('quarter') || timeline.includes('30 days')) {
    score += 10;
  } else {
    score += 5;
  }

  // 5. Objection Penalty / Resolution (max +/- 20 pts)
  const unresolvedHigh = (state.objections || []).filter((o) => !o.resolved && o.severity === 'high').length;
  const unresolvedMed = (state.objections || []).filter((o) => !o.resolved && o.severity === 'medium').length;
  const resolvedCount = (state.objections || []).filter((o) => o.resolved).length;

  score -= unresolvedHigh * 10;
  score -= unresolvedMed * 4;
  score += resolvedCount * 6;

  // Clamp between 0 and 100
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function updateCustomerState(
  conversationId: string,
  utterance: string,
  intentResult: IntentResult,
  objectionResult: ObjectionResult
): CustomerState {
  let state = stateStore.get(conversationId);
  if (!state) {
    state = getInitialCustomerState(conversationId);
  }

  const lower = utterance.toLowerCase();
  const memoryAdditions: string[] = [];

  // 1. Extract / Update user count (e.g. 50 -> 100)
  const userMatch = utterance.match(/(\d+)\s*(?:users|seats|reps|licenses|people)/i);
  if (userMatch && userMatch[1]) {
    const newCount = parseInt(userMatch[1], 10);
    if (!isNaN(newCount) && newCount !== state.user_count) {
      memoryAdditions.push(`Updated seat capacity requirement from ${state.user_count} to ${newCount} users.`);
      state.user_count = newCount;
      if (newCount >= 100) {
        state.product_interest = 'Enterprise Custom';
      } else if (newCount > 20) {
        state.product_interest = 'Growth Plan';
      } else {
        state.product_interest = 'Starter Plan';
      }
    }
  }

  // 2. Extract competitor mentions
  if (lower.includes('competitor x')) {
    if (!state.competitors.includes('Competitor X')) {
      state.competitors.push('Competitor X');
      memoryAdditions.push('Customer brought up Competitor X (citing 20% lower pricing concern).');
    }
  } else if (lower.includes('competitor') && !state.competitors.includes('Generic Competitor')) {
    state.competitors.push('Generic Competitor');
    memoryAdditions.push('Customer comparing pricing against external competitors.');
  }

  // 3. Extract timeline requirement
  if (lower.includes('2 weeks') || lower.includes('two weeks')) {
    state.timeline = '2 Weeks (Accelerated Rollout)';
    memoryAdditions.push('Expressed strict 2-week implementation timeline requirement.');
  } else if (lower.includes('urgent') || lower.includes('immediate')) {
    state.timeline = 'Immediate (Urgent)';
    memoryAdditions.push('Customer marked deployment timeline as urgent.');
  }

  // 4. Update Objections
  if (objectionResult.objections.length > 0) {
    objectionResult.objections.forEach((obj) => {
      const alreadyExists = state!.objections.some(
        (existing) => existing.type === obj.type && !existing.resolved
      );
      if (!alreadyExists) {
        state!.objections.push({
          type: obj.type,
          excerpt: obj.excerpt,
          severity: obj.severity,
          resolved: false,
        });
        memoryAdditions.push(`Raised ${obj.severity}-severity objection regarding ${obj.type}: "${obj.excerpt.slice(0, 75)}..."`);
      }
    });
  }

  // Check if previous objections should be marked as resolved
  if (lower.includes('that works') || lower.includes('makes sense') || lower.includes('sounds good') || lower.includes('fair enough') || lower.includes('perfect')) {
    state.objections.forEach((obj) => {
      if (!obj.resolved) {
        obj.resolved = true;
        obj.resolution_note = 'Accepted pricing justification & implementation SLA';
        memoryAdditions.push(`Resolved previously raised objection on ${obj.type}.`);
      }
    });
  }

  // 5. Update sentiment & buying intent
  state.sentiment = intentResult.sentiment;
  state.buying_intent = intentResult.buying_signal;

  // 6. Update stage
  if (lower.includes('book') || lower.includes('demo') || lower.includes('schedule') || intentResult.detected_intent === 'Demo Booking Request') {
    state.current_stage = 'Demo Requested';
    memoryAdditions.push('Customer requested an enterprise solutions architect demo.');
  } else if (state.qualification_score >= 80) {
    if (state.current_stage === 'Engaged' || state.current_stage === 'New Lead') {
      state.current_stage = 'Qualified';
    }
  }

  // 7. Update memory bullets
  if (memoryAdditions.length > 0) {
    state.conversation_memory.push(...memoryAdditions);
  }

  // 8. Recompute qualification score transparently
  state.qualification_score = calculateQualificationScore(state);
  state.last_updated = new Date().toISOString();

  stateStore.set(conversationId, state);
  return state;
}

export function getCustomerState(conversationId: string): CustomerState {
  let state = stateStore.get(conversationId);
  if (!state) {
    state = getInitialCustomerState(conversationId);
    stateStore.set(conversationId, state);
  }
  return state;
}

export function getCustomerMemory(conversationId: string): string[] {
  const state = getCustomerState(conversationId);
  return state.conversation_memory;
}

export function setCustomerStage(conversationId: string, stage: SalesStage): CustomerState {
  const state = getCustomerState(conversationId);
  state.current_stage = stage;
  state.conversation_memory.push(`Sales stage advanced to "${stage}".`);
  state.qualification_score = calculateQualificationScore(state);
  state.last_updated = new Date().toISOString();
  stateStore.set(conversationId, state);
  return state;
}
