import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MessageSquareText, 
  ArrowUpRight, 
  FileText, 
  Clock, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import api from '../../lib/api';

export default function MaintenanceWorkspace() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWO, setSelectedWO] = useState(null);
  const [repairNotes, setRepairNotes] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/maintenance/metrics');
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching maintenance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/maintenance/work-orders/${id}`, {
        status: newStatus,
        repairNotes
      });
      setSelectedWO(null);
      fetchMetrics();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update work order');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalEquipment: 4,
    operationalCount: 3,
    maintenanceCount: 1,
    avgHealthScore: 68,
    pendingWorkOrders: 2
  };

  const workOrders = data?.todaysWorkOrders || [];
  const equipment = data?.equipment || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-amber-500/20">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest rounded-full border border-amber-500/30">
            Industrial Maintenance & Asset Reliability
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Maintenance Operations Center</h1>
          <p className="text-sm text-amber-200/80 mt-1 max-w-xl">
            Monitor real-time equipment telemetry, execute AI predictive work orders, and log component repairs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link 
            to="/dashboard/maintenance/work-orders"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
          >
            <Wrench className="w-4 h-4" /> View Work Orders
          </Link>
          <Link 
            to="/dashboard/maintenance/predictions"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> AI Predictions
          </Link>
          <Link 
            to="/dashboard/engineer/chat"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <MessageSquareText className="w-4 h-4 text-cyan-400" /> Ask AI
          </Link>
        </div>
      </div>

      {/* Maintenance Workflow Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Standard Maintenance Execution Process</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">1. Check Assets</span>
            <span className="text-[10px] text-slate-500">View Telemetry</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">2. AI Risk Score</span>
            <span className="text-[10px] text-slate-500">Failure Days</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">3. Accept Ticket</span>
            <span className="text-[10px] text-slate-500">Claim Work Order</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">4. Inspect & Repair</span>
            <span className="text-[10px] text-slate-500">Fix Component</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">5. Log Report</span>
            <span className="text-[10px] text-slate-500">Upload Notes</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">6. Close Ticket</span>
            <span className="text-[10px] text-slate-500">Mark Completed</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">7. Restored</span>
            <span className="text-[10px] text-slate-500">Health +35%</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Equipment Health</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.avgHealthScore}%</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">{stats.operationalCount} Assets Operational</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Work Orders</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{workOrders.length}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-2 block">Pending Maintenance Tasks</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Failure Risk Assets</span>
            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">1</p>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">Hydraulic Pump P-102 (Health 42%)</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Repairs</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{(data?.recentRepairs || []).length}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">Verified Field Fixes</span>
        </div>
      </div>

      {/* Equipment Health Status List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Assigned Equipment Telemetry & Health</h3>
          <span className="text-xs text-slate-500 font-medium">Updated 5 minutes ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {equipment.map((eq) => (
            <div key={eq._id || eq.equipmentId} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{eq.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({eq.equipmentId})</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{eq.department} • {eq.type}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{eq.healthScore}%</span>
                <span className={`block text-[10px] font-extrabold uppercase ${eq.healthScore < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {eq.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Work Orders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Work Orders Queue</h3>
          <p className="text-xs text-slate-500">Accept work orders, execute repair procedures, and close completed tickets</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {workOrders.map((wo) => (
            <div key={wo._id || wo.workOrderId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-extrabold rounded">
                    {wo.priority}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{wo.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">({wo.workOrderId})</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{wo.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 font-medium">
                  <span>Asset: {wo.equipmentName}</span>
                  <span>Assigned: {wo.assignedTo}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {wo.status === 'PENDING' && (
                  <button 
                    onClick={() => handleUpdateStatus(wo._id, 'IN_PROGRESS')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Accept Work Order
                  </button>
                )}
                {wo.status === 'IN_PROGRESS' && (
                  <button 
                    onClick={() => setSelectedWO(wo)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Complete & Close
                  </button>
                )}
                {wo.status === 'COMPLETED' && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 text-xs font-bold rounded-lg">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Modal */}
      {selectedWO && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Close Work Order</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedWO.title} ({selectedWO.workOrderId})</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Repair Notes & Parts Replaced</label>
                <textarea 
                  rows={3}
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  placeholder="e.g. Replaced nitrile gasket O-ring, purged air lock, pressure verified at 350 BAR."
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedWO(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedWO._id, 'COMPLETED')}
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Submit & Close Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
