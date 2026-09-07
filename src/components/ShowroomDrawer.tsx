import React from 'react';
import { ShowroomId } from '../types/salespilot';
import { SHOWROOMS_DATA, SHOWROOM_KEYS } from '../data/showrooms';
import {
  Laptop,
  Refrigerator,
  Car,
  Sparkles,
  Zap,
  Mic,
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
      case 'cars':
        return <Car className="h-4 w-4" />;
      case 'laptops':
        return <Laptop className="h-4 w-4" />;
      case 'appliances':
      default:
        return <Refrigerator className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-md p-4 shadow-sm text-slate-800">
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
              3 Dedicated Showrooms · Voice-controlled product switching & live 3D hardware inspection
            </span>
          </div>
        </div>

        {/* Live Autonomous Switch Indicator */}
        {lastAutonomousSwitch ? (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/90 border border-indigo-200 px-3 py-1 text-xs text-indigo-800 animate-fade-in shadow-2xs">
            <Zap className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            <span>
              <strong className="font-bold">Autonomous Agent Switched:</strong> {lastAutonomousSwitch.showroomName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-600 font-semibold border border-slate-200">
            <Mic className="h-3 w-3 text-indigo-600" />
            <span>Say "Switch to cars", "Show me laptops", or "Take me to appliances"</span>
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
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-md ring-2 ring-indigo-400/40'
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
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {getShowroomIcon(key)}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.products ? `${item.products.length} Models` : '10 Models'}
                </span>
              </div>

              <div className="font-black text-xs text-slate-900 truncate mt-1">{item.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{item.category}</div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px]">
                <span className="font-bold text-indigo-600">3D Interactive</span>
                <span className="text-slate-500 font-mono">
                  {key === 'cars' ? 'Porsche · Range Rover · SUV' : key === 'laptops' ? 'XPS 16 · MacBook · ROG' : 'InstaView · Bespoke · AC'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
