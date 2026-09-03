import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  email: string;
  role: 'admin' | 'agency';
  name?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) => {
        const isAdmin = email.trim().toLowerCase() === 'admin@keurguipay.sn';
        const user: AuthUser = {
          email: email.trim().toLowerCase(),
          role: isAdmin ? 'admin' : 'agency',
          name: isAdmin ? 'Super Administrateur' : 'Agence immo221',
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'keurguipay-auth',
    }
  )
);
