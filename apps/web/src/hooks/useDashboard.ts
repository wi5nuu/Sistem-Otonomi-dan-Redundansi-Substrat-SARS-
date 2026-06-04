'use client';

import { useQuery } from '@tanstack/react-query';

export function useGlobalHealth() {
  return useQuery({
    queryKey: ['global-health'],
    queryFn: async () => {
      const res = await fetch('/api/metrics/global-health');
      if (!res.ok) throw new Error('Failed to fetch health');
      return res.json();
    },
    refetchInterval: 30000,
  });
}

export function useActiveAlerts() {
  return useQuery({
    queryKey: ['alerts', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/alerts?status=FIRING');
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    },
    refetchInterval: 10000,
  });
}
