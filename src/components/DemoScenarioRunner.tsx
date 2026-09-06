import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ChevronRight, X, FastForward, RotateCcw } from 'lucide-react';

export interface DemoStep {
  id: number;
  label: string;
  utterance: string;
  expectedOutcome: string;
  forceInterruption?: boolean;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    label: 'Pricing Question for 50 Reps',
    utterance: "Hi, what's your pricing for 50 sales reps on your Growth tier?",
    expectedOutcome: 'Quotes 50 seats with Growth tier volume discount band (₹2,499/seat list). Updates user_count to 50.',
  },
  {
    id: 2,
    label: 'Interruption & Competitor Concern',
    utterance: "Wait, Competitor X offers this for 20% cheaper, why should I pay you?",
    expectedOutcome: 'Cuts off AI speech immediately (Interrupted flag). RAG pulls competitor benchmark matrix defending sub-350ms latency.',
    forceInterruption: true,
  },
  {
    id: 3,
    label: 'User Count Change: 50 → 100 Users',
    utterance: "Actually, our enterprise is expanding. What if we need 100 users instead?",
    expectedOutcome: 'Updates seat requirement to 100. Product shifts to Enterprise Custom, volume discount increases to 30%.',
  },
  {
    id: 4,
    label: 'Implementation Timeline Objection',
    utterance: "We need this rolled out in 2 weeks, is that realistic?",
    expectedOutcome: 'Detects timing objection. Reassures with 10-day fast-track SLA. Qualification score rises.',
  },
  {
    id: 5,
    label: 'Enterprise Demo Request & Booking',
    utterance: "That works. Can we book an enterprise demo for next Tuesday with your solutions architect?",
    expectedOutcome: 'High intent triggers "Book Demo" recommendation. Stage updates to "Demo Requested" → "Demo Booked".',
  },
];

interface DemoScenarioRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  isRunning: boolean;
  onExecuteStep: (step: DemoStep) => Promise<void>;
  onAutoPlayAll: () => Promise<void>;
  onResetDemo: () => void;
}

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({
  isOpen,
  onClose,
  currentStepIndex,
  isRunning,
  onExecuteStep,
  onAutoPlayAll,
  onResetDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white bg-white/95 backdrop-blur-xl p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Evaluator Demo Scenario Runner
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Real Pipeline Execution
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Executes the official 5-step sequence through the genuine AI reasoning & state engine
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 my-4 max-h-[340px] overflow-y-auto pr-1">
          {DEMO_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start justify-between rounded-xl border p-3 text-xs transition-all ${
                  isCurrent
                    ? 'border-emerald-400 bg-emerald-50/70 ring-1 ring-emerald-300 shadow-sm'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/80 text-slate-600'
                    : 'border-slate-200/80 bg-white/80 text-slate-500'
                }`}
              >
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-3 w-3 text-emerald-700" /> : step.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{step.label}</span>
                      {step.forceInterruption && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 border border-amber-200">
                          Simulates Barge-In
                        </span>
                      )}
                    </div>
                    <p className="text-indigo-700 font-mono text-[11px] mt-1 italic">
                      "{step.utterance}"
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      → Outcome: {step.expectedOutcome}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onExecuteStep(step)}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 disabled:opacity-50'
                  }`}
                >
                  {isCurrent ? 'Run Step' : 'Execute'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-4">
          <button
            onClick={onResetDemo}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo State</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onAutoPlayAll}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm active:scale-95 disabled:opacity-50 transition-all"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>{isRunning ? 'Running All Steps...' : 'Auto-Play Complete Scenario'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
