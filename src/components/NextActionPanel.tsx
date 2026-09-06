import React from 'react';
import { RecommendedAction } from '../types/salespilot';
import {
  Sparkles,
  Calendar,
  DollarSign,
  UserPlus,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NextActionPanelProps {
  action: RecommendedAction | null;
  onBookDemo: () => void;
  onSendPricing: () => void;
  onCreateLead: () => void;
  onEscalate: () => void;
  isActionLoading: boolean;
}

export const NextActionPanel: React.FC<NextActionPanelProps> = ({
  action,
  onBookDemo,
  onSendPricing,
  onCreateLead,
  onEscalate,
  isActionLoading,
}) => {
  const currentAction: RecommendedAction = action || {
    action: 'Send Pricing',
    reason: 'Evaluating commercial structure for 50 users. Provide dynamic quote with volume band justification.',
    confidence: 90,
  };

  const getActionColor = (actionName: string) => {
    switch (actionName) {
      case 'Book Demo':
        return 'from-emerald-600 to-teal-600 border-emerald-500 shadow-md shadow-emerald-200';
      case 'Escalate to Human':
        return 'from-slate-800 to-slate-950 border-slate-700 shadow-md shadow-slate-300';
      case 'Send Pricing':
        return 'from-indigo-600 to-blue-600 border-indigo-500 shadow-md shadow-indigo-200';
      default:
        return 'from-amber-600 to-orange-600 border-amber-500 shadow-md shadow-amber-200';
    }
  };

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between text-slate-800">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Next-Best-Action Reasoning
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Rule & State Engine
          </span>
        </div>

        {/* Recommended Action Card */}
        <div className={`rounded-xl border p-3.5 text-white shadow-xs mb-3 bg-gradient-to-r ${getActionColor(currentAction.action)}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
              Recommended Strategy
            </span>
            <span className="text-[10px] font-bold bg-black/25 px-2 py-0.5 rounded-full backdrop-blur-sm">
              Confidence: {currentAction.confidence}%
            </span>
          </div>
          <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <span>{currentAction.action}</span>
            <ArrowRight className="h-4 w-4" />
          </h4>
          <p className="mt-1.5 text-xs text-white/95 leading-relaxed font-medium">
            {currentAction.reason}
          </p>
        </div>
      </div>

      {/* Action Execution Triggers */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Execute Adaptive Next Action
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Book Demo Button */}
          <button
            onClick={onBookDemo}
            disabled={isActionLoading}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
              currentAction.action === 'Book Demo'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            <Calendar className={`h-3.5 w-3.5 ${currentAction.action === 'Book Demo' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Book Demo</span>
          </button>

          {/* Send Pricing Button */}
          <button
            onClick={onSendPricing}
            disabled={isActionLoading}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
              currentAction.action === 'Send Pricing'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            <DollarSign className={`h-3.5 w-3.5 ${currentAction.action === 'Send Pricing' ? 'text-white' : 'text-indigo-600'}`} />
            <span>Send Pricing</span>
          </button>

          {/* Create Lead Button */}
          <button
            onClick={onCreateLead}
            disabled={isActionLoading}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
              currentAction.action === 'Create Lead'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            <UserPlus className={`h-3.5 w-3.5 ${currentAction.action === 'Create Lead' ? 'text-white' : 'text-blue-600'}`} />
            <span>Create Lead</span>
          </button>

          {/* Escalate Button */}
          <button
            onClick={onEscalate}
            disabled={isActionLoading}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
              currentAction.action === 'Escalate to Human'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            <UserCheck className={`h-3.5 w-3.5 ${currentAction.action === 'Escalate to Human' ? 'text-white' : 'text-slate-600'}`} />
            <span>Escalate Rep</span>
          </button>
        </div>
      </div>
    </div>
  );
};
