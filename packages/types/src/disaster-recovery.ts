export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'DETECTED' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ActorType = 'SYSTEM' | 'HUMAN';
export type FailoverJobStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedRegions: string[];
  affectedDatacenters: number[];
  detectedAt: string;
  acknowledgedAt: string | null;
  mitigatedAt: string | null;
  resolvedAt: string | null;
  rootCause: string | null;
  postMortemUrl: string | null;
  createdBy: string;
}

export interface IncidentTimelineEntry {
  id: string;
  incidentId: string;
  timestamp: string;
  actorId: string | null;
  actorType: ActorType;
  action: string;
  details: Record<string, unknown>;
}

export interface FailoverJob {
  id: string;
  incidentId: string | null;
  sourceNodeId: string;
  targetNodeId: string;
  status: FailoverJobStatus;
  startedAt: string | null;
  completedAt: string | null;
  logs: string;
}

export interface Runbook {
  id: string;
  title: string;
  slug: string;
  category: string;
  version: number;
  content: string;
  automatable: boolean;
  lastReviewedAt: string | null;
  createdBy: string;
  updatedAt: string;
}
