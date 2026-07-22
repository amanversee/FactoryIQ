import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Factory, 
  LayoutDashboard, 
  Files, 
  MessageSquareText, 
  Network, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Users,
  Building2,
  Cpu,
  Activity,
  FileCheck2,
  Wrench,
  AlertTriangle,
  Upload,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  History,
  FileText,
  UserCheck,
  Sliders,
  Sparkles,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '../store/authStore';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, switchRoleDemo, getRoleHomeRoute } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeRole = user?.role || 'ENGINEER';

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Role-Specific Navigation Definitions
  const getNavigationForRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard, category: 'PLATFORM' },
          { name: 'Users', href: '/dashboard/admin/users', icon: Users, category: 'MANAGEMENT' },
          { name: 'Departments', href: '/dashboard/admin/departments', icon: Building2, category: 'MANAGEMENT' },
          { name: 'Equipment', href: '/dashboard/admin/equipment', icon: Cpu, category: 'MANAGEMENT' },
          { name: 'Documents', href: '/dashboard/admin/documents', icon: Files, category: 'KNOWLEDGE' },
          { name: 'AI Monitoring', href: '/dashboard/admin/ai-monitoring', icon: Sparkles, category: 'INTELLIGENCE' },
          { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3, category: 'INTELLIGENCE' },
          { name: 'Audit Logs', href: '/dashboard/admin/audit-logs', icon: Activity, category: 'SYSTEM' },
          { name: 'Reports', href: '/dashboard/admin/reports', icon: FileText, category: 'SYSTEM' },
          { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings, category: 'SYSTEM' },
          { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, category: 'USER' },
        ];
      case 'ENGINEER':
        return [
          { name: 'Workspace', href: '/dashboard/engineer', icon: LayoutDashboard, category: 'ENGINEERING' },
          { name: 'AI Assistant', href: '/dashboard/engineer/chat', icon: MessageSquareText, category: 'INTELLIGENCE' },
          { name: 'Upload Knowledge', href: '/dashboard/engineer/upload', icon: Upload, category: 'KNOWLEDGE' },
          { name: 'Documents', href: '/dashboard/engineer/documents', icon: Files, category: 'KNOWLEDGE' },
          { name: 'Knowledge Graph', href: '/dashboard/engineer/graph', icon: Network, category: 'KNOWLEDGE' },
          { name: 'Equipment', href: '/dashboard/engineer/equipment', icon: Cpu, category: 'OPERATIONAL' },
          { name: 'Inspection Reports', href: '/dashboard/engineer/inspections', icon: ClipboardList, category: 'OPERATIONAL' },
          { name: 'Incidents', href: '/dashboard/engineer/incidents', icon: AlertTriangle, category: 'OPERATIONAL' },
          { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, category: 'USER' },
        ];
      case 'MAINTENANCE_TEAM':
        return [
          { name: 'Maintenance Hub', href: '/dashboard/maintenance', icon: LayoutDashboard, category: 'MAINTENANCE' },
          { name: 'Work Orders', href: '/dashboard/maintenance/work-orders', icon: Wrench, category: 'OPERATIONS' },
          { name: 'Equipment Assets', href: '/dashboard/maintenance/equipment', icon: Cpu, category: 'OPERATIONS' },
          { name: 'AI Predictions', href: '/dashboard/maintenance/predictions', icon: Sparkles, category: 'INTELLIGENCE' },
          { name: 'Maintenance History', href: '/dashboard/maintenance/history', icon: History, category: 'RECORDS' },
          { name: 'Maintenance Reports', href: '/dashboard/maintenance/reports', icon: FileText, category: 'RECORDS' },
          { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, category: 'USER' },
        ];
      case 'AUDITOR':
        return [
          { name: 'Compliance Workspace', href: '/dashboard/auditor', icon: LayoutDashboard, category: 'COMPLIANCE' },
          { name: 'AI Audits', href: '/dashboard/auditor/compliance', icon: FileCheck2, category: 'AUDIT' },
          { name: 'Audit Reports', href: '/dashboard/auditor/reports', icon: ShieldCheck, category: 'AUDIT' },
          { name: 'Document Vault', href: '/dashboard/auditor/documents', icon: Files, category: 'RECORDS' },
          { name: 'ISO Standards', href: '/dashboard/auditor/standards', icon: Sliders, category: 'STANDARDS' },
          { name: 'Profile', href: '/dashboard/profile', icon: UserCheck, category: 'USER' },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigationForRole(activeRole);

  // Categories extraction
  const categories = Array.from(new Set(navigation.map(n => n.category)));

  // Role Notifications
  const roleNotifications = {
    ADMIN: [
      { id: 1, title: 'System Security Alert', desc: 'New user registered requiring department assignment', time: '2m ago', type: 'warning', unread: true },
      { id: 2, title: 'AI Token Threshold', desc: 'Monthly AI query usage at 68% of capacity', time: '1h ago', type: 'info', unread: true }
    ],
    ENGINEER: [
      { id: 3, title: 'Document OCR Complete', desc: 'Hydraulic Pump manual extracted 42 pages into graph', time: '5m ago', type: 'success', unread: true },
      { id: 4, title: 'Inspection Flagged', desc: 'Critical incident logged on Hydraulic Pump P-102', time: '20m ago', type: 'warning', unread: true }
    ],
    MAINTENANCE_TEAM: [
      { id: 5, title: 'Failure Risk Alert', desc: 'Hydraulic Pump P-102 risk score increased to 78%', time: '10m ago', type: 'warning', unread: true },
      { id: 6, title: 'Work Order Assigned', desc: 'Emergency O-ring seal replacement assigned to you', time: '30m ago', type: 'info', unread: true }
    ],
    AUDITOR: [
      { id: 7, title: 'Compliance Audit Ready', desc: 'ISO 9001:2015 automated report ready for export', time: '15m ago', type: 'success', unread: true },
      { id: 8, title: 'Certificate Expiring', desc: 'Heat Exchanger Safety Valve Certificate expired', time: '2h ago', type: 'warning', unread: true }
    ]
  };

  const currentNotifications = roleNotifications[activeRole] || [];
  const unreadCount = currentNotifications.filter(n => n.unread).length;

  const handleRoleSwitch = (newRole) => {
    switchRoleDemo(newRole);
    const targetRoute = getRoleHomeRoute(newRole);
    navigate(targetRoute);
  };

  // Breadcrumb Title Formatter
  const getBreadcrumbTitle = () => {
    const p = location.pathname;
    if (p.includes('/admin/users')) return 'User Access & Permissions';
    if (p.includes('/admin/departments')) return 'Plant Department Structure';
    if (p.includes('/admin/ai-monitoring')) return 'AI Engine & Vector Index Metrics';
    if (p.includes('/admin/audit-logs')) return 'Enterprise System Audit Logs';
    if (p.includes('/engineer/chat')) return 'Industrial RAG AI Assistant';
    if (p.includes('/engineer/graph')) return 'Knowledge Graph Explorer';
    if (p.includes('/engineer/inspections')) return 'Engineering Inspection & Incident Reports';
    if (p.includes('/maintenance/work-orders')) return 'Maintenance Work Orders & Dispatch';
    if (p.includes('/maintenance/predictions')) return 'AI Failure Risk & Predictive Maintenance';
    if (p.includes('/auditor/compliance')) return 'ISO Compliance Verification Engine';
    if (p.includes('/auditor/reports')) return 'Audit Violation Reports & PDF Export';
    
    if (activeRole === 'ADMIN') return 'Platform Administrator Command Center';
    if (activeRole === 'ENGINEER') return 'Engineering Knowledge Creation Workspace';
    if (activeRole === 'MAINTENANCE_TEAM') return 'Maintenance Asset Health & Operations';
    if (activeRole === 'AUDITOR') return 'Compliance & Regulatory Audit Vault';
    return 'Industrial Intelligence Platform';
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* ROLE-BASED SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      {/* ========================================================= */}
      <aside 
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-50 shadow-2xl transition-all duration-300 relative shrink-0",
          // Mobile Drawer styling vs Desktop sidebar
          "fixed inset-y-0 left-0 md:static md:z-20",
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <Link 
            to={getRoleHomeRoute(activeRole)} 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 text-white shrink-0">
              <Factory className="w-5 h-5" />
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  Factory<span className="text-blue-500">IQ</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">
                  Industrial AI
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse button & Mobile Close button */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Role Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {categories.map((category) => {
            const items = navigation.filter(item => item.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                {(!collapsed || mobileMenuOpen) && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    {category}
                  </p>
                )}
                {items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                      {(!collapsed || mobileMenuOpen) && <span>{item.name}</span>}
                      {isActive && (!collapsed || mobileMenuOpen) && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer User Profile & Role Info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={cn("flex items-center gap-3 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800", (collapsed && !mobileMenuOpen) && "justify-center")}>
            <div className={cn(
              "w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md",
              activeRole === 'ADMIN' ? "bg-gradient-to-tr from-purple-600 to-indigo-600" :
              activeRole === 'ENGINEER' ? "bg-gradient-to-tr from-blue-600 to-cyan-600" :
              activeRole === 'MAINTENANCE_TEAM' ? "bg-gradient-to-tr from-amber-600 to-orange-600" :
              "bg-gradient-to-tr from-emerald-600 to-teal-600"
            )}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'User Name'}</p>
                <span className={cn(
                  "inline-block px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded mt-0.5",
                  activeRole === 'ADMIN' ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" :
                  activeRole === 'ENGINEER' ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                  activeRole === 'MAINTENANCE_TEAM' ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                )}>
                  {activeRole}
                </span>
              </div>
            )}
          </div>

          {/* Role Switcher Pills in Mobile Sidebar */}
          <div className="mt-3 md:hidden space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 block">Switch Demo Role</span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { key: 'ADMIN', label: 'Admin' },
                { key: 'ENGINEER', label: 'Engineer' },
                { key: 'MAINTENANCE_TEAM', label: 'Maint' },
                { key: 'AUDITOR', label: 'Auditor' }
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => { handleRoleSwitch(r.key); setMobileMenuOpen(false); }}
                  className={cn(
                    "py-1 px-2 text-[10px] font-bold rounded-lg transition-all text-center",
                    activeRole === r.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={logout}
            className={cn(
              "mt-2 flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors",
              (collapsed && !mobileMenuOpen) && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileMenuOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT CONTAINER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10 sticky top-0">
          
          {/* Left: Mobile Hamburger Toggle & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">FactoryIQ</span>
              <span className="text-slate-400 shrink-0">/</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center relative max-w-sm w-full mx-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeRole.toLowerCase()} documents, equipment, reports...`}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all"
            />
          </div>

          {/* Right Header Utilities & Role Switcher Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Enterprise Role Switcher (Evaluator Quick Toggle) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-blue-500" /> Role:
              </span>
              {[
                { key: 'ADMIN', label: 'Admin' },
                { key: 'ENGINEER', label: 'Engineer' },
                { key: 'MAINTENANCE_TEAM', label: 'Maint' },
                { key: 'AUDITOR', label: 'Auditor' }
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleRoleSwitch(r.key)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                    activeRole === r.key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Role Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>

              {/* Role-Specific Notifications Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{activeRole} Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto my-2">
                    {currentNotifications.map((n) => (
                      <div key={n.id} className="py-3 px-2 rounded-xl transition-colors flex items-start gap-3 bg-blue-50/40 dark:bg-blue-950/20">
                        {n.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> :
                         <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Dismiss Panel
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-auto bg-slate-100/60 dark:bg-slate-950 p-3 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}
