import React, { useState, useEffect } from 'react';
import { QuoteResult } from '../types/salespilot';
import { Calculator, Tag, Users, Check, Sparkles, RefreshCw } from 'lucide-react';

interface QuotePanelProps {
  quote: QuoteResult | null;
  onUpdateQuote: (users: number, plan: string) => void;
  currentUserCount: number;
}

export const QuotePanel: React.FC<QuotePanelProps> = ({
  quote,
  onUpdateQuote,
  currentUserCount,
}) => {
  const [seats, setSeats] = useState<number>(currentUserCount || 50);
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');

  useEffect(() => {
    if (currentUserCount) {
      setSeats(currentUserCount);
    }
  }, [currentUserCount]);

  const defaultQuote: QuoteResult = quote || {
    plan: 'Growth Plan',
    users: 50,
    estimated_price: 99960,
    breakdown: {
      planName: 'Growth Plan',
      basePricePerSeat: 2499,
      userCount: 50,
      subtotal: 124950,
      discountPercentage: 20,
      discountAmount: 24990,
      finalPricePerMonth: 99960,
      annualTotal: 1199520,
      includedFeatures: [
        'Persistent cross-session factual memory',
        'Advanced dynamic negotiation & competitor RAG',
        'Low-latency Agora RTC sub-300ms audio pipeline',
      ],
    },
  };

  const handleRecalculate = () => {
    onUpdateQuote(seats, selectedPlan);
  };

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm flex flex-col justify-between text-slate-800">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dynamic Pricing Engine
            </h3>
          </div>
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
            Real-time Volume Formula
          </span>
        </div>

        {/* Highlighted Price Card */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 p-3.5 mb-3 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-600">
                {defaultQuote.plan}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  ₹{defaultQuote.estimated_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
            </div>

            {defaultQuote.breakdown.discountPercentage > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-200 shadow-2xs">
                <Tag className="h-3 w-3 text-emerald-600" />
                {defaultQuote.breakdown.discountPercentage}% Volume Discount
              </span>
            )}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span>List per seat: </span>
              <span className="font-semibold text-slate-800">₹{defaultQuote.breakdown.basePricePerSeat}</span>
            </div>
            <div>
              <span>Annual Contract: </span>
              <span className="font-semibold text-slate-800">₹{(defaultQuote.breakdown.annualTotal).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Interactive Seats Slider */}
        <div className="mb-3 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Team Size / Rep Seats:</span>
            <span className="text-indigo-600 font-extrabold">{seats} users</span>
          </div>
          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full accent-indigo-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>5 (Starter)</span>
            <span>50 (Growth)</span>
            <span>100+ (Enterprise Custom)</span>
          </div>
        </div>

        {/* Plan Select Pills */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { id: 'starter', label: 'Starter', price: '₹999' },
            { id: 'growth', label: 'Growth', price: '₹2,499' },
            { id: 'enterprise', label: 'Enterprise', price: 'Custom' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`px-2 py-1.5 rounded-lg text-center text-xs font-semibold border transition-all ${
                selectedPlan === p.id
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="text-[11px] font-bold">{p.label}</div>
              <div className="text-[10px] text-slate-500">{p.price}/seat</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recalculate Button */}
      <button
        onClick={handleRecalculate}
        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Update Quote for {seats} Seats</span>
      </button>
    </div>
  );
};
