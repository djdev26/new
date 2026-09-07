import { CustomerState } from '../types/salespilot';
import { getInitialCustomerState } from './customerStateEngine';

export interface CustomerSession {
  id: string;
  name: string;
  role: string;
  company: string;
  status: 'active' | 'waiting' | 'completed';
  lastUtterance?: string;
  state: CustomerState;
  createdAt: string;
  lastActive: string;
  memorySnippet?: string;
}

class MultiCustomerManager {
  private sessions: Map<string, CustomerSession> = new Map();
  private activeSessionId: string = 'cust-priya';

  constructor() {
    this.initDefaultSessions();
  }

  private initDefaultSessions() {
    // Customer A (Active Primary)
    const priyaState = getInitialCustomerState('cust-priya');
    priyaState.customer_profile = {
      name: 'Priya Sharma',
      company: 'ApexScale Corp',
      role: 'VP of Engineering',
      decision_maker: true,
    };
    priyaState.product_interest = 'Next-Gen Neural Laptops';
    priyaState.user_count = 15;
    priyaState.qualification_score = 75;

    this.sessions.set('cust-priya', {
      id: 'cust-priya',
      name: 'Priya Sharma',
      role: 'VP of Engineering',
      company: 'ApexScale Corp',
      status: 'active',
      state: priyaState,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      lastActive: new Date().toISOString(),
      memorySnippet: 'Evaluating Dell XPS 16 vs MacBook Pro 16 for engineering team; prioritizes battery life and NPU.',
    });

    // Customer B (Waiting in queue)
    const rahulState = getInitialCustomerState('cust-rahul');
    rahulState.customer_profile = {
      name: 'Rahul Verma',
      company: 'Velocity Logistics',
      role: 'Fleet Operations Director',
      decision_maker: true,
    };
    rahulState.product_interest = 'Performance Sports Cars & Luxury SUVs';
    rahulState.user_count = 3;
    rahulState.qualification_score = 65;

    this.sessions.set('cust-rahul', {
      id: 'cust-rahul',
      name: 'Rahul Verma',
      role: 'Fleet Operations Director',
      company: 'Velocity Logistics',
      status: 'waiting',
      state: rahulState,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      lastActive: new Date(Date.now() - 2 * 60000).toISOString(),
      memorySnippet: 'Interested in Porsche 911 Carrera and Land Rover Range Rover SV for executive fleet.',
    });

    // Customer C (Waiting in queue)
    const ananyaState = getInitialCustomerState('cust-ananya');
    ananyaState.customer_profile = {
      name: 'Ananya Roy',
      company: 'Modern Living Residences',
      role: 'Smart Living Architect',
      decision_maker: true,
    };
    ananyaState.product_interest = 'Connected Kitchen Hub & Smart Appliances';
    ananyaState.user_count = 8;
    ananyaState.qualification_score = 70;

    this.sessions.set('cust-ananya', {
      id: 'cust-ananya',
      name: 'Ananya Roy',
      role: 'Smart Living Architect',
      company: 'Modern Living Residences',
      status: 'waiting',
      state: ananyaState,
      createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
      lastActive: new Date(Date.now() - 1 * 60000).toISOString(),
      memorySnippet: 'Wants 630L LG InstaView and Dyson Air Purifier bundle for luxury penthouses.',
    });
  }

  public getActiveSession(): CustomerSession {
    const active = this.sessions.get(this.activeSessionId);
    if (active) return active;
    const first = Array.from(this.sessions.values())[0];
    this.activeSessionId = first.id;
    first.status = 'active';
    return first;
  }

  public getAllSessions(): CustomerSession[] {
    return Array.from(this.sessions.values());
  }

  public setActiveSession(id: string): { success: boolean; session?: CustomerSession; resumePrompt?: string } {
    const target = this.sessions.get(id);
    if (!target) return { success: false };

    // Set old active to waiting
    const currentActive = this.sessions.get(this.activeSessionId);
    if (currentActive && currentActive.id !== id) {
      currentActive.status = 'waiting';
    }

    this.activeSessionId = id;
    target.status = 'active';
    target.lastActive = new Date().toISOString();

    const resumePrompt = `Welcome back, ${target.name}! We were looking at ${target.state.product_interest} (${target.memorySnippet || 'your requirements'}). How can I help take this forward for you?`;

    return { success: true, session: target, resumePrompt };
  }

  // Check if incoming utterance is from active customer or an interrupter
  public arbitrateIncomingSpeaker(speakerName?: string, speakerId?: string): {
    isActiveCustomer: boolean;
    activeSession: CustomerSession;
    interrupterSession?: CustomerSession;
    deferralSpeech?: string;
  } {
    const active = this.getActiveSession();

    // If speaker name is provided and doesn't match active customer
    if (
      speakerName &&
      !active.name.toLowerCase().includes(speakerName.toLowerCase()) &&
      !speakerName.toLowerCase().includes(active.name.split(' ')[0].toLowerCase())
    ) {
      // Find or create interrupter session
      let interrupter = Array.from(this.sessions.values()).find((s) =>
        s.name.toLowerCase().includes(speakerName.toLowerCase())
      );

      if (!interrupter) {
        const newId = `cust-${Date.now()}`;
        const newState = getInitialCustomerState(newId);
        newState.customer_profile.name = speakerName;
        interrupter = {
          id: newId,
          name: speakerName,
          role: 'Client',
          company: 'Inbound Evaluation',
          status: 'waiting',
          state: newState,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        };
        this.sessions.set(newId, interrupter);
      } else {
        interrupter.status = 'waiting';
        interrupter.lastActive = new Date().toISOString();
      }

      const deferralSpeech = `Hey ${speakerName}! Give me just one quick minute—let me finish answering ${active.name.split(' ')[0]}'s question first so she gets taken care of, and I will be right over to assist you next!`;

      return {
        isActiveCustomer: false,
        activeSession: active,
        interrupterSession: interrupter,
        deferralSpeech,
      };
    }

    return {
      isActiveCustomer: true,
      activeSession: active,
    };
  }
}

export const multiCustomerManager = new MultiCustomerManager();
