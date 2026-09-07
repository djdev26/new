/**
 * Customer Decision Passport
 * Structured, live customer decision state machine (generalized from EasyEV Buyer Decision Passport)
 */

export interface CustomerIdentity {
  customerId: string;
  name: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  decisionAuthority: boolean;
  location?: string;
  communicationPreference?: 'voice' | 'text' | 'email' | 'whatsapp';
}

export interface CustomerBudget {
  min?: number;
  max?: number;
  target?: number;
  currency: string;
  isStrict: boolean;
  flexibilityPercentage: number;
}

export interface CustomerObjectionRecord {
  id: string;
  type: 'pricing' | 'trust' | 'competitor' | 'feature-gap' | 'timing' | 'weight' | 'battery' | 'ecosystem' | 'other';
  excerpt: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolutionNote?: string;
  raisedAt: string;
  resolvedAt?: string;
}

export interface CustomerDecisionRecord {
  id: string;
  decision: string;
  rationale?: string;
  timestamp: string;
}

export interface NextBestActionRecommendation {
  action:
    | 'Qualify Budget'
    | 'Explore Needs'
    | 'Recommend Product'
    | 'Compare Products'
    | 'Address Objection'
    | 'Demonstrate 3D Model'
    | 'Switch Showroom'
    | 'Send Quote'
    | 'Book Demo'
    | 'Proceed to Checkout'
    | 'Escalate to Human';
  reason: string;
  confidence: number; // 0-100
  suggestedDialoguePrompt?: string;
}

export interface CustomerDecisionPassport {
  customerId: string;
  sessionId: string;
  identity: CustomerIdentity;
  needs: string[];
  constraints: string[];
  budget: CustomerBudget;
  preferences: string[];
  dislikes: string[];
  productsConsidered: string[]; // product IDs
  productsRejected: Record<string, string>; // productId -> reason for rejection
  productsPreferred: string[]; // product IDs
  comparisonResults: Array<{
    productIds: string[];
    winnerId: string;
    summary: string;
    timestamp: string;
  }>;
  objections: CustomerObjectionRecord[];
  decisions: CustomerDecisionRecord[];
  purchaseIntent: 'low' | 'medium' | 'high' | 'ready_to_buy';
  intentScore: number; // 0-100
  timeline: string;
  currentStoreId: string;
  currentCategory: string;
  nextBestAction: NextBestActionRecommendation;
  version: number;
  createdAt: string;
  lastUpdated: string;
}

export function createInitialPassport(
  customerId: string,
  sessionId: string,
  name: string = 'Guest Shopper',
  category: string = 'laptops',
  storeId: string = 'flagship-store'
): CustomerDecisionPassport {
  return {
    customerId,
    sessionId,
    identity: {
      customerId,
      name,
      decisionAuthority: true,
      communicationPreference: 'voice',
    },
    needs: [],
    constraints: [],
    budget: {
      currency: 'INR',
      isStrict: false,
      flexibilityPercentage: 10,
    },
    preferences: [],
    dislikes: [],
    productsConsidered: [],
    productsRejected: {},
    productsPreferred: [],
    comparisonResults: [],
    objections: [],
    decisions: [],
    purchaseIntent: 'medium',
    intentScore: 50,
    timeline: 'Within 30 days',
    currentStoreId: storeId,
    currentCategory: category,
    nextBestAction: {
      action: 'Explore Needs',
      reason: 'Session initiated; uncover customer goals and operational requirements.',
      confidence: 80,
    },
    version: 1,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Update the Customer Decision Passport with continuous facts extracted from natural turns
 */
export function updatePassportWithFacts(
  passport: CustomerDecisionPassport,
  facts: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    budgetMax?: number;
    currency?: string;
    addNeed?: string;
    addConstraint?: string;
    addPreference?: string;
    addDislike?: string;
    considerProduct?: string;
    rejectProduct?: { productId: string; reason: string };
    preferProduct?: string;
    objection?: { type: string; excerpt: string; severity: 'low' | 'medium' | 'high' };
    resolveObjectionType?: string;
    intentSignal?: 'low' | 'medium' | 'high' | 'ready_to_buy';
    category?: string;
    storeId?: string;
  }
): CustomerDecisionPassport {
  const next = { ...passport };
  next.version += 1;
  next.lastUpdated = new Date().toISOString();

  if (facts.name && (!next.identity.name || next.identity.name === 'Guest Shopper' || next.identity.name === 'Customer')) {
    next.identity.name = facts.name;
  }
  if (facts.email) next.identity.email = facts.email;
  if (facts.phone) next.identity.phone = facts.phone;
  if (facts.company) next.identity.company = facts.company;

  if (facts.budgetMax !== undefined && facts.budgetMax > 0) {
    next.budget.max = facts.budgetMax;
    next.budget.target = Math.round(facts.budgetMax * 0.9);
  }
  if (facts.currency) next.budget.currency = facts.currency;

  if (facts.addNeed && !next.needs.includes(facts.addNeed)) {
    next.needs.push(facts.addNeed);
  }
  if (facts.addConstraint && !next.constraints.includes(facts.addConstraint)) {
    next.constraints.push(facts.addConstraint);
  }
  if (facts.addPreference && !next.preferences.includes(facts.addPreference)) {
    next.preferences.push(facts.addPreference);
  }
  if (facts.addDislike && !next.dislikes.includes(facts.addDislike)) {
    next.dislikes.push(facts.addDislike);
  }

  if (facts.considerProduct && !next.productsConsidered.includes(facts.considerProduct)) {
    next.productsConsidered.push(facts.considerProduct);
  }
  if (facts.rejectProduct) {
    next.productsRejected[facts.rejectProduct.productId] = facts.rejectProduct.reason;
    next.productsPreferred = next.productsPreferred.filter((id) => id !== facts.rejectProduct?.productId);
  }
  if (facts.preferProduct && !next.productsPreferred.includes(facts.preferProduct)) {
    next.productsPreferred.push(facts.preferProduct);
  }

  if (facts.objection) {
    next.objections.push({
      id: `obj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: facts.objection.type as any,
      excerpt: facts.objection.excerpt,
      severity: facts.objection.severity,
      resolved: false,
      raisedAt: new Date().toISOString(),
    });
  }

  if (facts.resolveObjectionType) {
    next.objections.forEach((o) => {
      if (o.type === facts.resolveObjectionType && !o.resolved) {
        o.resolved = true;
        o.resolvedAt = new Date().toISOString();
        o.resolutionNote = 'Resolved via agent explanation';
      }
    });
  }

  if (facts.intentSignal) {
    next.purchaseIntent = facts.intentSignal;
    if (facts.intentSignal === 'ready_to_buy') next.intentScore = 95;
    else if (facts.intentSignal === 'high') next.intentScore = 80;
    else if (facts.intentSignal === 'medium') next.intentScore = 55;
    else next.intentScore = 30;
  }

  if (facts.category) next.currentCategory = facts.category;
  if (facts.storeId) next.currentStoreId = facts.storeId;

  // Re-evaluate next best action
  const unresolvedHigh = next.objections.filter((o) => !o.resolved && o.severity === 'high');
  if (unresolvedHigh.length > 0) {
    next.nextBestAction = {
      action: 'Address Objection',
      reason: `Unresolved high-priority objection regarding ${unresolvedHigh[0].type}.`,
      confidence: 90,
    };
  } else if (next.purchaseIntent === 'ready_to_buy') {
    next.nextBestAction = {
      action: 'Proceed to Checkout',
      reason: 'Customer expressed clear buying decision and agreement.',
      confidence: 95,
    };
  } else if (next.productsConsidered.length >= 2 && next.comparisonResults.length === 0) {
    next.nextBestAction = {
      action: 'Compare Products',
      reason: 'Customer is actively evaluating multiple products in catalog.',
      confidence: 85,
    };
  } else if (next.needs.length > 0 && next.productsPreferred.length > 0) {
    next.nextBestAction = {
      action: 'Recommend Product',
      reason: 'Clear needs established and matching top product identified.',
      confidence: 88,
    };
  }

  return next;
}
