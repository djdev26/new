import React from 'react';
import { SalesStage } from '../types/salespilot';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface SalesFunnelProps {
  currentStage: SalesStage;
  onSelectStage?: (stage: SalesStage) => void;
  qualificationScore: number;
}

const STAGES: SalesStage[] = [
  'New Lead',
  'Engaged',
  'Qualified',
  'Demo Requested',
  'Demo Booked',
  'Negotiation',
  'Converted',
];

export const SalesFunnel: React.FC<SalesFunnelProps> = ({
  currentStage,
  onSelectStage,
  qualificationScore,
}) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="w-full rounded-2xl border border-white bg-white/70 backdrop-blur-md p-4 shadow-sm text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Sales Funnel Strip</span>
          <span className="text-xs text-slate-400">· Updates dynamically as conversation progresses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Current Qualification:</span>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
            qualificationScore >= 75
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : qualificationScore >= 50
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {qualificationScore} / 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={stage}
              onClick={() => onSelectStage && onSelectStage(stage)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                isCurrent
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-2 ring-indigo-200 font-bold'
                  : isPassed
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200/80 hover:bg-indigo-150'
                  : 'bg-slate-100/90 text-slate-500 border-slate-200/80 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {isPassed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-700 shrink-0" />
                ) : (
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCurrent ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{stage}</span>
              </div>
              {idx < STAGES.length - 1 && (
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0 hidden lg:block" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
