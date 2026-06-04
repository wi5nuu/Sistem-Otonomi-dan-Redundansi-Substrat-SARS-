'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string, name: string, role: string, token: string) => void;
  logout: () => void;
  setUserRole: (role: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      userRole: null,
      token: null,
      isAuthenticated: false,
      login: (userId, userName, userRole, token) =>
        set({ userId, userName, userRole, token, isAuthenticated: true }),
      logout: () =>
        set({ userId: null, userName: null, userRole: null, token: null, isAuthenticated: false }),
      setUserRole: (userRole) => set({ userRole }),
    }),
    { name: 'sars-auth' },
  ),
);
