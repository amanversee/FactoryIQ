import { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Cpu, 
  Files, 
  Sparkles, 
  Activity, 
  UserPlus, 
  Plus, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Server, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'USER' | 'EQUIPMENT' | 'DEPT'
  const [formData, setFormData] = useState({ name: '', email: '', password: 'User@12345', role: 'ENGINEER', department: 'Assembly Line A' });

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    try {
      const res = await api.get('/admin/metrics');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      alert(`User ${formData.name} created successfully!`);
      setModalType(null);
      setFormData({ name: '', email: '', password: '', role: 'ENGINEER', department: 'Assembly Line A' });
      fetchAdminMetrics();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalUsers: 4,
    departmentsCount: 4,
    equipmentCount: 4,
    documentsCount: 6,
    aiTokensUsed: 148290,
    pendingAiJobs: 2
  };

  const systemHealth = data?.systemHealth || {
    status: 'OPERATIONAL',
    uptime: '99.98%',
    cpuLoad: '14%',
    memoryUsage: '3.2 GB / 16 GB',
    activeClusterNodes: 4
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900/90 via-slate-900 to-indigo-900/90 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-purple-500/20">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest rounded-full border border-purple-500/30">
            Platform Command Center
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Administrator Executive Dashboard</h1>
          <p className="text-sm text-purple-200/80 mt-1 max-w-xl">
            System monitoring, enterprise access control, department oversight, and industrial AI engine management.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button 
            onClick={() => setModalType('USER')}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" /> Create User
          </button>
          <button 
            onClick={() => setModalType('EQUIPMENT')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-purple-400" /> Add Equipment
          </button>
          <button 
            onClick={() => alert('Redirecting to Document Upload Manager')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4 text-blue-400" /> Upload Documents
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform Users</span>
            <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics.totalUsers}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> 4 Active Roles Configured
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plant Departments</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics.departmentsCount}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">Assembly, QA, Maintenance, Packaging</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equipment Count</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics.equipmentCount}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-2 block">Monitored Industrial Assets</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Engine Usage</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{(metrics.aiTokensUsed / 1000).toFixed(1)}k</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">Tokens • {metrics.pendingAiJobs} Jobs In Queue</span>
        </div>
      </div>

      {/* System Health Status Widget */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">System Health & Infrastructure</h3>
              <p className="text-xs text-slate-500">Real-time status of backend services, microservices, and Atlas Vector indexes</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {systemHealth.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Uptime Score</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{systemHealth.uptime}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CPU Core Load</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{systemHealth.cpuLoad}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">RAM Memory</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{systemHealth.memoryUsage}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Clusters</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{systemHealth.activeClusterNodes} Nodes</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Platform Users & Role Assignment</h3>
            <p className="text-xs text-slate-500">Manage user access permissions and department assignments</p>
          </div>
          <button 
            onClick={() => setModalType('USER')}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            + Create User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">User Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.users || []).map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-extrabold rounded-lg text-[10px] uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{u.department || 'General'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for User Creation */}
      {modalType === 'USER' && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Enterprise User</h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. johndoe@company.com"
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Initial Password (Optional, default: User@12345)</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password (min 6 chars)"
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Select Enterprise Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="ENGINEER">Engineer</option>
                  <option value="MAINTENANCE_TEAM">Maintenance Team</option>
                  <option value="AUDITOR">Compliance Auditor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Plant Department</label>
                <input 
                  type="text" 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Assembly Line A"
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
