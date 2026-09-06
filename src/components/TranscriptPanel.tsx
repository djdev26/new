import React, { useRef, useEffect } from 'react';
import { MessageSquare, Bot, User, AlertCircle, Scissors } from 'lucide-react';
import { TranscriptTurn } from '../types/salespilot';

interface TranscriptPanelProps {
  transcript: TranscriptTurn[];
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="flex flex-col h-[400px] rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Live Conversation Transcript
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {transcript.length} turn{transcript.length === 1 ? '' : 's'} recorded
        </span>
      </div>

      {/* Transcript items container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {transcript.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
            <MessageSquare className="h-8 w-8 stroke-[1.5] mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium text-slate-600">No spoken turns yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Start the voice call, run the demo scenario, or type an inquiry.
            </p>
          </div>
        ) : (
          transcript.map((turn) => {
            const isAI = turn.speaker === 'agent';
            const isSystem = turn.speaker === 'system';

            if (isSystem) {
              return (
                <div key={turn.id} className="flex justify-center my-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 shadow-xs">
                    <AlertCircle className="h-3 w-3 text-indigo-600" />
                    {turn.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={turn.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} transition-all`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {isAI ? (
                    <>
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-indigo-50 border border-indigo-200 text-indigo-600">
                        <Bot className="h-2.5 w-2.5" />
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700">SalesPilot AI</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] font-bold text-slate-700">Priya Sharma (Buyer)</span>
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-slate-200 border border-slate-300 text-slate-700">
                        <User className="h-2.5 w-2.5" />
                      </div>
                    </>
                  )}
                  <span className="text-[10px] text-slate-400">{turn.timestamp}</span>
                </div>

                <div
                  className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isAI
                      ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      : 'bg-indigo-600 text-white border border-indigo-500 rounded-tr-xs shadow-indigo-100'
                  }`}
                >
                  <p>{turn.text}</p>

                  {/* Visual Interruption Flag */}
                  {turn.interrupted && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-800">
                      <Scissors className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>[Interrupted by customer barge-in]</span>
                      {turn.interruptedSnippet && (
                        <span className="text-amber-700 truncate italic">
                          "{turn.interruptedSnippet.slice(0, 35)}..."
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
