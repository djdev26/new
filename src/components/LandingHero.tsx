import React from 'react';
import { Mic, ArrowRight, Brain, Database, Target, Calendar, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface LandingHeroProps {
  onStartLiveDemo: () => void;
  onRunDemoScenario: () => void;
  isScenarioRunning: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartLiveDemo,
  onRunDemoScenario,
  isScenarioRunning,
  collapsed,
  onToggleCollapse,
}) => {
  if (collapsed) {
    return (
      <div className="border-b border-slate-200/80 bg-white/50 backdrop-blur-md px-4 py-2 text-slate-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Pipeline: Customer Voice → Agora RTC → AI Reasoning → Memory → Next-Best-Action → CRM
            </span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <span>Show Pipeline Overview</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const pipelineSteps = [
    { title: 'Customer Voice', icon: Mic, desc: 'Sub-350ms streaming' },
    { title: 'Agora RTC', icon: Sparkles, desc: 'Real-time audio edge' },
    { title: 'AI Engine', icon: Brain, desc: 'LLM + Fallback reasoning' },
    { title: 'Memory', icon: Database, desc: 'Factual delta bullets' },
    { title: 'Intent & Objection', icon: Target, desc: 'Category & severity' },
    { title: 'Next-Best-Action', icon: ArrowRight, desc: 'Explainable strategy' },
    { title: 'CRM & Calendar', icon: Calendar, desc: 'Live booking & sync' },
    { title: 'Business Outcome', icon: CheckCircle2, desc: 'High conversion' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white/40 backdrop-blur-md pt-8 pb-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-indigo-200/30 blur-[90px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-bold text-indigo-700 mb-3 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
              Adaptive AI Sales & Negotiation Agent (Track: Team AlphaSeekers)
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Sales conversations should <span className="text-indigo-600">adapt in real time.</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Every conversation adapts. Every lead moves forward. A real-time voice sales agent that behaves like a top-performing human rep—reasoning over evolving state, handling mid-sentence interruptions, and dynamically calculating volume quotes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartLiveDemo}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Mic className="h-4 w-4" />
              <span>Try Live Voice Demo</span>
            </button>
            <button
              onClick={onRunDemoScenario}
              disabled={isScenarioRunning}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-indigo-300" />
              <span>Run Scripted Scenario (5 Steps)</span>
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80"
              title="Minimize Header"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real-time Architecture Pipeline Graphic */}
        <div className="mt-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Architecture Pipeline: Listen → Understand → Remember → Reason → Adapt → Act
            </span>
            <span className="text-[11px] font-mono text-indigo-600 font-bold">Sub-350ms turn-taking</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative flex flex-col items-center text-center p-3 rounded-xl border border-slate-200/80 bg-white/90 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all shadow-xs"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{step.title}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{step.desc}</span>

                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
