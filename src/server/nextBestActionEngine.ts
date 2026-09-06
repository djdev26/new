import { CustomerState, RecommendedAction } from '../types/salespilot';
import { searchKnowledgeBase } from '../data/knowledge';

export function determineNextBestAction(state: CustomerState, latestUtterance?: string): RecommendedAction {
  const unresolvedObjections = (state.objections || []).filter((o) => !o.resolved);
  const highSeverityObjections = unresolvedObjections.filter((o) => o.severity === 'high');
  const utteranceLower = (latestUtterance || '').toLowerCase();

  // Rule 1: Human Escalation Trigger
  // If customer explicitly asks for human OR has 2+ unresolved high/medium objections
  if (
    utteranceLower.includes('human') ||
    utteranceLower.includes('agent') ||
    utteranceLower.includes('representative') ||
    unresolvedObjections.length >= 2 ||
    highSeverityObjections.length >= 1
  ) {
    return {
      action: 'Escalate to Human',
      reason: `Customer has ${unresolvedObjections.length} active objection(s) or requested human assistance. Handing over with live transcript and context summary.`,
      confidence: 94,
    };
  }

  // Rule 2: High Intent & High Qualification -> Book Demo
  // If buying_intent=high AND qualification_score > 70 OR stage is Demo Requested
  if (
    state.current_stage === 'Demo Requested' ||
    (state.buying_intent === 'high' && state.qualification_score >= 70) ||
    state.user_count >= 100
  ) {
    return {
      action: 'Book Demo',
      reason: `High qualification score (${state.qualification_score}/100) with ${state.user_count} seats in ${state.product_interest}. Enterprise readiness warrants immediate solutions architect demo booking.`,
      confidence: 96,
    };
  }

  // Rule 3: Active Competitor / Pricing Objection -> Address Objection & Send Pricing
  const pricingOrCompetitorObj = unresolvedObjections.find(
    (o) => o.type === 'pricing' || o.type === 'competitor'
  );
  if (pricingOrCompetitorObj || state.competitors.length > 0) {
    return {
      action: 'Send Pricing',
      reason: `Customer highlighted pricing / competitor concern ("${pricingOrCompetitorObj?.excerpt?.slice(0, 60) || state.competitors.join(', ')}"). Recommended action: provide live dynamic volume breakdown and sub-350ms SLA justification.`,
      confidence: 90,
    };
  }

  // Rule 4: Qualified Lead with high/medium score -> Create Lead in CRM
  if (state.qualification_score >= 60 && !state.customer_profile.email) {
    return {
      action: 'Create Lead',
      reason: `Customer profile for ${state.customer_profile.company} has reached qualification threshold (${state.qualification_score}/100). Push lead to CRM queue.`,
      confidence: 88,
    };
  }

  // Rule 5: Default Discovery / Budget Qualification
  return {
    action: 'Qualify Budget',
    reason: `Gathering requirements for ${state.user_count} users. Inquire into timeline, target integrations, and current call volume.`,
    confidence: 82,
  };
}
