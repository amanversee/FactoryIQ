import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function UnauthorizedPage({ requiredRoles }) {
  const { user, getRoleHomeRoute } = useAuthStore();
  const homeRoute = getRoleHomeRoute(user?.role);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 border border-rose-500/30 animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-rose-200 dark:border-rose-800">
        403 Access Restricted
      </span>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Permission Denied
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Your current account role <span className="font-mono font-bold text-rose-600 dark:text-rose-400">[{user?.role || 'UNAUTHORIZED'}]</span> does not have privilege to view this workspace. Every FactoryIQ route enforces role-based security policies.
      </p>

      <div className="bg-slate-900/5 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 mb-8 max-w-md w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>Required Privilege Level:</span>
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
          {requiredRoles?.join(' / ')}
        </span>
      </div>

      <Link
        to={homeRoute}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to My Workspace Dashboard
      </Link>
    </div>
  );
}
