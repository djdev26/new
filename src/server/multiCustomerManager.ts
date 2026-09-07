import { CustomerDecisionPassport, createInitialPassport, updatePassportWithFacts } from '../models/passport';
import { globalCommerceRepository, PersistentMemoryItem } from './storage/sqliteRepository';
import { UniversalCart } from '../models/commerce';

export type CustomerSessionState =
  | 'active'
  | 'interrupted'
  | 'queued'
  | 'waiting'
  | 'resumed'
  | 'completed'
  | 'escalated';

export interface CustomerSession {
  customerId: string;
  speakerId: string;
  conversationId: string;
  name: string;
  role: string;
  company: string;
  status: CustomerSessionState;
  storeId: string;
  category: string;
  passport: CustomerDecisionPassport;
  transcript: Array<{ speaker: 'customer' | 'agent' | 'system'; text: string; timestamp: string }>;
  cart?: UniversalCart;
  priority: number; // 1 (highest) to 10
  lastInteraction: string;
  pendingActions: string[];
}

export class CustomerSessionManager {
  private activeCustomerId: string = 'cust-priya';
  private sessions: Map<string, CustomerSession> = new Map();

  constructor() {
    this.bootstrapKnownCustomers();
  }

  private bootstrapKnownCustomers(): void {
    // 1. Priya Sharma (Enterprise/Workstation evaluation)
    const priyaId = 'cust-priya';
    let priyaPassport = createInitialPassport(priyaId, `sess-${priyaId}`, 'Priya Sharma', 'laptops', 'store-mumbai');
    priyaPassport = updatePassportWithFacts(priyaPassport, {
      name: 'Priya Sharma',
      company: 'ApexScale Corp',
      email: 'priya.s@apexscale.io',
      budgetMax: 300000,
      addNeed: 'High-performance AI workstation with long battery life',
      addPreference: 'Lightweight aluminium or carbon-fiber chassis',
      addDislike: 'Heavy gaming rigs exceeding 2.2kg',
      considerProduct: 'laptop-1',
      preferProduct: 'laptop-1',
      intentSignal: 'high',
    });

    globalCommerceRepository.upsertCustomer({
      id: priyaId,
      name: 'Priya Sharma',
      email: 'priya.s@apexscale.io',
      company: 'ApexScale Corp',
      role: 'VP of Engineering',
      metadata: { targetCategory: 'laptops' },
    });

    globalCommerceRepository.saveMemory({
      customerId: priyaId,
      fact: 'Budget ceiling is ₹3,00,000 for neural workstation rollout.',
      category: 'budget',
      confidence: 1.0,
      source: 'customer_utterance',
      consent: true,
    });

    globalCommerceRepository.saveMemory({
      customerId: priyaId,
      fact: 'Dislikes heavy laptops; prioritizes all-day battery life for executive travel.',
      category: 'dislike',
      confidence: 0.95,
      source: 'customer_utterance',
      consent: true,
    });

    const priyaSession: CustomerSession = {
      customerId: priyaId,
      speakerId: 'spk-priya',
      conversationId: `conv-${priyaId}`,
      name: 'Priya Sharma',
      role: 'VP of Engineering',
      company: 'ApexScale Corp',
      status: 'active',
      storeId: 'store-mumbai',
      category: 'laptops',
      passport: priyaPassport,
      transcript: [
        {
          speaker: 'agent',
          text: 'Hello Priya! Welcome back to SalesPilot. I have your Dell XPS 16 and MacBook Pro 16 configurations ready for comparison.',
          timestamp: '10:00 AM',
        },
      ],
      priority: 1,
      lastInteraction: new Date().toISOString(),
      pendingActions: ['Compare Dell XPS 16 vs MacBook Pro 16'],
    };
    this.sessions.set(priyaId, priyaSession);
    this.activeCustomerId = priyaId;

    // 2. Rahul Verma (Luxury Auto / Fleet)
    const rahulId = 'cust-rahul';
    let rahulPassport = createInitialPassport(rahulId, `sess-${rahulId}`, 'Rahul Verma', 'cars', 'store-delhi');
    rahulPassport = updatePassportWithFacts(rahulPassport, {
      name: 'Rahul Verma',
      company: 'Velocity Logistics',
      budgetMax: 25000000,
      addNeed: 'Luxury performance SUV for executive VIP transport',
      addPreference: 'All-wheel drive, air suspension, commanding road presence',
      considerProduct: 'car-4',
      intentSignal: 'medium',
      category: 'cars',
    });

    globalCommerceRepository.upsertCustomer({
      id: rahulId,
      name: 'Rahul Verma',
      company: 'Velocity Logistics',
      role: 'Fleet Operations Director',
      metadata: { targetCategory: 'cars' },
    });

    globalCommerceRepository.saveMemory({
      customerId: rahulId,
      fact: 'Looking for luxury SUV under ₹2.5 Crore for executive fleet.',
      category: 'budget',
      confidence: 0.9,
      source: 'customer_utterance',
      consent: true,
    });

    const rahulSession: CustomerSession = {
      customerId: rahulId,
      speakerId: 'spk-rahul',
      conversationId: `conv-${rahulId}`,
      name: 'Rahul Verma',
      role: 'Fleet Operations Director',
      company: 'Velocity Logistics',
      status: 'waiting',
      storeId: 'store-delhi',
      category: 'cars',
      passport: rahulPassport,
      transcript: [],
      priority: 2,
      lastInteraction: new Date(Date.now() - 300000).toISOString(),
      pendingActions: ['Inspect Range Rover SV specs'],
    };
    this.sessions.set(rahulId, rahulSession);

    // 3. Ananya Roy (Smart Home Appliances)
    const ananyaId = 'cust-ananya';
    let ananyaPassport = createInitialPassport(ananyaId, `sess-${ananyaId}`, 'Ananya Roy', 'appliances', 'store-bangalore');
    ananyaPassport = updatePassportWithFacts(ananyaPassport, {
      name: 'Ananya Roy',
      company: 'Modern Living Residences',
      budgetMax: 500000,
      addNeed: 'Energy efficient French door refrigerator and inverter washer bundle',
      considerProduct: 'appliance-1',
      intentSignal: 'medium',
      category: 'appliances',
    });

    globalCommerceRepository.upsertCustomer({
      id: ananyaId,
      name: 'Ananya Roy',
      company: 'Modern Living Residences',
      role: 'Smart Living Architect',
      metadata: { targetCategory: 'appliances' },
    });

    const ananyaSession: CustomerSession = {
      customerId: ananyaId,
      speakerId: 'spk-ananya',
      conversationId: `conv-${ananyaId}`,
      name: 'Ananya Roy',
      role: 'Smart Living Architect',
      company: 'Modern Living Residences',
      status: 'waiting',
      storeId: 'store-bangalore',
      category: 'appliances',
      passport: ananyaPassport,
      transcript: [],
      priority: 3,
      lastInteraction: new Date(Date.now() - 600000).toISOString(),
      pendingActions: ['Check LG InstaView bundle discount'],
    };
    this.sessions.set(ananyaId, ananyaSession);
  }

  public getActiveSession(): CustomerSession {
    const active = this.sessions.get(this.activeCustomerId);
    if (active) return active;
    const first = Array.from(this.sessions.values())[0];
    this.activeCustomerId = first.customerId;
    first.status = 'active';
    return first;
  }

  public getSession(customerId: string): CustomerSession | undefined {
    return this.sessions.get(customerId);
  }

  public getAllSessions(): CustomerSession[] {
    return Array.from(this.sessions.values());
  }

  public createSession(
    customerId: string,
    name: string,
    category: string = 'laptops',
    storeId: string = 'store-mumbai',
    makeActive: boolean = true
  ): CustomerSession {
    const passport = createInitialPassport(customerId, `sess-${customerId}`, name, category, storeId);
    const session: CustomerSession = {
      customerId,
      speakerId: `spk-${customerId}`,
      conversationId: `conv-${customerId}`,
      name,
      role: 'Customer',
      company: 'Individual',
      status: makeActive ? 'active' : 'waiting',
      storeId,
      category,
      passport,
      transcript: [],
      priority: 1,
      lastInteraction: new Date().toISOString(),
      pendingActions: [],
    };

    globalCommerceRepository.upsertCustomer({ id: customerId, name });
    this.sessions.set(customerId, session);

    if (makeActive) {
      const prev = this.sessions.get(this.activeCustomerId);
      if (prev && prev.customerId !== customerId) {
        prev.status = 'waiting';
      }
      this.activeCustomerId = customerId;
    }

    return session;
  }

  public switchActiveCustomer(targetCustomerId: string): {
    success: boolean;
    session?: CustomerSession;
    resumeSpeech?: string;
  } {
    const target = this.sessions.get(targetCustomerId);
    if (!target) return { success: false };

    // Set current active to waiting
    const current = this.sessions.get(this.activeCustomerId);
    if (current && current.customerId !== targetCustomerId) {
      current.status = 'waiting';
      current.lastInteraction = new Date().toISOString();
    }

    this.activeCustomerId = targetCustomerId;
    target.status = 'active';
    target.lastInteraction = new Date().toISOString();

    // Query persistent memory for contextual greeting
    const memories = globalCommerceRepository.getMemoriesByCustomer(targetCustomerId);
    const memoryHighlight =
      memories.length > 0 ? ` We were previously looking at: "${memories[0].fact}"` : '';

    const resumeSpeech = `Welcome back, ${target.name}!${memoryHighlight} How can I assist you with your ${target.category} evaluation right now?`;

    return {
      success: true,
      session: target,
      resumeSpeech,
    };
  }

  /**
   * Speaker Arbitration with Priority Lock (Sections 18, 19, and 31)
   * Prevents cross-customer confusion when another person interjects
   */
  public arbitrateTurn(
    incomingSpeakerName?: string,
    incomingSpeakerId?: string,
    utterance: string = ''
  ): {
    isActiveCustomer: boolean;
    activeSession: CustomerSession;
    interrupterSession?: CustomerSession;
    deferralSpeech?: string;
    isUrgentInterruption: boolean;
  } {
    const active = this.getActiveSession();

    // Check if speaker name is explicitly different from active customer
    const isDifferentSpeaker =
      incomingSpeakerName &&
      !active.name.toLowerCase().includes(incomingSpeakerName.toLowerCase()) &&
      !incomingSpeakerName.toLowerCase().includes(active.name.split(' ')[0].toLowerCase());

    if (isDifferentSpeaker) {
      // Check urgency of interrupter speech
      const lower = utterance.toLowerCase();
      const isUrgent =
        lower.includes('emergency') ||
        lower.includes('fire') ||
        lower.includes('urgent') ||
        lower.includes('stop right now');

      // Find or create interrupter session
      let interrupter = Array.from(this.sessions.values()).find((s) =>
        s.name.toLowerCase().includes(incomingSpeakerName!.toLowerCase())
      );

      if (!interrupter) {
        const newId = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        interrupter = this.createSession(newId, incomingSpeakerName!, 'laptops', 'store-mumbai', false);
        interrupter.status = 'queued';
      } else {
        interrupter.status = 'queued';
        interrupter.lastInteraction = new Date().toISOString();
      }

      const firstNameActive = active.name.split(' ')[0];
      const firstNameInterrupter = incomingSpeakerName!.split(' ')[0];

      const deferralSpeech = isUrgent
        ? `I understand this is urgent, ${firstNameInterrupter}. Let me pause with ${firstNameActive} right away.`
        : `Yep, I heard you ${firstNameInterrupter}! Give me just one quick moment—let me finish answering ${firstNameActive}'s question first so she gets taken care of, and I'll be right over to assist you next!`;

      return {
        isActiveCustomer: false,
        activeSession: active,
        interrupterSession: interrupter,
        deferralSpeech,
        isUrgentInterruption: isUrgent,
      };
    }

    return {
      isActiveCustomer: true,
      activeSession: active,
      isUrgentInterruption: false,
    };
  }

  /**
   * Strictly verify customer data isolation (Security Check - Section 32)
   * Guarantees Customer A cannot access Customer B's records
   */
  public verifyCustomerIsolation(
    requestingCustomerId: string,
    targetDataCustomerId: string
  ): boolean {
    return requestingCustomerId === targetDataCustomerId;
  }
}

export const customerSessionManager = new CustomerSessionManager();
// Alias for backward compatibility with existing server imports
export const multiCustomerManager = customerSessionManager;
