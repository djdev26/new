import React from 'react';
import { Bot, Play, Mic, BarChart3, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { SalesStage } from '../types/salespilot';

interface NavbarProps {
  activeTab: 'dashboard' | 'analytics' | 'rules';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'rules') => void;
  onRunDemoScenario: () => void;
  isScenarioRunning: boolean;
  currentStage: SalesStage;
  leadScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunDemoScenario,
  isScenarioRunning,
  currentStage,
  leadScore,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">SalesPilot<span className="text-indigo-600">AI</span></span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Agent Active
              </span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 leading-none hidden sm:block">Team AlphaSeekers</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-200/50 p-1 border border-slate-200/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Voice Console</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition-all ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Explainable AI</span>
          </button>
        </div>

        {/* Live Deal Badge & Demo Runner Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Deal Readiness:</span>
            <span className={`text-xs font-bold ${
              leadScore >= 75 ? 'text-emerald-600' : leadScore >= 50 ? 'text-amber-600' : 'text-slate-700'
            }`}>
              {leadScore}/100
            </span>
          </div>

          <button
            onClick={onRunDemoScenario}
            disabled={isScenarioRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
              isScenarioRunning
                ? 'bg-slate-700 text-white cursor-wait'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
            }`}
          >
            {isScenarioRunning ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin text-indigo-300" />
                <span>Running Scenario...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white text-white" />
                <span>Run Demo Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
