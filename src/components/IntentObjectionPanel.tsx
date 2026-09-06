import React from 'react';
import { IntentResult, ObjectionResult } from '../types/salespilot';
import { Compass, AlertOctagon, Activity, Gauge, Flame } from 'lucide-react';

interface IntentObjectionPanelProps {
  intent: IntentResult | null;
  objections: ObjectionResult | null;
}

export const IntentObjectionPanel: React.FC<IntentObjectionPanelProps> = ({
  intent,
  objections,
}) => {
  const defaultIntent: IntentResult = intent || {
    current_intent: 'Pricing & Commercial Terms',
    detected_intent: 'Pricing & Commercial Terms',
    confidence: 94,
    sentiment: 'interested',
    buying_signal: 'high',
    urgency: 'high',
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'interested':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'negative':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const activeObjections = objections?.objections || [];

  return (
    <div className="flex flex-col h-[280px] rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm justify-between text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Intent & Objection Detection
          </h3>
        </div>
        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
          Module 1 AI Feed
        </span>
      </div>

      {/* Main Detected Intent */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-3 mb-2.5 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Classified Intent</span>
          <span className="text-[10px] font-semibold text-indigo-600">Confidence: {defaultIntent.confidence}%</span>
        </div>
        <p className="text-sm font-extrabold text-slate-900">{defaultIntent.detected_intent}</p>
      </div>

      {/* Gauges & Telemetry Row */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2.5">
        {/* Sentiment */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 shadow-xs">
          <span className="text-[10px] text-slate-500 block mb-1">Sentiment</span>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSentimentBadge(defaultIntent.sentiment)}`}>
            {defaultIntent.sentiment}
          </span>
        </div>

        {/* Buying Signal */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 shadow-xs">
          <span className="text-[10px] text-slate-500 block mb-1">Buying Signal</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            defaultIntent.buying_signal === 'high'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <Activity className="h-2.5 w-2.5" />
            {defaultIntent.buying_signal}
          </span>
        </div>

        {/* Urgency */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 shadow-xs">
          <span className="text-[10px] text-slate-500 block mb-1">Urgency</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            defaultIntent.urgency === 'high'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            <Flame className="h-2.5 w-2.5" />
            {defaultIntent.urgency}
          </span>
        </div>
      </div>

      {/* Active Detected Objections */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2 flex-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1 mb-1">
          <AlertOctagon className="h-3 w-3 text-amber-600" />
          Real-time Objections Detected ({activeObjections.length})
        </span>

        {activeObjections.length === 0 ? (
          <span className="text-[10px] text-slate-400 italic block py-0.5">
            No active objections detected in recent turn.
          </span>
        ) : (
          activeObjections.map((obj, i) => (
            <div key={i} className="flex items-center justify-between text-[10px] py-1 border-b border-slate-200/80 last:border-0">
              <span className="font-semibold text-amber-800 capitalize">{obj.type}</span>
              <span className="text-slate-600 truncate max-w-[65%]">"{obj.excerpt.slice(0, 32)}..."</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded uppercase font-bold border border-amber-200">{obj.severity}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
