import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  // Login action
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.error || 'Login failed'
      });
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  // Register action
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.error || 'Registration failed'
      });
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },

  // Get default home route for a given user role
  getRoleHomeRoute: (role) => {
    switch (role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'ENGINEER':
        return '/dashboard/engineer';
      case 'MAINTENANCE_TEAM':
        return '/dashboard/maintenance';
      case 'AUDITOR':
        return '/dashboard/auditor';
      default:
        return '/dashboard/engineer';
    }
  },

  // Demo action to quickly switch active role context for evaluation
  switchRoleDemo: (newRole) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        role: newRole,
        name: newRole === 'ADMIN' ? 'Aman Administrator' :
              newRole === 'ENGINEER' ? 'Lead Industrial Engineer' :
              newRole === 'MAINTENANCE_TEAM' ? 'Senior Maintenance Lead' :
              'Chief Compliance Auditor'
      };
      return { user: updatedUser };
    });
  },

  // Check auth and fetch user profile
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching user profile', error);
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false 
      });
    }
  }
}));

export default useAuthStore;
