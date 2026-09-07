import React from 'react';
import { Users, Lock, Clock, CheckCircle2, UserCheck, AlertCircle, ArrowRight, Play } from 'lucide-react';

export interface CustomerSessionUI {
  id: string;
  name: string;
  role: string;
  company: string;
  status: 'active' | 'waiting' | 'completed';
  memorySnippet?: string;
  state: any;
}

interface MultiCustomerPriorityBarProps {
  sessions: CustomerSessionUI[];
  activeSessionId: string;
  onSwitchSession: (sessionId: string) => void;
  onSimulateInterruption: (interrupterName: string, text: string) => void;
  isProcessing: boolean;
}

export const MultiCustomerPriorityBar: React.FC<MultiCustomerPriorityBarProps> = ({
  sessions,
  activeSessionId,
  onSwitchSession,
  onSimulateInterruption,
  isProcessing,
}) => {
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const waitingSessions = sessions.filter((s) => s.id !== activeSessionId);

  return (
    <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-50 border border-violet-200 text-violet-600">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              Multi-Customer Concurrency & Priority Lock
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.2 font-semibold">
                Live Arbitration
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Section 18 & 19: Independent customer memory pools · Active speaker priority · Zero cross-contamination
            </p>
          </div>
        </div>

        {/* Active Customer Status Badge */}
        {activeSession && (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs text-indigo-900">
            <Lock className="h-3.5 w-3.5 text-indigo-600" />
            <span>
              Active Speaker Lock: <strong className="font-bold">{activeSession.name}</strong> ({activeSession.company})
            </span>
          </div>
        )}
      </div>

      {/* Customer Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sessions.map((s) => {
          const isActive = s.id === activeSessionId;

          return (
            <div
              key={s.id}
              className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-md ring-2 ring-indigo-400/40'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isActive ? 'ACTIVE & LOCKED' : 'WAITING IN QUEUE'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">{s.role} · {s.company}</div>
                <div className="mt-2 text-[11px] text-slate-600 bg-white/90 rounded-xl p-2 border border-slate-200/80">
                  <strong className="text-slate-800">State Memory: </strong>
                  <span>{s.memorySnippet || s.state?.product_interest || 'Inbound prospect'}</span>
                </div>
              </div>

              {/* Actions for this customer session */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                {isActive ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Current Active Dialogue
                  </span>
                ) : (
                  <button
                    onClick={() => onSwitchSession(s.id)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Resume {s.name.split(' ')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Interrupter Simulation Bar */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          <span>Test Multi-Customer Interruption (Active customer never disrupted):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSimulateInterruption('Rahul Verma', 'Hey, can you show me the Porsche 911 right now?')}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
            title="Simulate Rahul interrupting active conversation with Priya"
          >
            <Play className="h-3 w-3 text-amber-600 fill-amber-600" />
            <span>Rahul: "Show me Porsche 911!"</span>
          </button>

          <button
            onClick={() => onSimulateInterruption('Ananya Roy', 'Wait, how much is the LG InstaView refrigerator?')}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
            title="Simulate Ananya interrupting active conversation with Priya"
          >
            <Play className="h-3 w-3 text-indigo-600 fill-indigo-600" />
            <span>Ananya: "Price of InstaView fridge?"</span>
          </button>
        </div>
      </div>
    </div>
  );
};
