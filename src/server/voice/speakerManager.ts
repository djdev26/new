export type SpeakerType = 'unknown' | 'known_customer' | 'returning_customer' | 'interrupter';

export interface SpeakerProfile {
  speakerId: string;
  name: string;
  confidence: number; // 0.0 to 1.0
  type: SpeakerType;
  turnCount: number;
  lastSpokeAt: string;
}

export interface SpeakerIdentificationResult {
  speaker: SpeakerProfile;
  requiresClarification: boolean;
  clarificationPrompt?: string;
}

export class SpeakerManager {
  private speakers: Map<string, SpeakerProfile> = new Map();
  private activeSpeakerId: string | null = null;
  private speakerHistory: Array<{ speakerId: string; timestamp: string }> = [];

  constructor() {
    this.registerSpeaker('spk-priya', 'Priya Sharma', 0.95, 'known_customer');
    this.registerSpeaker('spk-rahul', 'Rahul Verma', 0.9, 'known_customer');
    this.registerSpeaker('spk-ananya', 'Ananya Roy', 0.9, 'known_customer');
    this.activeSpeakerId = 'spk-priya';
  }

  public registerSpeaker(
    speakerId: string,
    name: string,
    confidence: number = 0.85,
    type: SpeakerType = 'known_customer'
  ): SpeakerProfile {
    const profile: SpeakerProfile = {
      speakerId,
      name,
      confidence,
      type,
      turnCount: 0,
      lastSpokeAt: new Date().toISOString(),
    };
    this.speakers.set(speakerId, profile);
    return profile;
  }

  public identifySpeaker(
    claimedName?: string,
    claimedSpeakerId?: string,
    providerConfidence?: number
  ): SpeakerIdentificationResult {
    const now = new Date().toISOString();

    // 1. If provider confidence is provided and very low (< 0.5)
    if (providerConfidence !== undefined && providerConfidence < 0.5) {
      return {
        speaker: {
          speakerId: claimedSpeakerId || 'spk-unknown',
          name: claimedName || 'Unknown Speaker',
          confidence: providerConfidence,
          type: 'unknown',
          turnCount: 1,
          lastSpokeAt: now,
        },
        requiresClarification: true,
        clarificationPrompt: 'Sorry, was that you speaking or someone else with you?',
      };
    }

    // 2. If claimed speaker ID matches an existing profile
    if (claimedSpeakerId && this.speakers.has(claimedSpeakerId)) {
      const profile = this.speakers.get(claimedSpeakerId)!;
      profile.turnCount += 1;
      profile.lastSpokeAt = now;
      this.activeSpeakerId = profile.speakerId;
      this.speakerHistory.push({ speakerId: profile.speakerId, timestamp: now });
      return { speaker: profile, requiresClarification: false };
    }

    // 3. If claimed name matches a known speaker
    if (claimedName) {
      const match = Array.from(this.speakers.values()).find((s) =>
        s.name.toLowerCase().includes(claimedName.toLowerCase())
      );
      if (match) {
        match.turnCount += 1;
        match.lastSpokeAt = now;
        this.activeSpeakerId = match.speakerId;
        this.speakerHistory.push({ speakerId: match.speakerId, timestamp: now });
        return { speaker: match, requiresClarification: false };
      }
    }

    // 4. Default: fallback to active speaker or create unknown
    if (this.activeSpeakerId && this.speakers.has(this.activeSpeakerId) && !claimedName) {
      const active = this.speakers.get(this.activeSpeakerId)!;
      active.turnCount += 1;
      active.lastSpokeAt = now;
      this.speakerHistory.push({ speakerId: active.speakerId, timestamp: now });
      return { speaker: active, requiresClarification: false };
    }

    // Unknown speaker
    const newId = claimedSpeakerId || `spk-${Date.now()}`;
    const newProfile = this.registerSpeaker(
      newId,
      claimedName || 'Guest Speaker',
      0.65,
      claimedName ? 'known_customer' : 'unknown'
    );
    this.activeSpeakerId = newId;
    this.speakerHistory.push({ speakerId: newId, timestamp: now });

    return {
      speaker: newProfile,
      requiresClarification: !claimedName,
      clarificationPrompt: !claimedName ? 'Hey there! Could you tell me your name so I can address you properly?' : undefined,
    };
  }

  public getActiveSpeaker(): SpeakerProfile | undefined {
    return this.activeSpeakerId ? this.speakers.get(this.activeSpeakerId) : undefined;
  }

  public getSpeakerHistory(): Array<{ speakerId: string; timestamp: string }> {
    return this.speakerHistory;
  }
}

export const speakerManager = new SpeakerManager();
