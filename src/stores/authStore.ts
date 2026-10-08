import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/shared/api/client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'agency';
  name?: string;
  agencyName?: string;
  telephone?: string;
  passwordChangeRequired?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (values: { nomAgence: string; nomResponsable: string; email: string; telephone: string; password: string; confirmPassword?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('keurguipay-token', data.token);
    set({ token: data.token, user: data.user, isAuthenticated: true });
    window.dispatchEvent(new Event('keurguipay:session-started'));
    return Boolean(data.mustChangePassword || data.user.passwordChangeRequired);
  },
  register: async (values) => {
    const { data } = await api.post('/auth/register', values);
    localStorage.setItem('keurguipay-token', data.token);
    set({ token: data.token, user: data.user, isAuthenticated: true });
    window.dispatchEvent(new Event('keurguipay:session-started'));
  },
  refreshUser: async () => {
    if (!get().token) return;
    const { data } = await api.get('/auth/me');
    set({ user: data.user, isAuthenticated: true });
  },
  changePassword: async (currentPassword, newPassword) => {
    await api.patch('/auth/me/password', { currentPassword, newPassword });
    set((state) => ({ user: state.user ? { ...state.user, passwordChangeRequired: false } : null }));
  },
  logout: () => {
    localStorage.removeItem('keurguipay-token');
    set({ user: null, token: null, isAuthenticated: false });
    window.dispatchEvent(new Event('keurguipay:session-ended'));
  },
}), {
  name: 'keurguipay-auth-v2',
  onRehydrateStorage: () => (state) => {
    if (state?.token) localStorage.setItem('keurguipay-token', state.token);
  },
}));
