import React from 'react';
import { AnalyticsData } from '../types/salespilot';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  Target,
  Award,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AnalyticsViewProps {
  data: AnalyticsData;
}

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Conversations */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Users className="h-3.5 w-3.5 text-indigo-600" />
            <span>Total Calls</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{data.totalConversations}</div>
          <span className="text-[10px] text-emerald-600 font-bold">+18% this week</span>
        </div>

        {/* Qualified Leads */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            <span>Qualified</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-600">{data.qualifiedLeads}</div>
          <span className="text-[10px] text-slate-500">Score ≥ 60/100</span>
        </div>

        {/* Avg Lead Score */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Award className="h-3.5 w-3.5 text-amber-600" />
            <span>Avg Lead Score</span>
          </div>
          <div className="text-xl font-extrabold text-amber-600">{data.avgLeadScore}</div>
          <span className="text-[10px] text-slate-500">Out of 100</span>
        </div>

        {/* Demos Booked */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Calendar className="h-3.5 w-3.5 text-indigo-600" />
            <span>Demos Booked</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{data.demosBooked}</div>
          <span className="text-[10px] text-indigo-600 font-bold">Calendar synced</span>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span>Conversion Rate</span>
          </div>
          <div className="text-xl font-extrabold text-indigo-600">{data.conversionRate}%</div>
          <span className="text-[10px] text-slate-500">Call to Demo</span>
        </div>

        {/* Escalations */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            <span>Escalated Rep</span>
          </div>
          <div className="text-xl font-extrabold text-rose-600">{data.escalationsCount}</div>
          <span className="text-[10px] text-slate-500">7.7% escalation rate</span>
        </div>

        {/* Avg Duration */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-3.5 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
            <Clock className="h-3.5 w-3.5 text-teal-600" />
            <span>Avg Duration</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{data.avgDurationMinutes}m</div>
          <span className="text-[10px] text-slate-500">Optimal engagement</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Top Objections Breakdown */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Top Customer Objections Detected
            </h3>
            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Module 1 ObjectionDetector
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.objectionsBreakdown} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Competitor Mentions Distribution */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Competitor Mention Share
            </h3>
            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Defended by RAG Table
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.competitorMentions}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {data.competitorMentions.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Qualification Score Distribution */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lead Qualification Score Distribution
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Heuristic Engine
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Stage Conversion Funnel */}
        <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-5 shadow-sm text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stage Conversion Volume
            </h3>
            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Sales Funnel
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.stageConversionFunnel} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
