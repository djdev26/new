import { detectIntentDeterministic } from './intentDetector';
import { detectObjectionsDeterministic } from './objectionDetector';
import {
  getInitialCustomerState,
  updateCustomerState,
  calculateQualificationScore,
} from './customerStateEngine';
import { determineNextBestAction } from './nextBestActionEngine';
import { calculateQuote } from './pricingEngine';

export interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

export function runSalesPilotUnitTests(): TestResult[] {
  const results: TestResult[] = [];
  const conversationId = 'test-session-suite';

  // Test 1: Initial state baseline
  const initialState = getInitialCustomerState(conversationId);
  results.push({
    name: 'Initial State Verification',
    passed: initialState.user_count === 50 && initialState.current_stage === 'Engaged',
    details: `User count: ${initialState.user_count}, Score: ${initialState.qualification_score}`,
  });

  // Test 2: Pricing objection detection
  const pricingTurn = "Competitor X offers this for 20% cheaper, why is your cost so expensive?";
  const pricingObjections = detectObjectionsDeterministic(pricingTurn);
  const hasPricingObj = pricingObjections.objections.some((o) => o.type === 'pricing');
  const hasCompetitorObj = pricingObjections.objections.some((o) => o.type === 'competitor');
  results.push({
    name: 'Pricing & Competitor Objection Detection',
    passed: hasPricingObj && hasCompetitorObj,
    details: `Detected categories: ${pricingObjections.objections.map((o) => o.type).join(', ')}`,
  });

  // Test 3: Competitor mention detection & memory extraction
  const intent1 = detectIntentDeterministic(pricingTurn);
  const updated1 = updateCustomerState(conversationId, pricingTurn, intent1, pricingObjections);
  const competitorLogged = updated1.competitors.includes('Competitor X');
  results.push({
    name: 'Competitor Mention Extraction',
    passed: competitorLogged,
    details: `Competitors list: ${updated1.competitors.join(', ')}`,
  });

  // Test 4: User-count update (50 -> 100 users)
  const userCountTurn = "Actually, our enterprise is expanding. What if we need 100 users instead?";
  const intent2 = detectIntentDeterministic(userCountTurn);
  const obj2 = detectObjectionsDeterministic(userCountTurn);
  const updated2 = updateCustomerState(conversationId, userCountTurn, intent2, obj2);
  results.push({
    name: 'User Count Update (50 → 100 Seats)',
    passed: updated2.user_count === 100 && updated2.product_interest === 'Enterprise Custom',
    details: `New seat capacity: ${updated2.user_count}, Product: ${updated2.product_interest}`,
  });

  // Test 5: Dynamic Quote Volume Discount Calculation
  const quote = calculateQuote(updated2.user_count, updated2.product_interest);
  results.push({
    name: 'Dynamic Volume Discount Band for 100 Users',
    passed: quote.breakdown.discountPercentage >= 20 && quote.users === 100,
    details: `Calculated discount: ${quote.breakdown.discountPercentage}%, Effective price: ₹${quote.estimated_price}/mo`,
  });

  // Test 6: Qualification Score Progression
  const scoreIncreased = updated2.qualification_score > initialState.qualification_score;
  results.push({
    name: 'Qualification Score Evolution After Enterprise Scaling',
    passed: scoreIncreased,
    details: `Initial: ${initialState.qualification_score} → Updated: ${updated2.qualification_score}/100`,
  });

  // Test 7: Next-Best-Action Reasoning for Enterprise Ready Lead
  // Once objections are resolved and demo request is posed
  const readyState = {
    ...updated2,
    objections: updated2.objections.map((o) => ({ ...o, resolved: true })),
    current_stage: 'Qualified' as const,
  };
  const demoTurn = "That works. Can we book an enterprise demo for next Tuesday?";
  const nextAction = determineNextBestAction(readyState, demoTurn);
  results.push({
    name: 'Next-Best-Action Engine: Enterprise Demo Recommendation',
    passed: nextAction.action === 'Book Demo',
    details: `Recommended: ${nextAction.action} (${nextAction.confidence}%), Reason: ${nextAction.reason}`,
  });

  // Test 8: Factual Delta Memory Bullets Maintenance
  const memoryContainsScaleFact = updated2.conversation_memory.some((m) => m.includes('100 users'));
  results.push({
    name: 'Conversation Memory Bullet Extraction',
    passed: memoryContainsScaleFact,
    details: `Memory items count: ${updated2.conversation_memory.length}`,
  });

  return results;
}
