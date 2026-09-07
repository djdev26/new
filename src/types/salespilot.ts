export type SentimentType = 'positive' | 'neutral' | 'negative' | 'interested';
export type BuyingSignal = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type ObjectionType = 'pricing' | 'trust' | 'competitor' | 'feature-gap' | 'timing' | 'other';
export type SalesStage = 
  | 'New Lead'
  | 'Engaged'
  | 'Qualified'
  | 'Demo Requested'
  | 'Demo Booked'
  | 'Negotiation'
  | 'Converted';

export type VoiceCallState = 
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'interrupted'
  | 'ended';

export interface CustomerProfile {
  name: string;
  company: string;
  email?: string;
  role?: string;
  decision_maker?: boolean;
}

export interface ObjectionItem {
  type: ObjectionType;
  excerpt: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolution_note?: string;
}

export interface RecommendedAction {
  action: 'Book Demo' | 'Send Pricing' | 'Create Lead' | 'Escalate to Human' | 'Address Objection' | 'Qualify Budget';
  reason: string;
  confidence: number;
}

export interface CustomerState {
  conversation_id: string;
  customer_profile: CustomerProfile;
  requirements: string[];
  budget: string | null;
  user_count: number;
  product_interest: string;
  buying_intent: BuyingSignal;
  objections: ObjectionItem[];
  competitors: string[];
  sentiment: SentimentType;
  timeline: string;
  qualification_score: number; // 0-100
  conversation_memory: string[];
  current_stage: SalesStage;
  recommended_action: RecommendedAction;
  last_updated: string;
}

export interface TranscriptTurn {
  id: string;
  speaker: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
  interrupted?: boolean;
  interruptedSnippet?: string;
}

export interface IntentResult {
  current_intent: string;
  detected_intent: string;
  confidence: number; // 0-100
  sentiment: SentimentType;
  buying_signal: BuyingSignal;
  urgency: UrgencyLevel;
}

export interface ObjectionResult {
  objections: Array<{
    type: ObjectionType;
    excerpt: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface QuoteBreakdown {
  planName: string;
  basePricePerSeat: number;
  userCount: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalPricePerMonth: number;
  annualTotal: number;
  includedFeatures: string[];
}

export interface QuoteResult {
  plan: string;
  users: number;
  estimated_price: number;
  breakdown: QuoteBreakdown;
}

export interface ProductTier {
  id: string;
  name: string;
  pricePerUser: number;
  billingPeriod: string;
  description: string;
  minUsers: number;
  maxUsers?: number;
  features: string[];
  popular?: boolean;
}

export interface CompetitorComparison {
  feature: string;
  salesPilotAI: string;
  genericCompetitor: string;
  legacyIvr: string;
}

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  email: string;
  userCount: number;
  plan: string;
  qualificationScore: number;
  stage: SalesStage;
  notes: string;
  createdAt: string;
}

export interface CalendarBooking {
  id: string;
  conversation_id?: string;
  customerName: string;
  company: string;
  date: string;
  time: string;
  attendeeEmail: string;
  notes: string;
  status: 'Confirmed' | 'Pending';
}

export interface AnalyticsData {
  totalConversations: number;
  qualifiedLeads: number;
  avgLeadScore: number;
  demosBooked: number;
  conversionRate: number;
  escalationsCount: number;
  avgDurationMinutes: number;
  objectionsBreakdown: Array<{ name: string; count: number; percentage: number }>;
  competitorMentions: Array<{ name: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  stageConversionFunnel: Array<{ stage: string; count: number }>;
}

export type ShowroomId = 'sports' | 'appliances';

export interface ShowroomHotspot {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  details: string;
  metric: string;
}

export interface ProductCardSpec {
  label: string;
  value: string;
}

export interface ShowroomProduct {
  id: string;
  showroomId: ShowroomId;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceFormatted: string;
  tagline: string;
  description: string;
  badge: string;
  has3dModel: boolean;
  rating: number;
  warranty: string;
  colors: { name: string; hex: string }[];
  metrics: { label: string; value: string }[];
  specs: ProductCardSpec[];
  hotspots: ShowroomHotspot[];
  officialSourceUrl?: string;
}

export interface ShowroomItem {
  id: ShowroomId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  badge: string;
  basePrice: number;
  specs: { label: string; value: string }[];
  hotspots: ShowroomHotspot[];
  accentColor: string;
  ambientColor: string;
  recommendedFor: string;
  voiceTriggers: string[];
  products: ShowroomProduct[];
}

export type AgenticToolType = 
  | 'switch_showroom' 
  | 'select_product'
  | 'compare_products'
  | 'negotiate_discount'
  | 'make_payment' 
  | 'book_calendar' 
  | 'update_database' 
  | 'trigger_workflow' 
  | 'inspect_3d_hotspot';

export interface AgenticToolCall {
  id: string;
  toolName: AgenticToolType;
  label: string;
  arguments: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'executing' | 'success' | 'failed';
  output: string;
  durationMs: number;
}

export interface PaymentSession {
  id: string;
  amount: number;
  currency: string;
  seats: number;
  plan: string;
  discountPercent: number;
  status: 'created' | 'processing' | 'paid';
  transactionId?: string;
  customerName: string;
  customerEmail: string;
  timestamp: string;
}

export type AgoraPipelineMode = 'agora_managed' | 'byok';

export interface AgoraPipelineConfig {
  mode: AgoraPipelineMode;
  sttProvider: 'Deepgram Nova-2' | 'Whisper Cloud' | 'Sarvam Indic STT';
  llmProvider: 'OpenAI GPT-4o' | 'Gemini 2.5 Flash' | 'Claude 3.5 Sonnet';
  ttsProvider: 'MiniMax Speech' | 'ElevenLabs Multilingual' | 'Sarvam Bulbul';
  freeMinutesRemaining: number;
  channelName: string;
  latencyMetrics: {
    sttMs: number;
    llmMs: number;
    ttsMs: number;
    rtcMs: number;
    totalMs: number;
  };
}

