'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAlertStore } from '@/stores/alert-store';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useWebSocket(url?: string) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const maxRetryDelay = 30000;
  const addAlert = useAlertStore((s) => s.addAlert);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setStatus('connecting');
    
    const ws = new WebSocket(url || `ws://${window.location.hostname}:4000/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      retryCountRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ALERT_FIRED') addAlert(data.payload);
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), maxRetryDelay);
      retryCountRef.current++;
      setTimeout(connect, delay);
    };

    ws.onerror = () => {
      setStatus('error');
      ws.close();
    };
  }, [url, addAlert]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  return { status, reconnect: connect };
}
