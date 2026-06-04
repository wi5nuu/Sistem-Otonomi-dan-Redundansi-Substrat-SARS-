'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { isAuthenticated, userId, userName, userRole, login, logout, token } = useAuthStore();
  const router = useRouter();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      login(data.userId, data.name, data.role, data.token);
      router.push('/');
    } catch (err) {
      throw err;
    }
  }, [login, router]);

  const signOut = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return { isAuthenticated, userId, userName, userRole, token, signIn, signOut };
}
