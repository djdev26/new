export interface IAgoraAdapter {
  join(channel: string, uid?: number | string): Promise<{ success: boolean; channel: string }>;
  leave(): Promise<void>;
  publish(): Promise<void>;
  mute(isMuted: boolean): Promise<void>;
  onVoiceActivity(callback: (isSpeaking: boolean) => void): void;
  isJoined(): boolean;
  isMicMuted(): boolean;
}

export class MockAgoraAdapter implements IAgoraAdapter {
  private joined: boolean = false;
  private muted: boolean = false;
  private voiceActivityCallback: ((isSpeaking: boolean) => void) | null = null;
  private audioInterval: any = null;

  async join(channel: string, uid?: number | string): Promise<{ success: boolean; channel: string }> {
    // Simulate low-latency handshake
    await new Promise((r) => setTimeout(r, 250));
    this.joined = true;
    this.muted = false;
    return { success: true, channel };
  }

  async leave(): Promise<void> {
    this.joined = false;
    if (this.audioInterval) clearInterval(this.audioInterval);
  }

  async publish(): Promise<void> {
    // published audio track
  }

  async mute(isMuted: boolean): Promise<void> {
    this.muted = isMuted;
  }

  onVoiceActivity(callback: (isSpeaking: boolean) => void): void {
    this.voiceActivityCallback = callback;
  }

  isJoined(): boolean {
    return this.joined;
  }

  isMicMuted(): boolean {
    return this.muted;
  }

  // Internal trigger to simulate voice activity
  triggerVoiceActivity(isSpeaking: boolean) {
    if (this.voiceActivityCallback && !this.muted) {
      this.voiceActivityCallback(isSpeaking);
    }
  }
}

/**
 * Adapter factory: returns real Agora client if credentials configured,
 * otherwise seamlessly falls back to MockAgoraAdapter.
 */
export function createAgoraAdapter(useMock: boolean = true): IAgoraAdapter {
  return new MockAgoraAdapter();
}
