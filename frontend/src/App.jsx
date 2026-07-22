import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import RoleGuard from './components/RoleGuard';
import useAuthStore from './store/authStore';

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const RoleChatPage = lazy(() => import('./pages/RoleChatPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Role Dashboards & Features
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const AIMonitoringPage = lazy(() => import('./pages/admin/AIMonitoringPage'));

const EngineerWorkspace = lazy(() => import('./pages/engineer/EngineerWorkspace'));

const MaintenanceWorkspace = lazy(() => import('./pages/maintenance/MaintenanceWorkspace'));
const WorkOrdersPage = lazy(() => import('./pages/maintenance/WorkOrdersPage'));
const AIPredictionsPage = lazy(() => import('./pages/maintenance/AIPredictionsPage'));

const ComplianceWorkspace = lazy(() => import('./pages/auditor/ComplianceWorkspace'));

// Fallback loader
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, getRoleHomeRoute } = useAuthStore();
  if (isAuthenticated) {
    const target = getRoleHomeRoute(user?.role);
    return <Navigate to={target} replace />;
  }
  return children;
};

// Component to dynamically route /dashboard base to role landing page
const RoleDashboardRedirect = () => {
  const { user, getRoleHomeRoute } = useAuthStore();
  const target = getRoleHomeRoute(user?.role);
  return <Navigate to={target} replace />;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          </Route>
          
          {/* Protected Main Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            
            {/* Base Redirect */}
            <Route index element={<RoleDashboardRedirect />} />

            {/* ========================================================= */}
            {/* ADMIN ROUTES */}
            {/* ========================================================= */}
            <Route path="admin" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><UserManagementPage /></RoleGuard>} />
            <Route path="admin/departments" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/equipment" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/documents" element={<RoleGuard allowedRoles={['ADMIN']}><DocumentsPage /></RoleGuard>} />
            <Route path="admin/ai-monitoring" element={<RoleGuard allowedRoles={['ADMIN']}><AIMonitoringPage /></RoleGuard>} />
            <Route path="admin/analytics" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/notifications" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/audit-logs" element={<RoleGuard allowedRoles={['ADMIN']}><AIMonitoringPage /></RoleGuard>} />
            <Route path="admin/reports" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="admin/settings" element={<RoleGuard allowedRoles={['ADMIN']}><SettingsPage /></RoleGuard>} />

            {/* ========================================================= */}
            {/* ENGINEER ROUTES */}
            {/* ========================================================= */}
            <Route path="engineer" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><EngineerWorkspace /></RoleGuard>} />
            <Route path="engineer/chat" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><RoleChatPage /></RoleGuard>} />
            <Route path="engineer/upload" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><DocumentsPage /></RoleGuard>} />
            <Route path="engineer/documents" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><DocumentsPage /></RoleGuard>} />
            <Route path="engineer/graph" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><KnowledgeGraphPage /></RoleGuard>} />
            <Route path="engineer/equipment" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><EngineerWorkspace /></RoleGuard>} />
            <Route path="engineer/inspections" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><EngineerWorkspace /></RoleGuard>} />
            <Route path="engineer/incidents" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><EngineerWorkspace /></RoleGuard>} />
            <Route path="engineer/reports" element={<RoleGuard allowedRoles={['ENGINEER', 'ADMIN']}><EngineerWorkspace /></RoleGuard>} />

            {/* ========================================================= */}
            {/* MAINTENANCE TEAM ROUTES */}
            {/* ========================================================= */}
            <Route path="maintenance" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><MaintenanceWorkspace /></RoleGuard>} />
            <Route path="maintenance/work-orders" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><WorkOrdersPage /></RoleGuard>} />
            <Route path="maintenance/equipment" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><MaintenanceWorkspace /></RoleGuard>} />
            <Route path="maintenance/schedules" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><WorkOrdersPage /></RoleGuard>} />
            <Route path="maintenance/history" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><MaintenanceWorkspace /></RoleGuard>} />
            <Route path="maintenance/predictions" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><AIPredictionsPage /></RoleGuard>} />
            <Route path="maintenance/reports" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><MaintenanceWorkspace /></RoleGuard>} />
            <Route path="maintenance/notifications" element={<RoleGuard allowedRoles={['MAINTENANCE_TEAM', 'ADMIN']}><MaintenanceWorkspace /></RoleGuard>} />

            {/* ========================================================= */}
            {/* COMPLIANCE AUDITOR ROUTES */}
            {/* ========================================================= */}
            <Route path="auditor" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><ComplianceWorkspace /></RoleGuard>} />
            <Route path="auditor/compliance" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><ComplianceWorkspace /></RoleGuard>} />
            <Route path="auditor/reports" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><ComplianceWorkspace /></RoleGuard>} />
            <Route path="auditor/documents" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><DocumentsPage /></RoleGuard>} />
            <Route path="auditor/standards" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><ComplianceWorkspace /></RoleGuard>} />
            <Route path="auditor/notifications" element={<RoleGuard allowedRoles={['AUDITOR', 'ADMIN']}><ComplianceWorkspace /></RoleGuard>} />

            {/* Shared Generic Routes */}
            <Route path="chat" element={<RoleChatPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="graph" element={<KnowledgeGraphPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<SettingsPage />} />

          </Route>

          {/* Catch-all redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
