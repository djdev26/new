import React, { useState } from 'react';
import { Database, Search, Sparkles, Check, Bookmark } from 'lucide-react';

interface MemoryPanelProps {
  memoryBullets: string[];
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memoryBullets }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBullets = memoryBullets.filter((bullet) =>
    bullet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[280px] rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Factual Conversation Memory
          </h3>
        </div>
        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
          Delta Memory Store
        </span>
      </div>

      {/* Search Memory bar */}
      <div className="relative mb-2.5">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter memory (e.g. pricing, 100 users)..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-2xs"
        />
      </div>

      {/* Bullets List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredBullets.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <Bookmark className="h-6 w-6 stroke-[1.5] mb-1 opacity-40 text-slate-400" />
            <p className="text-xs text-slate-500">No matching factual memory bullets found.</p>
          </div>
        ) : (
          filteredBullets.map((bullet, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-slate-50/90 p-2 text-xs leading-relaxed text-slate-700 hover:border-indigo-300 transition-colors shadow-2xs"
            >
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
              <p className="text-[11px] text-slate-700 flex-1">{bullet}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
        <span>Extracted delta facts: {memoryBullets.length} items</span>
        <span className="text-indigo-600 font-semibold">Queried by Next-Best-Action Engine</span>
      </div>
    </div>
  );
};
