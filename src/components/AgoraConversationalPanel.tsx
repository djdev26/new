import React, { useState } from 'react';
import {
  Mic,
  Cpu,
  Volume2,
  Radio,
  Zap,
  Clock,
  ShieldCheck,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Sparkles,
  Gift,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { AgoraPipelineConfig, AgoraPipelineMode } from '../types/salespilot';

interface AgoraConversationalPanelProps {
  pipelineConfig: AgoraPipelineConfig;
  onUpdateMode: (mode: AgoraPipelineMode) => void;
  isInterrupted?: boolean;
  isAiSpeaking?: boolean;
  isListening?: boolean;
}

export const AgoraConversationalPanel: React.FC<AgoraConversationalPanelProps> = ({
  pipelineConfig,
  onUpdateMode,
  isInterrupted = false,
  isAiSpeaking = false,
  isListening = false,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'byok' | 'resources'>('pipeline');
  const [byokKey, setByokKey] = useState('');
  const [selectedLlm, setSelectedLlm] = useState(pipelineConfig.llmProvider);

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Agora Real-Time Voice AI Pipeline
              </h3>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Akshay Nandwana · Agora Dev Session
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Full-Duplex Conversational Engine with Instant Interruption (Barge-In) & Sub-350ms Turnaround
            </p>
          </div>
        </div>

        {/* 300 Free Minutes Counter */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 shadow-2xs">
          <Gift className="h-4 w-4 text-emerald-600" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Free Agora Minutes</div>
            <div className="text-xs font-black text-emerald-700">
              {pipelineConfig.freeMinutesRemaining} / 300 mins available
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-3 border-b border-slate-200/70 pb-2">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'pipeline'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Live Pipeline Telemetry
        </button>
        <button
          onClick={() => setActiveTab('byok')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'byok'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Agora-Managed vs BYOK
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'resources'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Official Resources & Recipes
        </button>

        {/* Live Barge-In Detection Status Pill */}
        <div className="ml-auto flex items-center gap-1.5">
          {isInterrupted ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-bounce">
              <Zap className="h-3 w-3 text-rose-600" />
              Barge-In Interruption Detected (Audio Cut)
            </span>
          ) : isAiSpeaking ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Volume2 className="h-3 w-3 text-indigo-600" />
              Speaking via Agora SD-RTN
            </span>
          ) : isListening ? (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Mic className="h-3 w-3 text-emerald-600 animate-pulse" />
              Mic Listening for Turn
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-400">Idle / Ready</span>
          )}
        </div>
      </div>

      {/* Tab 1: Live Pipeline Steps (Mic -> STT -> LLM -> TTS -> RTC) */}
      {activeTab === 'pipeline' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            {/* Step 1: Mic & Audio Stream */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Mic className="h-3.5 w-3.5 text-indigo-600" /> Mic Input
                </span>
                <span className="font-mono text-[10px] text-indigo-600 font-bold">AEC/NS</span>
              </div>
              <div className="font-extrabold text-slate-900">Agora RTC Mic</div>
              <div className="text-[10px] text-slate-500 mt-0.5">16kHz PCM Stream</div>
              <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                ~10ms Capture
              </div>
            </div>

            {/* Step 2: STT Speech-To-Text */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5 text-blue-600" /> STT Engine
                </span>
                <span className="font-mono text-[10px] text-blue-600 font-bold">WebSocket</span>
              </div>
              <div className="font-extrabold text-slate-900">{pipelineConfig.sttProvider}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Streaming Audio Chunks</div>
              <div className="mt-2 text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                ~{pipelineConfig.latencyMetrics.sttMs}ms Latency
              </div>
            </div>

            {/* Step 3: LLM Reasoning */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-indigo-600" /> LLM Reasoner
                </span>
                <span className="font-mono text-[10px] text-indigo-600 font-bold">Tools</span>
              </div>
              <div className="font-extrabold text-slate-900">{pipelineConfig.llmProvider}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Showroom & Price Agent</div>
              <div className="mt-2 text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded inline-block">
                ~{pipelineConfig.latencyMetrics.llmMs}ms TTFT
              </div>
            </div>

            {/* Step 4: TTS Speech Synthesis */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5 text-purple-600" /> TTS Voice
                </span>
                <span className="font-mono text-[10px] text-purple-600 font-bold">Stream</span>
              </div>
              <div className="font-extrabold text-slate-900">{pipelineConfig.ttsProvider}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Natural Sales Persona</div>
              <div className="mt-2 text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded inline-block">
                ~{pipelineConfig.latencyMetrics.ttsMs}ms Synthesis
              </div>
            </div>

            {/* Step 5: Voice Response via SD-RTN */}
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] text-indigo-700 mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-600" /> Agora SD-RTN
                </span>
                <span className="font-mono text-[10px] text-emerald-600 font-bold">Live</span>
              </div>
              <div className="font-extrabold text-slate-900">Ultra-Low Latency</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Sub-50ms Interruption Cut</div>
              <div className="mt-2 text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded inline-block border border-emerald-200">
                Total: ~{pipelineConfig.latencyMetrics.totalMs}ms E2E
              </div>
            </div>
          </div>

          {/* Interruption / Barge-In Logic Note */}
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">How Natural Interruption (Barge-In) Works:</strong> When the customer speaks during an active AI response, Agora Voice Activity Detection (VAD) instantly emits an interruption packet. SalesPilot AI immediately halts TTS speech playback, flushes the audio playback buffer, flags the conversational turn with the interruption context, and smoothly answers the customer's new question without awkward collisions.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Agora Managed vs BYOK Option */}
      {activeTab === 'byok' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Option A: Agora Managed */}
            <div
              onClick={() => onUpdateMode('agora_managed')}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                pipelineConfig.mode === 'agora_managed'
                  ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  1. Agora-Managed Models (Recommended)
                </span>
                {pipelineConfig.mode === 'agora_managed' && (
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]">Active</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Zero API keys required! Agora orchestrates Deepgram (STT) + OpenAI (LLM) + MiniMax (TTS) out of the box using your 300 free developer minutes.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-700">
                <div className="p-1.5 rounded bg-white border border-slate-200 text-center">
                  <strong>STT:</strong> Deepgram
                </div>
                <div className="p-1.5 rounded bg-white border border-slate-200 text-center">
                  <strong>LLM:</strong> OpenAI
                </div>
                <div className="p-1.5 rounded bg-white border border-slate-200 text-center">
                  <strong>TTS:</strong> MiniMax
                </div>
              </div>
            </div>

            {/* Option B: BYOK (Bring Your Own Key) */}
            <div
              onClick={() => onUpdateMode('byok')}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                pipelineConfig.mode === 'byok'
                  ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-400'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-purple-600" />
                  2. BYOK — Bring Your Own Key
                </span>
                {pipelineConfig.mode === 'byok' && (
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">Active</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Plug in your own Gemini 2.5 Flash, Claude 3.5 Sonnet, Sarvam Indic Voice, or ElevenLabs keys to experiment with custom models over Agora RTC.
              </p>
              <div className="mt-3 flex gap-2">
                <select
                  value={selectedLlm}
                  onChange={(e) => setSelectedLlm(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                >
                  <option>Gemini 2.5 Flash</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>OpenAI GPT-4o</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Session Links & Resources */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <a
            href="https://x.com/akshay81844/status/2081942770965754230"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
          >
            <div>
              <span className="font-bold text-slate-900 block">Session Public Resource</span>
              <span className="text-[10px] text-slate-500">Akshay Nandwana Dev Post</span>
            </div>
            <ExternalLink className="h-4 w-4 text-indigo-600" />
          </a>

          <a
            href="https://recipes.agora.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
          >
            <div>
              <span className="font-bold text-slate-900 block">Agora Official Recipes</span>
              <span className="text-[10px] text-slate-500">Demos & Community Projects</span>
            </div>
            <ExternalLink className="h-4 w-4 text-indigo-600" />
          </a>

          <a
            href="https://docs.agora.io/en/introduction/start-with-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-2xs"
          >
            <div>
              <span className="font-bold text-slate-900 block">Step-by-Step Setup Guide</span>
              <span className="text-[10px] text-slate-500">Agora Conversational AI Docs</span>
            </div>
            <ExternalLink className="h-4 w-4 text-indigo-600" />
          </a>
        </div>
      )}
    </div>
  );
};
