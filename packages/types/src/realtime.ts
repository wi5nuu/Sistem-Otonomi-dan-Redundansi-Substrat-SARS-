import type { Alert } from './alerts.js';
import type { ApprovalRequest, ApprovalStatus } from './governance.js';
import type { Incident, FailoverJob } from './disaster-recovery.js';
import type { NodeStatus } from './compute.js';
import type { EnergySourceType } from './energy.js';

export type LayerType = 'compute' | 'storage' | 'energy' | 'network' | 'security' | 'disaster-recovery' | 'governance';

export interface LayerMetrics {
  health: number;
  activeAlerts: number;
  criticalCount: number;
  [key: string]: number | string | boolean;
}

export type WSEvent =
  | { type: 'NODE_STATUS_CHANGE'; payload: { nodeId: string; status: NodeStatus } }
  | { type: 'ALERT_FIRED'; payload: Alert }
  | { type: 'ALERT_RESOLVED'; payload: { alertId: string } }
  | { type: 'INCIDENT_CREATED'; payload: Incident }
  | { type: 'INCIDENT_UPDATED'; payload: { incidentId: string; changes: Partial<Incident> } }
  | { type: 'APPROVAL_REQUESTED'; payload: ApprovalRequest }
  | { type: 'APPROVAL_UPDATED'; payload: { requestId: string; status: ApprovalStatus } }
  | { type: 'METRICS_UPDATE'; payload: { layer: LayerType; metrics: LayerMetrics } }
  | { type: 'ENERGY_FAILOVER'; payload: { datacenterId: string; from: EnergySourceType; to: EnergySourceType } }
  | { type: 'FAILOVER_JOB_UPDATE'; payload: FailoverJob }
  | { type: 'USER_PRESENCE'; payload: { userId: string; page: string; online: boolean } };
