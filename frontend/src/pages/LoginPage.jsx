import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Factory, 
  Cpu, 
  Cloud, 
  Database, 
  Bot, 
  LineChart, 
  FileText, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Layers, 
  Server, 
  Loader2,
  UserCheck,
  Wrench,
  FileCheck
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeDemoCard, setActiveDemoCard] = useState(null);

  // Demo User Profiles
  const demoUsers = [
    {
      id: 'admin',
      roleTitle: 'Administrator',
      email: 'admin@company.com',
      password: 'admin123',
      altEmail: 'Amanadmin@gmail.com',
      altPassword: 'Aman@123456',
      icon: ShieldCheck,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      buttonBg: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
    },
    {
      id: 'engineer',
      roleTitle: 'Engineer',
      email: 'engineer@company.com',
      password: 'engineer123',
      icon: Cpu,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      buttonBg: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
    },
    {
      id: 'maintenance',
      roleTitle: 'Maintenance',
      email: 'maintenance@company.com',
      password: 'maintenance123',
      icon: Wrench,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      buttonBg: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
    },
    {
      id: 'auditor',
      roleTitle: 'Auditor',
      email: 'auditor@company.com',
      password: 'auditor123',
      icon: FileCheck,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
    }
  ];

  const handleLoginSubmit = async (e, customEmail = null, customPass = null) => {
    if (e) e.preventDefault();
    
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    if (!targetEmail || !targetPass) {
      setToastMessage({ type: 'error', text: 'Please fill in both email and password.' });
      return;
    }

    const result = await login(targetEmail, targetPass);
    if (result.success) {
      setToastMessage({ type: 'success', text: `Authenticated successfully. Welcome back!` });
      setTimeout(() => navigate('/dashboard'), 500);
    } else {
      setToastMessage({ type: 'error', text: result.error || 'Authentication failed. Please check credentials.' });
    }
  };

  const handleSelectDemo = (demo) => {
    setActiveDemoCard(demo.id);
    setEmail(demo.email);
    setPassword(demo.password);
    setToastMessage({ type: 'info', text: `Filled credentials for ${demo.roleTitle}. Click Sign In to continue.` });
  };

  const handleQuickDemoLogin = async (demo) => {
    setActiveDemoCard(demo.id);
    setEmail(demo.email);
    setPassword(demo.password);
    await handleLoginSubmit(null, demo.email, demo.password);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Background Glow & Dynamic Ambient Particles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-sm font-medium ${
            toastMessage.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' :
            toastMessage.type === 'info' ? 'bg-blue-950/80 border-blue-500/40 text-blue-200' :
            'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
             toastMessage.type === 'info' ? <Sparkles className="w-5 h-5 text-blue-400" /> :
             <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEFT SIDE: HERO SECTION */}
      {/* ========================================================= */}
      <div className="lg:w-[52%] p-8 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950">
        
        {/* Top Branding Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Factory className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                FactoryIQ
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  v2.4 Enterprise
                </span>
              </span>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                AI-POWERED Industrial Knowledge Intelligence
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Industry 4.0 Active
          </div>
        </div>

        {/* Hero Central Graphic & Copy */}
        <div className="my-12 lg:my-0 space-y-8 max-w-xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Enterprise Industrial AI & Knowledge Graph Platform
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Smart Factory Knowledge <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Powered by Generative AI
              </span>
            </h1>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
              Transform industrial knowledge into intelligent operational decisions using Artificial Intelligence, 
              Retrieval-Augmented Generation (RAG), Knowledge Graphs, and Predictive Maintenance Analytics.
            </p>
          </div>

          {/* Interactive Graphic & Neural Nodes */}
          <div className="relative p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Operational Neural Grid</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">SOC-2 Type II Certified</span>
            </div>

            {/* Neural Floating Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
                <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">RAG AI Engine</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-cyan-500/40 transition-colors">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">Knowledge Graph</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-indigo-500/40 transition-colors">
                <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">Failure Agents</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-emerald-500/40 transition-colors">
                <LineChart className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">Equipment Health</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-amber-500/40 transition-colors">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">SOP OCR Reader</span>
              </div>
              <div className="p-3 bg-slate-950/50 border border-slate-800/60 rounded-xl flex items-center gap-2.5 hover:border-purple-500/40 transition-colors">
                <Database className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-medium text-slate-300">Vector Search</span>
              </div>
            </div>
          </div>

          {/* Floating Badges Stack */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              In-Process Async Worker System
            </span>
            <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Third-Party Redis Lock
            </span>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-900 pt-6">
          <p>© {new Date().getFullYear()} FactoryIQ Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: LOGIN CARD & DEMO ACCESS */}
      {/* ========================================================= */}
      <div className="lg:w-[48%] p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center relative z-10 bg-slate-950/40">
        
        <div className="w-full max-w-lg space-y-8">

          {/* MAIN LOGIN CARD */}
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>

            {/* Login Card Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 text-sm mt-1">
                Sign in to access your industrial intelligence dashboard.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-6 p-4 bg-rose-950/50 border border-rose-800/60 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all font-mono"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-slate-400">Keep me signed in on this device</span>
                </label>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:underline font-semibold">
                  Request access
                </Link>
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* DEMO LOGIN SECTION (4 Quick Access Cards) */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Quick Demo Role Access
              </span>
              <span className="text-[11px] text-slate-500">One-click auto fill & login</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoUsers.map((demo) => {
                const IconComponent = demo.icon;
                const isSelected = activeDemoCard === demo.id;

                return (
                  <div
                    key={demo.id}
                    className={`p-4 bg-slate-900/80 backdrop-blur-md border rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-900' : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                    onClick={() => handleSelectDemo(demo)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl border ${demo.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-white">{demo.roleTitle}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${demo.badgeBg}`}>
                          {demo.id}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-slate-400 space-y-0.5">
                        <p className="truncate"><span className="text-slate-500">e:</span> {demo.email}</p>
                        <p><span className="text-slate-500">p:</span> {demo.password}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickDemoLogin(demo);
                        }}
                        className={`w-full py-1.5 px-3 text-xs font-bold text-white rounded-lg shadow-md transition-all ${demo.buttonBg} flex items-center justify-center gap-1`}
                      >
                        <span>Login as {demo.roleTitle}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
