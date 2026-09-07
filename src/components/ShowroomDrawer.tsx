import React from 'react';
import { ShowroomItem, ShowroomId } from '../types/salespilot';
import { SHOWROOMS_DATA, SHOWROOM_KEYS } from '../data/showrooms';
import {
  Bike,
  Laptop,
  Refrigerator,
  Sparkles,
  Zap,
  Mic,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ShowroomDrawerProps {
  currentShowroomId: ShowroomId;
  onSelectShowroom: (id: ShowroomId, source?: 'user' | 'agent') => void;
  lastAutonomousSwitch?: {
    showroomName: string;
    reason: string;
    timestamp: string;
  } | null;
}

export const ShowroomDrawer: React.FC<ShowroomDrawerProps> = ({
  currentShowroomId,
  onSelectShowroom,
  lastAutonomousSwitch,
}) => {
  const getShowroomIcon = (id: ShowroomId) => {
    switch (id) {
      case 'bike':
        return <Bike className="h-4 w-4" />;
      case 'laptop':
        return <Laptop className="h-4 w-4" />;
      case 'appliances':
      default:
        return <Refrigerator className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
      {/* Top Bar with Autonomous Agent Control Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              Autonomous 3D Showroom Navigator
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Voice-controlled product switching & live 3D hardware inspection
            </span>
          </div>
        </div>

        {/* Live Autonomous Switch Indicator */}
        {lastAutonomousSwitch ? (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/90 border border-indigo-200 px-3 py-1 text-xs text-indigo-800 animate-fade-in shadow-2xs">
            <Zap className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            <span>
              <strong className="font-bold">Autonomous Switch:</strong> {lastAutonomousSwitch.showroomName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-600 font-semibold border border-slate-200">
            <Mic className="h-3 w-3 text-indigo-600" />
            <span>Say "Switch to bike" or "Show me appliances"</span>
          </div>
        )}
      </div>

      {/* Showroom Tab Buttons Grid - 3 Showrooms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SHOWROOM_KEYS.map((key) => {
          const item = SHOWROOMS_DATA[key];
          const isSelected = currentShowroomId === key;

          return (
            <button
              key={key}
              onClick={() => onSelectShowroom(key, 'user')}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-sm ring-1 ring-indigo-400'
                  : 'border-slate-200/80 bg-white/70 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div
                  className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r"
                  style={{ backgroundImage: `linear-gradient(to right, ${item.accentColor}, #4f46e5)` }}
                />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {getShowroomIcon(key)}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  ₹{item.basePrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-900 truncate">{item.name.split('(')[0]}</div>
              <div className="text-[10px] text-slate-500 truncate">{item.category}</div>

              <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-indigo-600">3D Interactive</span>
                <span className="text-slate-400 font-mono">
                  {key === 'bike' ? '85kW · 220mi' : key === 'laptop' ? '50 TOPS · 4K' : '29" OLED · 680L'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
