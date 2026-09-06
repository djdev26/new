import React from 'react';
import { CustomerState } from '../types/salespilot';
import { Users, Building2, Calendar, Target, ShieldAlert, Award, CheckCircle, Clock } from 'lucide-react';

interface CustomerStateCardProps {
  state: CustomerState;
}

export const CustomerStateCard: React.FC<CustomerStateCardProps> = ({ state }) => {
  const {
    customer_profile,
    user_count,
    product_interest,
    buying_intent,
    competitors,
    timeline,
    qualification_score,
    objections,
    sentiment,
  } = state;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-indigo-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between text-slate-800">
      {/* Header with Lead Score */}
      <div className="flex items-start justify-between border-b border-slate-200/80 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Shared CustomerState
            </h3>
            <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-bold">
              Live Engine Sync
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{customer_profile.name} · {customer_profile.company}</span>
          </div>
          <span className="text-[11px] text-slate-500">{customer_profile.role} (Decision Maker)</span>
        </div>

        {/* Prominent Lead Score Gauge */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lead Score</span>
          <div className="flex items-baseline gap-0.5">
            <span className={`text-2xl font-black ${getScoreColor(qualification_score)}`}>
              {qualification_score}
            </span>
            <span className="text-[10px] font-medium text-slate-400">/100</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-500 mt-0.5">
            {qualification_score >= 75 ? 'Enterprise Ready' : qualification_score >= 50 ? 'Qualified' : 'Discovery'}
          </span>
        </div>
      </div>

      {/* Grid of Key State Fields */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* Seats / Users */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Users className="h-3 w-3 text-indigo-600" />
            <span>User Capacity</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold text-slate-800">{user_count} seats</span>
            <span className="text-[10px] text-indigo-600 font-bold">{product_interest}</span>
          </div>
        </div>

        {/* Buying Intent */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Target className="h-3 w-3 text-emerald-600" />
            <span>Buying Signal</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              buying_intent === 'high'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {buying_intent}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">{sentiment}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Clock className="h-3 w-3 text-indigo-600" />
            <span>Timeline</span>
          </div>
          <span className="text-xs font-bold text-slate-800 truncate block">
            {timeline || 'Evaluating'}
          </span>
        </div>

        {/* Competitors Mentioned */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <ShieldAlert className="h-3 w-3 text-amber-600" />
            <span>Competitor Tracking</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {competitors.length > 0 ? (
              competitors.map((comp) => (
                <span
                  key={comp}
                  className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200"
                >
                  {comp}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">None detected</span>
            )}
          </div>
        </div>
      </div>

      {/* Objections List */}
      <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 text-rose-500" />
            Objections Log ({objections.length})
          </span>
          <span className="text-[10px] text-slate-500">
            {objections.filter((o) => o.resolved).length} Resolved
          </span>
        </div>

        {objections.length === 0 ? (
          <p className="text-[10px] text-slate-400 italic">No unresolved objections recorded.</p>
        ) : (
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {objections.map((obj, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white px-2 py-1 border border-slate-200 text-[10px] shadow-2xs"
              >
                <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                  {obj.resolved ? (
                    <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-700 capitalize">{obj.type}:</span>
                  <span className="text-slate-500 truncate">"{obj.excerpt.slice(0, 30)}..."</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] ${
                  obj.resolved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {obj.resolved ? 'Resolved' : obj.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
