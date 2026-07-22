import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Files, 
  Settings, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Upload,
  MessageSquareText,
  Network,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weeklyData = [
  { name: 'Mon', searches: 420, ocrChunks: 180, health: 94 },
  { name: 'Tue', searches: 510, ocrChunks: 240, health: 93 },
  { name: 'Wed', searches: 680, ocrChunks: 310, health: 91 },
  { name: 'Thu', searches: 590, ocrChunks: 290, health: 92 },
  { name: 'Fri', searches: 840, ocrChunks: 410, health: 90 },
  { name: 'Sat', searches: 490, ocrChunks: 190, health: 92 },
  { name: 'Sun', searches: 730, ocrChunks: 350, health: 92 },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('This Week');

  const stats = [
    { name: 'Knowledge Documents', value: '2,405', change: '+12%', icon: Files, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Equipment Health Score', value: '92%', change: '+2.1%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Active Maintenance Tasks', value: '14', change: '-3', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'ISO Compliance Score', value: '98/100', change: '+1', icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Risk & Failure Alerts', value: '3', change: '0', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    { name: 'RAG Queries Executed', value: '842', change: '+24%', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl border border-slate-800 shadow-2xl text-white relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Live Industrial AI Engine Active
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Industrial Operations</h1>
          <p className="text-sm text-slate-400">
            Real-time RAG intelligence, predictive maintenance, and knowledge graph analytics.
          </p>
        </div>

        {/* Quick Action Buttons Header */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link 
            to="/dashboard/documents" 
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
          <Link 
            to="/dashboard/chat" 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
            <span>Ask AI Agent</span>
          </Link>
        </div>

        {/* Ambient Glow Decorative */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl border", item.bg, item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <span className={cn(
                    "text-xs font-bold flex items-center px-1.5 py-0.5 rounded-full",
                    item.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 
                    item.change.startsWith('-') ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}>
                    {item.change.startsWith('+') && <TrendingUp className="w-3 h-3 mr-0.5" />}
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Updated just now</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main RAG Analytics Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-500" />
                AI Search & Chunk Vector Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">RAG query throughput vs document chunks processed</p>
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-medium outline-none text-slate-700 dark:text-slate-200"
            >
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChunks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Area type="monotone" dataKey="searches" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSearches)" name="RAG Queries" />
                <Area type="monotone" dataKey="ocrChunks" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorChunks)" name="OCR Chunks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Timeline Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Live Activity Stream
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full">Realtime</span>
          </div>

          <div className="space-y-4 flex-1 my-2">
            {[
              { title: "Equipment Manual Processed", desc: "Hydraulic Pump P-102 operating manual OCR & embeddings ready.", time: "5m ago", badge: "OCR Complete", color: "bg-emerald-500" },
              { title: "Compliance Gap Detected", desc: "ISO 9001:2015 safety audit flagged 1 missing inspection record.", time: "30m ago", badge: "Audit Warning", color: "bg-amber-500" },
              { title: "Failure Agent Analysis", desc: "Conveyor Belt A vibration anomaly analyzed. Risk: Low.", time: "1h ago", badge: "AI Insight", color: "bg-blue-500" },
              { title: "Knowledge Node Linked", desc: "Linked Conveyor Belt A to Assembly Line 1 Graph Node.", time: "2h ago", badge: "Graph Update", color: "bg-purple-500" },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={cn("w-2 h-2 mt-2 rounded-full shrink-0", act.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{act.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/dashboard/graph" className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors">
            <span>Explore Knowledge Graph</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
