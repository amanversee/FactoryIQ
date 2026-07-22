import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Files, 
  Network, 
  MessageSquareText, 
  ClipboardList, 
  AlertTriangle, 
  Upload, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import api from '../../lib/api';

export default function EngineerWorkspace() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspForm, setInspForm] = useState({
    title: '',
    equipmentId: 'EQ-001',
    equipmentName: 'Conveyor Belt System A-10',
    findings: '',
    type: 'ROUTINE',
    severity: 'NONE'
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/engineer/metrics');
      setMetrics(res.data.data);
    } catch (err) {
      console.error('Error fetching engineer metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/engineer/inspections', inspForm);
      setShowInspectionModal(false);
      fetchMetrics();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit inspection');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const docs = metrics?.recentDocuments || [];
  const inspections = metrics?.inspections || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Engineer Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-blue-500/20">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/30">
            Industrial Knowledge Creator
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Engineer Knowledge Workspace</h1>
          <p className="text-sm text-blue-200/80 mt-1 max-w-xl">
            Upload technical manuals, construct knowledge graphs, run RAG queries, and issue equipment inspection logs.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link 
            to="/dashboard/engineer/upload"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4" /> Upload Manual / SOP
          </Link>
          <Link 
            to="/dashboard/engineer/chat"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <MessageSquareText className="w-4 h-4 text-cyan-400" /> Ask AI Assistant
          </Link>
          <button 
            onClick={() => setShowInspectionModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Create Inspection
          </button>
        </div>
      </div>

      {/* Engineer Guided Workflow Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Engineering Workflow Standard</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 block">1. Upload Manual</span>
            <span className="text-[10px] text-slate-500">PDF / Drawing OCR</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">2. AI Vector Index</span>
            <span className="text-[10px] text-slate-500">Chunking & Embeds</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">3. Graph Updated</span>
            <span className="text-[10px] text-slate-500">Entity Relationships</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">4. Query RAG AI</span>
            <span className="text-[10px] text-slate-500">Precision Answers</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">5. Inspection Report</span>
            <span className="text-[10px] text-slate-500">Log Findings</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">6. Raise Incident</span>
            <span className="text-[10px] text-slate-500">Maint Action</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Uploaded Documents</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <Files className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics?.documentsCount || 6}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">Indexed Technical Manuals</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Knowledge Graph Nodes</span>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics?.knowledgeNodesCount || 4}</p>
          <Link to="/dashboard/engineer/graph" className="text-[11px] text-indigo-600 font-bold mt-2 flex items-center gap-1">
            Explore Graph Visualizer <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inspection Reports</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{inspections.length}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">Logged Field Reports</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{metrics?.pendingReviews || 1}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-2 block">Action Required Incidents</span>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Inspection Reports List */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Inspection Reports</h3>
            <button 
              onClick={() => setShowInspectionModal(true)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Create New Report
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-4">
            {inspections.map((insp) => (
              <div key={insp._id || insp.inspectionId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{insp.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">({insp.inspectionId})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{insp.findings}</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-extrabold rounded-lg">
                  {insp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Uploaded Manuals */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Knowledge Documents & OCR</h3>
            <Link to="/dashboard/engineer/upload" className="text-xs font-bold text-blue-600 hover:underline">
              Upload Document
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-4">
            {docs.map((doc) => (
              <div key={doc._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-xl">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</p>
                    <span className="text-[10px] text-slate-400">Category: {doc.category || 'Manual'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  INDEXED
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal for Creating Inspection */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Inspection Report</h3>
            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Report Title</label>
                <input 
                  type="text" 
                  required
                  value={inspForm.title}
                  onChange={(e) => setInspForm({ ...inspForm, title: e.target.value })}
                  placeholder="e.g. Pump Valve Integrity Walkthrough"
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Findings & Observations</label>
                <textarea 
                  required
                  rows={3}
                  value={inspForm.findings}
                  onChange={(e) => setInspForm({ ...inspForm, findings: e.target.value })}
                  placeholder="Describe technical observations, pressure metrics, seal status..."
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Severity Level</label>
                <select
                  value={inspForm.severity}
                  onChange={(e) => setInspForm({ ...inspForm, severity: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                >
                  <option value="NONE">Routine (No Hazard)</option>
                  <option value="MINOR">Minor Deviation</option>
                  <option value="MODERATE">Moderate Risk</option>
                  <option value="CRITICAL">Critical Incident Flag</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
