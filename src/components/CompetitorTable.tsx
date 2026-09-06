import React from 'react';
import { competitorData } from '../data/knowledge';
import { ShieldCheck, Info, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const CompetitorTable: React.FC = () => {
  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Competitor Comparison Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] text-amber-800 border border-amber-200 font-medium">
          <Info className="h-3 w-3 text-amber-600" />
          <span>Labelled Benchmark: Demonstration & Sample Data Only (No Real-Brand Claims)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] text-slate-500">
              <th className="py-2.5 px-3 font-bold">Capabilities</th>
              <th className="py-2.5 px-3 font-extrabold text-indigo-700 bg-indigo-50/80 border-t border-x border-indigo-100 rounded-t-lg">
                SalesPilot AI (Our Solution)
              </th>
              <th className="py-2.5 px-3 font-medium text-slate-600">Generic Competitor X</th>
              <th className="py-2.5 px-3 font-medium text-slate-400">Legacy IVR Bot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-slate-700">
            {competitorData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-800">
                  {row.feature}
                </td>
                <td className="py-3 px-3 font-bold text-indigo-900 bg-indigo-50/40 border-x border-indigo-100/60">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{row.salesPilotAI}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{row.genericCompetitor}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-400">
                  <div className="flex items-start gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{row.legacyIvr}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
