export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'FIRING' | 'ACKNOWLEDGED' | 'RESOLVED';
export type AlertChannel = 'email' | 'slack' | 'pagerduty' | 'webhook';

export interface AlertRule {
  id: string;
  name: string;
  layerType: string;
  metric: string;
  operator: string;
  threshold: number;
  severity: AlertSeverity;
  cooldownMinutes: number;
  channels: AlertChannel[];
  isActive: boolean;
  createdBy: string;
}

export interface Alert {
  id: string;
  ruleId: string | null;
  severity: AlertSeverity;
  title: string;
  message: string;
  affectedResource: string;
  status: AlertStatus;
  firedAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  acknowledgedBy: string | null;
}
