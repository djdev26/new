import React, { useState } from 'react';
import {
  Sparkles,
  Terminal,
  Play,
  CheckCircle2,
  Clock,
  Code2,
  Bike,
  Laptop,
  Refrigerator,
  CreditCard,
  Calendar,
  Database,
  Send,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { AgenticToolCall, AgenticToolType, ShowroomId } from '../types/salespilot';

interface AgenticActionConsoleProps {
  toolCalls: AgenticToolCall[];
  onTriggerTool: (toolName: AgenticToolType, args: Record<string, any>) => void;
  isExecuting?: boolean;
}

export const AgenticActionConsole: React.FC<AgenticActionConsoleProps> = ({
  toolCalls,
  onTriggerTool,
  isExecuting = false,
}) => {
  const [selectedCall, setSelectedCall] = useState<AgenticToolCall | null>(null);

  const getToolIcon = (name: AgenticToolType) => {
    switch (name) {
      case 'switch_showroom':
        return <Zap className="h-3.5 w-3.5 text-indigo-600" />;
      case 'negotiate_discount':
        return <Sparkles className="h-3.5 w-3.5 text-amber-600" />;
      case 'make_payment':
        return <CreditCard className="h-3.5 w-3.5 text-emerald-600" />;
      case 'book_calendar':
        return <Calendar className="h-3.5 w-3.5 text-blue-600" />;
      case 'update_database':
        return <Database className="h-3.5 w-3.5 text-purple-600" />;
      case 'trigger_workflow':
        return <Send className="h-3.5 w-3.5 text-rose-600" />;
      default:
        return <Terminal className="h-3.5 w-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-md p-6 shadow-sm text-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Autonomous Website Control & Tool Dispatcher</h2>
              <span className="rounded-full bg-violet-100 text-violet-800 text-[10px] font-bold px-2 py-0.5">
                Full-Stack Dispatcher
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous execution of UI showroom switches, dynamic price drops, checkout modals & CRM mutations
            </p>
          </div>
        </div>

        {/* Quick Test Action Buttons for Evaluators */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 hidden sm:inline">
            Simulate Tool:
          </span>
          <button
            onClick={() => onTriggerTool('switch_showroom', { showroomId: 'cars', reason: 'Customer inquired about luxury supercars & SUVs' })}
            disabled={isExecuting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-50"
          >
            <Car className="h-3 w-3 text-red-600" />
            <span>Switch: Cars</span>
          </button>
          <button
            onClick={() => onTriggerTool('switch_showroom', { showroomId: 'laptops', reason: 'Customer requested developer AI hardware' })}
            disabled={isExecuting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-50"
          >
            <Laptop className="h-3 w-3 text-indigo-600" />
            <span>Switch: Laptops</span>
          </button>
          <button
            onClick={() => onTriggerTool('switch_showroom', { showroomId: 'appliances', reason: 'Customer requested kitchen smart appliances' })}
            disabled={isExecuting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 shadow-2xs transition-all disabled:opacity-50"
          >
            <Refrigerator className="h-3 w-3 text-emerald-600" />
            <span>Switch: Appliances</span>
          </button>
          <button
            onClick={() => onTriggerTool('negotiate_discount', { requestedQty: 25, requestedDiscount: 15 })}
            disabled={isExecuting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-[11px] font-bold text-amber-800 hover:bg-amber-100 shadow-2xs transition-all disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>Negotiate 15%</span>
          </button>
        </div>
      </div>

      {/* Tool Execution Timeline List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {toolCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
            <Terminal className="h-6 w-6 stroke-[1.5] mb-1 opacity-50" />
            <p className="text-xs">No autonomous actions executed yet.</p>
            <span className="text-[11px] text-slate-500">
              Speak or click a quick action above to let the autonomous agent control the website!
            </span>
          </div>
        ) : (
          toolCalls.map((call) => {
            const isSelected = selectedCall?.id === call.id;

            return (
              <div
                key={call.id}
                onClick={() => setSelectedCall(isSelected ? null : call)}
                className={`cursor-pointer rounded-xl border p-2.5 transition-all text-xs ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getToolIcon(call.toolName)}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-slate-900 text-[11px] flex items-center gap-1.5">
                        <span>agent.{call.toolName}()</span>
                        <span className="text-[10px] font-sans font-normal text-slate-500">
                          {call.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {call.timestamp} · {call.durationMs}ms
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        call.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : call.status === 'executing'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {call.status}
                    </span>
                    <ChevronRight className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded JSON Arguments & Output Viewer */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 space-y-2 text-[11px] font-mono">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Payload Arguments:</span>
                      <pre className="p-2 rounded-lg bg-slate-900 text-emerald-400 overflow-x-auto text-[10px] leading-relaxed">
                        {JSON.stringify(call.arguments, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Execution Output:</span>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-sans text-[11px]">
                        {call.output}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
