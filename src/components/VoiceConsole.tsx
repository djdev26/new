import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  UserCheck,
  Calendar,
  Send,
  Volume2,
  AlertTriangle,
  Radio,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { VoiceCallState } from '../types/salespilot';

interface VoiceConsoleProps {
  callState: VoiceCallState;
  isMuted: boolean;
  audioLevel: number;
  statusMessage: string;
  errorMessage: string | null;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onSubmitUtterance: (text: string) => void;
  onTriggerHumanTransfer: () => void;
  onTriggerBookDemo: () => void;
  isProcessing: boolean;
}

export const VoiceConsole: React.FC<VoiceConsoleProps> = ({
  callState,
  isMuted,
  audioLevel,
  statusMessage,
  errorMessage,
  onStartCall,
  onEndCall,
  onToggleMute,
  onSubmitUtterance,
  onTriggerHumanTransfer,
  onTriggerBookDemo,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSubmitUtterance(inputText.trim());
    setInputText('');
  };

  // State badge styling
  const getStateBadge = () => {
    switch (callState) {
      case 'listening':
        return {
          label: 'Customer is Speaking / Listening',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500 animate-pulse',
        };
      case 'thinking':
        return {
          label: 'AI Reasoning & CustomerState Sync',
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          dot: 'bg-indigo-500 animate-spin',
        };
      case 'speaking':
        return {
          label: 'SalesPilot AI Speaking (Turn-Taking Active)',
          bg: 'bg-indigo-100 border-indigo-300 text-indigo-800',
          dot: 'bg-indigo-600 animate-ping',
        };
      case 'interrupted':
        return {
          label: 'Barge-In Interruption Detected! (TTS Cut Off)',
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500 animate-bounce',
        };
      case 'connecting':
        return {
          label: 'Connecting to Agora RTC Voice Channel...',
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'ended':
        return {
          label: 'Call Disconnected',
          bg: 'bg-slate-100 border-slate-200 text-slate-600',
          dot: 'bg-slate-400',
        };
      default:
        return {
          label: 'Standby / Ready to Initiate Voice Call',
          bg: 'bg-slate-100 border-slate-200 text-slate-600',
          dot: 'bg-slate-400',
        };
    }
  };

  const badge = getStateBadge();
  const isActive = callState !== 'idle' && callState !== 'ended';

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Live Voice Sales Console
              <span className="text-[10px] font-mono text-indigo-600 border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
                Agora RTC & Web Speech
              </span>
            </h3>
            <p className="text-xs text-slate-500">Real-time bi-directional voice with instant interruption</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badge.bg}`}>
          <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Waveform & Audio Reactive Visualizer */}
      <div className="relative my-5 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/90 p-6 overflow-hidden">
        {/* Ambient pulse */}
        {isActive && (
          <div
            className="absolute h-32 w-32 rounded-full bg-indigo-400/15 blur-2xl transition-all duration-300"
            style={{ transform: `scale(${1 + audioLevel / 60})` }}
          />
        )}

        <div className="relative z-10 flex items-center justify-center gap-1.5 h-16 w-full max-w-md">
          {/* Animated sound wave bars */}
          {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 4, 2, 1, 3, 4, 5, 3, 2, 1].map((val, idx) => {
            const dynamicHeight = isActive
              ? Math.max(6, Math.min(54, (val * 8) + (audioLevel * 0.4) * (idx % 2 === 0 ? 1 : 0.7)))
              : 6;

            const isSpeakingState = callState === 'speaking';
            const isListeningState = callState === 'listening';

            return (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeakingState
                    ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-xs'
                    : isListeningState
                    ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-xs'
                    : callState === 'interrupted'
                    ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                    : 'bg-slate-300'
                }`}
                style={{ height: `${dynamicHeight}px` }}
              />
            );
          })}
        </div>

        <p className="mt-3 text-xs text-slate-500 font-medium text-center">
          {statusMessage}
        </p>

        {errorMessage && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Call Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
        <div className="flex items-center gap-2">
          {!isActive ? (
            <button
              onClick={onStartCall}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Start Voice Call</span>
            </button>
          ) : (
            <button
              onClick={onEndCall}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>End Call</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            disabled={!isActive}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              isMuted
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerHumanTransfer}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          >
            <UserCheck className="h-3.5 w-3.5 text-indigo-300" />
            <span>Human Transfer</span>
          </button>
          <button
            onClick={onTriggerBookDemo}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5 text-indigo-600" />
            <span>Lock Demo</span>
          </button>
        </div>
      </div>

      {/* Manual Utterance Input Bar */}
      <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type customer utterance (e.g. 'Can we get 100 users for 20% less?')..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs shadow-indigo-100"
        >
          {isProcessing ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
