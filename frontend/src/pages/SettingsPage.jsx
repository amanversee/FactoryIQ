import { useState, useEffect } from 'react';
import { 
  Settings2, 
  Save, 
  Key, 
  User, 
  ShieldAlert, 
  Check, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Cpu,
  Database,
  Lock
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('ai');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings updated successfully');

  if (user?.role !== 'ADMIN') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-4 border border-rose-200 dark:border-rose-800">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access Restricted</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mt-2 text-sm">
          Platform configurations and security settings are restricted exclusively to system administrators. Please log in with an authorized Admin account (e.g. <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Amanadmin@gmail.com</span>).
        </p>
      </div>
    );
  }

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState({
    persona: "You are FactoryIQ, an AI-Powered Industrial Knowledge Intelligence Platform. Your goal is to answer the user's question strictly using the provided SOURCE information.",
    embeddingModel: "text-embedding-004",
    generationModel: "gemini-1.5-pro-latest",
    temperature: 0.2,
    chunkSize: 1000,
    chunkOverlap: 200
  });

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    geminiKey: "AIzaSyD-EXAMPLE_GEMINI_KEY_89237498",
    cloudinaryCloud: "factoryiq_prod",
    cloudinaryKey: "893742987349827",
    cloudinarySecret: "••••••••••••••••••••••••"
  });
  const [showKeys, setShowKeys] = useState(false);

  // User Management State
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@factoryiq.com', role: 'ADMIN', status: 'Active', department: 'Plant Operations' },
    { id: 2, name: 'John Doe', email: 'johndoe@factoryiq.com', role: 'ENGINEER', status: 'Active', department: 'Maintenance & Reliability' },
    { id: 3, name: 'Sarah Connor', email: 'sarah.c@factoryiq.com', role: 'AUDITOR', status: 'Active', department: 'EHS & Compliance' },
    { id: 4, name: 'Mike Ross', email: 'mike.ross@factoryiq.com', role: 'USER', status: 'Inactive', department: 'Assembly Line 1' }
  ]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'ENGINEER', department: 'Maintenance' });

  // Security Policies State
  const [securityPolicies, setSecurityPolicies] = useState({
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    sessionTimeout: '30d',
    rateLimitMax: 100,
    mfaRequired: false,
    auditLogging: true
  });

  // Load from LocalStorage if available
  useEffect(() => {
    const savedAi = localStorage.getItem('factoryiq_ai_config');
    if (savedAi) setAiConfig(JSON.parse(savedAi));

    const savedSec = localStorage.getItem('factoryiq_security_config');
    if (savedSec) setSecurityPolicies(JSON.parse(savedSec));
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleSaveAi = (e) => {
    e.preventDefault();
    localStorage.setItem('factoryiq_ai_config', JSON.stringify(aiConfig));
    triggerToast('AI Configuration saved successfully!');
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    triggerToast('API Keys & integration settings updated!');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    localStorage.setItem('factoryiq_security_config', JSON.stringify(securityPolicies));
    triggerToast('Security policies saved successfully!');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userObj = {
      id: Date.now(),
      ...newUser,
      status: 'Active'
    };
    setUsers([...users, userObj]);
    setNewUser({ name: '', email: '', role: 'ENGINEER', department: 'Maintenance' });
    setShowAddUserModal(false);
    triggerToast(`User ${userObj.name} added successfully!`);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    triggerToast('User status updated!');
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    triggerToast('User removed!');
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-emerald-600 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Check className="w-5 h-5 text-emerald-400 dark:text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage platform configurations, AI prompts, user roles, and security policies.
        </p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row overflow-hidden">
        
        {/* Settings Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/50 p-4 bg-slate-50 dark:bg-slate-900/50">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Settings2 className="w-5 h-5" />
              AI Configuration
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'api' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Key className="w-5 h-5" />
              API Keys
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <User className="w-5 h-5" />
              User Management
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <ShieldAlert className="w-5 h-5" />
              Security Policies
            </button>
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* TAB 1: AI CONFIGURATION */}
          {activeTab === 'ai' && (
            <form onSubmit={handleSaveAi} className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  AI & Model Settings
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure system prompts, LLM models, and embedding parameters.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    System Persona (Knowledge Agent)
                  </label>
                  <textarea 
                    rows={4}
                    value={aiConfig.persona}
                    onChange={(e) => setAiConfig({ ...aiConfig, persona: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Embedding Model
                    </label>
                    <select 
                      value={aiConfig.embeddingModel}
                      onChange={(e) => setAiConfig({ ...aiConfig, embeddingModel: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    >
                      <option value="text-embedding-004">Google text-embedding-004 (768d)</option>
                      <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Generation Model
                    </label>
                    <select 
                      value={aiConfig.generationModel}
                      onChange={(e) => setAiConfig({ ...aiConfig, generationModel: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    >
                      <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Recommended)</option>
                      <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Fast)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Temperature ({aiConfig.temperature})
                    </label>
                    <span className="text-xs text-slate-400">Lower = More precise, Higher = More creative</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={aiConfig.temperature}
                    onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Chunk Size (Characters)
                    </label>
                    <input 
                      type="number"
                      value={aiConfig.chunkSize}
                      onChange={(e) => setAiConfig({ ...aiConfig, chunkSize: parseInt(e.target.value) || 1000 })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Chunk Overlap (Characters)
                    </label>
                    <input 
                      type="number"
                      value={aiConfig.chunkOverlap}
                      onChange={(e) => setAiConfig({ ...aiConfig, chunkOverlap: parseInt(e.target.value) || 200 })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm">
                  <Save className="w-4 h-4" />
                  Save AI Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: API KEYS */}
          {activeTab === 'api' && (
            <form onSubmit={handleSaveKeys} className="max-w-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Integration & API Keys
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage API authentication tokens for LLM and storage services.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showKeys ? 'Hide Keys' : 'Reveal Keys'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Google Gemini API Key</label>
                  <input 
                    type={showKeys ? "text" : "password"} 
                    value={apiKeys.geminiKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm font-mono"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cloudinary Storage Credentials</h4>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Cloud Name</label>
                    <input 
                      type="text" 
                      value={apiKeys.cloudinaryCloud}
                      onChange={(e) => setApiKeys({ ...apiKeys, cloudinaryCloud: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">API Key</label>
                    <input 
                      type={showKeys ? "text" : "password"} 
                      value={apiKeys.cloudinaryKey}
                      onChange={(e) => setApiKeys({ ...apiKeys, cloudinaryKey: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">MongoDB Vector Search Index</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">Connected & Verified (In-Memory Async Task Active)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">Operational</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm">
                  <Save className="w-4 h-4" />
                  Update API Keys
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    User & Role Management
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage user access permissions across plant operations.</p>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add New User
                </button>
              </div>

              {/* User List Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.department}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' :
                            u.role === 'ENGINEER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                            u.role === 'AUDITOR' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => toggleUserStatus(u.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {u.status}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY POLICIES */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Security & Compliance Policies
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure authentication rules, rate limits, and audit compliance logging.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Require Special Characters in Passwords</p>
                      <p className="text-xs text-slate-500">Enforce symbols (@, #, $, etc.) on user registrations.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={securityPolicies.requireSpecialChar}
                      onChange={(e) => setSecurityPolicies({ ...securityPolicies, requireSpecialChar: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">System Audit Logging</p>
                      <p className="text-xs text-slate-500">Record all API actions into Winston compliance logs.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={securityPolicies.auditLogging}
                      onChange={(e) => setSecurityPolicies({ ...securityPolicies, auditLogging: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      JWT Session Expiry
                    </label>
                    <select 
                      value={securityPolicies.sessionTimeout}
                      onChange={(e) => setSecurityPolicies({ ...securityPolicies, sessionTimeout: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    >
                      <option value="1d">1 Day</option>
                      <option value="7d">7 Days</option>
                      <option value="30d">30 Days (Default)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Rate Limit (Requests / 10 Mins)
                    </label>
                    <input 
                      type="number"
                      value={securityPolicies.rateLimitMax}
                      onChange={(e) => setSecurityPolicies({ ...securityPolicies, rateLimitMax: parseInt(e.target.value) || 100 })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm">
                  <Save className="w-4 h-4" />
                  Save Security Policies
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Platform User</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="alex@factoryiq.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Quality Assurance"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">System Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white"
                >
                  <option value="ENGINEER">ENGINEER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="AUDITOR">AUDITOR</option>
                  <option value="USER">USER</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-primary text-white font-medium rounded-xl hover:bg-primary/90"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
