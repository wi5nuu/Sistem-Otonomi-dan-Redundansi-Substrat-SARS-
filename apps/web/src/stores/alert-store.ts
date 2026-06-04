'use client';

import { create } from 'zustand';

interface Alert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  status: 'FIRING' | 'ACKNOWLEDGED' | 'RESOLVED';
  firedAt: string;
}

interface AlertState {
  alerts: Alert[];
  unacknowledgedCount: number;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  unacknowledgedCount: 0,
  setAlerts: (alerts) => set({ alerts, unacknowledgedCount: alerts.filter(a => a.status === 'FIRING').length }),
  addAlert: (alert) => set((s) => ({ 
    alerts: [alert, ...s.alerts],
    unacknowledgedCount: alert.status === 'FIRING' ? s.unacknowledgedCount + 1 : s.unacknowledgedCount,
  })),
  acknowledgeAlert: (id) => set((s) => {
    const alerts = s.alerts.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' as const } : a);
    return { alerts, unacknowledgedCount: alerts.filter(a => a.status === 'FIRING').length };
  }),
  resolveAlert: (id) => set((s) => {
    const alerts = s.alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED' as const } : a);
    return { alerts, unacknowledgedCount: alerts.filter(a => a.status === 'FIRING').length };
  }),
}));
