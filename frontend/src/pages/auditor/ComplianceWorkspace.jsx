import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileCheck2, 
  AlertOctagon, 
  Sparkles, 
  Download, 
  FileText, 
  Sliders, 
  AlertTriangle,
  Play
} from 'lucide-react';
import api from '../../lib/api';

export default function ComplianceWorkspace() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState('ISO 9001:2015');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/auditor/metrics');
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching auditor metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setRunningAudit(true);
    try {
      await api.post('/auditor/run-audit', { standard: selectedStandard });
      fetchMetrics();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to run AI audit');
    } finally {
      setRunningAudit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    avgComplianceScore: 86,
    pendingAudits: 1,
    violationsCount: 2,
    totalAudits: 2,
    expiredCertificatesCount: 2
  };

  const audits = data?.audits || [];
  const expiredCerts = data?.expiredCertificates || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Auditor Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 md:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">
            Quality Assurance & Regulatory Compliance
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Compliance Auditor Vault</h1>
          <p className="text-sm text-emerald-200/80 mt-1 max-w-xl">
            Audit standard operating procedures against ISO 9001/45001 regulations, analyze violations, and export regulatory documentation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button 
            onClick={handleRunAudit}
            disabled={runningAudit}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            {runningAudit ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {runningAudit ? 'Analyzing SOPs...' : 'Run AI Compliance Audit'}
          </button>
          <button 
            onClick={() => alert('Generating PDF report package for regulatory export...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export PDF
          </button>
        </div>
      </div>

      {/* Auditor Workflow Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Auditor Verification & Certification Flow</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">1. Select Standard</span>
            <span className="text-[10px] text-slate-500">ISO / OSHA</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">2. Execute AI Audit</span>
            <span className="text-[10px] text-slate-500">Clause Matching</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">3. Review Violations</span>
            <span className="text-[10px] text-slate-500">Clause Non-Compliance</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">4. Generate Report</span>
            <span className="text-[10px] text-slate-500">Score & Summary</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">5. Export PDF</span>
            <span className="text-[10px] text-slate-500">Official Certification</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Compliance Score</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.avgComplianceScore}%</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-2 block">ISO 9001 Alignment Passed</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Audits Performed</span>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{audits.length}</p>
          <span className="text-[11px] text-blue-600 font-bold mt-2 block">AI Standard Analyses</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clause Violations Found</span>
            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.violationsCount}</p>
          <span className="text-[11px] text-rose-600 font-bold mt-2 block">1 Major • 1 Minor</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expired Certificates</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">{stats.expiredCertificatesCount}</p>
          <span className="text-[11px] text-amber-600 font-bold mt-2 block">Safety Permit Expired</span>
        </div>
      </div>

      {/* Select Standard & AI Audit Trigger */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Run AI Compliance Verification</h3>
          <p className="text-xs text-slate-500">Select target standard and evaluate factory SOP documents against compliance rules</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ISO 9001:2015">ISO 9001:2015 Quality Management</option>
            <option value="ISO 45001:2018">ISO 45001:2018 Safety Standard</option>
            <option value="OSHA Standard">OSHA Occupational Safety</option>
            <option value="Factory Act 1948">Factory Act 1948 Compliance</option>
          </select>

          <button
            onClick={handleRunAudit}
            disabled={runningAudit}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all shrink-0"
          >
            {runningAudit ? 'Analyzing...' : 'Run Audit'}
          </button>
        </div>
      </div>

      {/* Audit Runs List & Violation Detail */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Compliance Audit Reports & Violations Log</h3>
          <p className="text-xs text-slate-500">View detailed clause non-compliances, scores, and regulatory summaries</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {audits.map((a) => (
            <div key={a._id || a.auditId} className="p-6 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{a.title}</span>
                    <span className="text-xs font-mono text-slate-400">({a.auditId})</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">Standard: {a.standard} • Auditor: {a.auditorName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">{a.complianceScore}%</span>
                    <span className={`block text-[10px] font-bold uppercase ${a.status === 'PASSED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {a.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert(`Exporting PDF audit report for ${a.auditId}...`)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
                    title="Export Audit Report PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                {a.summary}
              </p>

              {/* Violations section */}
              {a.violationsFound && a.violationsFound.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Identified Non-Compliance Clauses:</span>
                  {a.violationsFound.map((v, i) => (
                    <div key={i} className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
                      <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-rose-700 dark:text-rose-300">{v.code} - {v.clause}</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{v.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
