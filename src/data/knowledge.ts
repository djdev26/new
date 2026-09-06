import { ProductTier, CompetitorComparison } from '../types/salespilot';

export const productsData: ProductTier[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    pricePerUser: 999, // ₹999/mo per seat
    billingPeriod: 'per user / month (billed monthly or annually)',
    description: 'Ideal for small sales teams initiating real-time adaptive AI outbound & inbound qualification.',
    minUsers: 1,
    maxUsers: 20,
    features: [
      'Real-time voice agent with conversational turn-taking',
      'Standard objection & intent detection',
      'Dynamic single-tier pricing calculation',
      'CRM webhook sync (HubSpot, Zoho, Zapier)',
      'Standard STT/TTS voice synthesis',
      '500 monthly conversation minutes included',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    pricePerUser: 2499, // ₹2,499/mo per seat
    billingPeriod: 'per user / month (volume discounts available)',
    description: 'For expanding sales organizations needing deep negotiation reasoning, live memory, and multi-tier discounting.',
    minUsers: 21,
    maxUsers: 100,
    popular: true,
    features: [
      'Everything in Starter',
      'Persistent cross-session factual conversation memory',
      'Advanced dynamic negotiation & competitor comparison RAG',
      'Low-latency Agora RTC sub-300ms real-time audio pipeline',
      'Bi-directional Salesforce & HubSpot full sync',
      'Automated calendar booking & SLA escalation triggers',
      '2,500 monthly conversation minutes included',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Custom',
    pricePerUser: 3999, // Custom baseline ₹3,999/mo per seat with tailored volume discount
    billingPeriod: 'custom invoicing with dedicated SLA',
    description: 'For large enterprises requiring on-prem/VPC deployment, custom voice cloning, and custom qualification heuristics.',
    minUsers: 101,
    features: [
      'Unlimited conversation minutes with dedicated bandwidth',
      'Custom voice cloning & branded corporate acoustic tone',
      'Custom LLM fine-tuning & proprietary product catalog RAG',
      'SOC2 Type II & GDPR enterprise compliance guarantee',
      'Dedicated Customer Success Architect & 99.99% uptime SLA',
      'Human-in-the-loop live handover with audio stream transfer',
    ],
  },
];

export const pricingRulesData = {
  currency: 'INR (₹)',
  volumeBands: [
    { min: 1, max: 20, discountPct: 0, label: 'Standard Rate (1-20 seats)' },
    { min: 21, max: 50, discountPct: 10, label: 'Tier 1 Volume Discount: 10% off (21-50 seats)' },
    { min: 51, max: 100, discountPct: 20, label: 'Tier 2 Volume Discount: 20% off (51-100 seats)' },
    { min: 101, max: 9999, discountPct: 30, label: 'Enterprise Band: 30% custom volume rebate (100+ seats)' },
  ],
  annualCommitmentDiscountPct: 15,
  implementationFeeWaiverUserThreshold: 50,
};

export const faqsData = [
  {
    question: 'How fast is the voice response latency?',
    answer: 'SalesPilot AI utilizes Agora RTC edge infrastructure paired with streaming token inference, achieving sub-350ms end-to-end voice turnaround—indistinguishable from a human sales rep.',
    keywords: ['latency', 'delay', 'fast', 'speed', 'voice', 'lag', 'response time'],
  },
  {
    question: 'How does it handle customer interruptions?',
    answer: 'Unlike scripted bots that talk over buyers, our turn-taking controller listens continuously. When the customer speaks, audio synthesis stops instantly (sub-50ms), the cutoff snippet is recorded, and the AI pivots cleanly.',
    keywords: ['interrupt', 'talk over', 'barge in', 'speaking at same time', 'turn taking'],
  },
  {
    question: 'What integrations are supported?',
    answer: 'We offer native bi-directional connectors for Salesforce, HubSpot, Zoho CRM, Google Calendar, Outlook Calendar, and generic Webhooks.',
    keywords: ['crm', 'integration', 'salesforce', 'hubspot', 'zoho', 'calendar'],
  },
  {
    question: 'How quickly can we roll out SalesPilot AI?',
    answer: 'Standard deployment takes less than 48 hours for Starter and Growth tiers using our one-click CRM and knowledge connectors. Enterprise custom pilots can be deployed within 1 to 2 weeks.',
    keywords: ['rollout', 'timeline', 'implementation', 'how long', 'setup', 'weeks', 'days'],
  },
  {
    question: 'Is customer conversational data secure and compliant?',
    answer: 'Yes. All audio and transcript telemetry is encrypted in-transit (TLS 1.3) and at-rest (AES-256). We comply with SOC2 Type II, GDPR, and ISO 27001 data residency guidelines.',
    keywords: ['security', 'compliance', 'soc2', 'gdpr', 'privacy', 'safe', 'data'],
  },
  {
    question: 'Can human sales reps intervene during a live AI conversation?',
    answer: 'Yes! If the customer requests a human or if two or more high-severity objections arise, SalesPilot AI triggers an instant hot-transfer to your human rep queue with full live context and audio handoff.',
    keywords: ['human', 'escalate', 'agent', 'handoff', 'transfer', 'rep'],
  },
];

export const competitorData: CompetitorComparison[] = [
  {
    feature: 'Conversational Adaptability',
    salesPilotAI: 'Dynamic multi-turn reasoning over evolving CustomerState',
    genericCompetitor: 'Static decision trees with keyword routing (Sample data)',
    legacyIvr: 'Rigid numerical DTMF phone menus ("Press 1 for Sales")',
  },
  {
    feature: 'Natural Interruption Handling',
    salesPilotAI: 'Instant voice cutoff (<50ms) with memory of interrupted thought',
    genericCompetitor: 'Finishes fixed sentence or restarts whole paragraph',
    legacyIvr: 'Cannot interrupt; caller must wait for audio prompt to finish',
  },
  {
    feature: 'Real-time Dynamic Pricing',
    salesPilotAI: 'Calculates custom volume bands & approvals mid-conversation',
    genericCompetitor: 'Fixed price cards or "Our sales rep will email you a quote"',
    legacyIvr: 'Not supported',
  },
  {
    feature: 'Conversational Memory',
    salesPilotAI: 'Extracts factual delta bullets (e.g. 50 → 100 users, budget change)',
    genericCompetitor: 'Session loss or loses context after 2 turns',
    legacyIvr: 'Zero memory between menu levels',
  },
  {
    feature: 'Voice Latency (Agora RTC)',
    salesPilotAI: '280ms - 350ms ultra-low edge audio',
    genericCompetitor: '900ms - 1800ms sluggish cloud HTTP audio roundtrips',
    legacyIvr: 'Local telephony, but mechanical robotic recorded audio',
  },
  {
    feature: 'Calendar & CRM Actioning',
    salesPilotAI: 'Direct live booking & lead generation during the call',
    genericCompetitor: 'Sends follow-up email link to Calendly',
    legacyIvr: 'Transfers to hold queue or voicemail',
  },
];

/**
 * Lightweight RAG Search over knowledge base
 */
export function searchKnowledgeBase(query: string): Array<{ source: string; snippet: string; score: number }> {
  const normalizedQuery = query.toLowerCase();
  const results: Array<{ source: string; snippet: string; score: number }> = [];

  // Search FAQs
  faqsData.forEach((faq) => {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();

    if (qLower.includes(normalizedQuery)) score += 5;
    if (aLower.includes(normalizedQuery)) score += 3;

    faq.keywords.forEach((kw) => {
      if (normalizedQuery.includes(kw.toLowerCase())) score += 2;
    });

    if (score > 0) {
      results.push({
        source: `FAQ: ${faq.question}`,
        snippet: faq.answer,
        score,
      });
    }
  });

  // Search Products
  productsData.forEach((p) => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    if (normalizedQuery.includes(nameLower) || normalizedQuery.includes(p.id)) score += 4;
    p.features.forEach((feat) => {
      if (normalizedQuery.includes(feat.toLowerCase()) || feat.toLowerCase().includes(normalizedQuery)) {
        score += 2;
      }
    });
    if (score > 0) {
      results.push({
        source: `Product: ${p.name} (₹${p.pricePerUser}/mo)`,
        snippet: `${p.description} Features: ${p.features.slice(0, 3).join(', ')}`,
        score,
      });
    }
  });

  // Search Competitors
  if (normalizedQuery.includes('competitor') || normalizedQuery.includes('cheaper') || normalizedQuery.includes('alternative')) {
    results.push({
      source: 'Competitor Comparison Table (Sample Data)',
      snippet: 'SalesPilot AI offers sub-350ms real-time audio and dynamic mid-call pricing, whereas generic competitors use static decision trees with 1.2s+ latency.',
      score: 5,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 4);
}
