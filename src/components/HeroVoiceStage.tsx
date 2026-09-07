import React, { useState } from "react";
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Radio,
  Volume2,
  Sparkles,
  Send,
  Zap,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { VoiceCallState } from "../types/salespilot";

interface HeroVoiceStageProps {
  callState: VoiceCallState;
  isMuted: boolean;
  audioLevel: number;
  statusMessage: string;
  errorMessage: string | null;
  isAwaitingGesture: boolean;
  liveInterimTranscript: string;
  activeAISpeech: string;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onSubmitUtterance: (text: string) => void;
  isProcessing: boolean;
  currentCustomerName: string;
}

export const HeroVoiceStage: React.FC<HeroVoiceStageProps> = ({
  callState,
  isMuted,
  audioLevel,
  statusMessage,
  errorMessage,
  isAwaitingGesture,
  liveInterimTranscript,
  activeAISpeech,
  onStartCall,
  onEndCall,
  onToggleMute,
  onSubmitUtterance,
  isProcessing,
  currentCustomerName,
}) => {
  const [typedText, setTypedText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || isProcessing) return;
    onSubmitUtterance(typedText.trim());
    setTypedText("");
  };

  const handleQuickPrompt = (prompt: string) => {
    onSubmitUtterance(prompt);
  };

  const isActive = callState === "speaking" || callState === "listening" || callState === "thinking" || callState === "interrupted";

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-b from-slate-900 via-indigo-950/95 to-slate-900 text-white shadow-2xl shadow-indigo-950/40 p-6 md:p-8 transition-all">
      {/* Ambient glowing backdrop pulses to live audio */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl transition-transform duration-200"
        style={{ transform: `translate(-50%, 0) scale(${1 + audioLevel / 50})` }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl transition-transform duration-200"
        style={{ transform: `scale(${1 + audioLevel / 70})` }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <Radio className="h-6 w-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                SalesPilot Real-Time Voice Host
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Live Showroom Agent
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Auto-Mic Live Stream &bull; Full-Duplex Sub-Second Voice &bull; Instant 18ms Barge-In
            </p>
          </div>
        </div>

        {/* Status indicator & Voice Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                callState === "speaking"
                  ? "bg-cyan-400 animate-ping"
                  : callState === "listening"
                  ? "bg-emerald-400 animate-pulse"
                  : callState === "interrupted"
                  ? "bg-amber-400 animate-bounce"
                  : callState === "connecting"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-bold capitalize text-slate-200">
              {callState === "speaking"
                ? "AI Host Speaking"
                : callState === "listening"
                ? "Listening to You"
                : callState === "interrupted"
                ? "Barge-In Handover"
                : callState === "thinking"
                ? "AI Reasoning..."
                : callState === "connecting"
                ? "Connecting Mic..."
                : "Voice Ready"}
            </span>
          </div>

          {isActive ? (
            <>
              <button
                onClick={onToggleMute}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isMuted
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                    : "bg-white/10 text-white border border-white/15 hover:bg-white/15"
                }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMuted ? <MicOff className="h-3.5 w-3.5 text-amber-400" /> : <Mic className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isMuted ? "Muted" : "Mic On"}</span>
              </button>

              <button
                onClick={onEndCall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30 active:scale-95 transition-all"
              >
                <PhoneOff className="h-3.5 w-3.5 text-rose-400" />
                <span>Pause</span>
              </button>
            </>
          ) : (
            <button
              onClick={onStartCall}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Connect Voice Host</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative z-10 py-5">
        {isAwaitingGesture && !isActive ? (
          /* Prominent Invitation Card if browser blocked initial autoplay without gesture */
          <div
            onClick={onStartCall}
            className="group cursor-pointer rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 p-6 md:p-8 backdrop-blur-md hover:border-cyan-400 transition-all text-center space-y-4 shadow-xl shadow-cyan-950/40"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 group-hover:scale-110 transition-transform">
              <Mic className="h-8 w-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                👋 Welcome to SalesPilot! Tap Anywhere to Speak with Your AI Host
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                Click here or tap anywhere to allow microphone access. The AI will greet you, ask for your name, and show you around our sports and appliance showrooms!
              </p>
            </div>
            <button
              onClick={onStartCall}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-sm text-slate-950 shadow-xl shadow-cyan-500/30 group-hover:bg-cyan-400 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Allow Microphone &amp; Start Live Conversation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Live Waveform Stage & Real-Time Speech Display */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 md:p-6 backdrop-blur-md space-y-4">
              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-14 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 3, 5, 7, 9, 10, 8, 6, 4, 2].map(
                  (val, idx) => {
                    const dynamicHeight = isActive
                      ? Math.max(8, Math.min(52, val * 5 + audioLevel * 0.45 * (idx % 2 === 0 ? 1 : 0.75)))
                      : 6;

                    return (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-100 ${
                          callState === "speaking"
                            ? "bg-gradient-to-t from-cyan-500 via-indigo-400 to-white shadow-cyan-500/50 shadow-sm"
                            : callState === "listening"
                            ? "bg-gradient-to-t from-emerald-500 via-teal-300 to-white shadow-emerald-500/50 shadow-sm"
                            : callState === "interrupted"
                            ? "bg-gradient-to-t from-amber-500 via-yellow-300 to-white"
                            : "bg-slate-700"
                        }`}
                        style={{ height: `${dynamicHeight}px` }}
                      />
                    );
                  }
                )}
              </div>

              {/* Status Message / Telemetry */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>{statusMessage}</span>
              </div>

              {/* Speech Output Bubbles */}
              {activeAISpeech && (
                <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Host Speaking Aloud:</span>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-white leading-relaxed">
                    &ldquo;{activeAISpeech}&rdquo;
                  </p>
                </div>
              )}

              {/* Live Customer Speech Transcription */}
              {liveInterimTranscript && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Mic className="h-3.5 w-3.5" />
                    <span>Hearing You:</span>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-white">
                    &ldquo;{liveInterimTranscript}&rdquo;
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Quick Natural Voice Prompts */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tap or speak naturally to your AI Host:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hi, my name is Alex! Show me the electric superbike",
                  "What is the top speed and range of Apex Veloce 800?",
                  "Switch to smart appliances showroom",
                  "Can you compare the superbike with Ducati?",
                  "Can I get an executive discount if I buy today?",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 hover:border-cyan-400/40 transition-all text-left"
                  >
                    <MessageSquare className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span>&ldquo;{prompt}&rdquo;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Typed Input Form (Accessibility & Quiet Rooms) */}
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Or type anything here (e.g. 'My name is Sarah, looking for a high-range bike')..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-xs md:text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={!typedText.trim() || isProcessing}
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-md hover:bg-cyan-400 disabled:opacity-40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
