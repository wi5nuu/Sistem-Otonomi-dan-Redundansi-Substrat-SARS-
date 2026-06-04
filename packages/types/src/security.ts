export type SecuritySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type SecurityCategory = 'AUTH' | 'INTRUSION' | 'ANOMALY' | 'COMPLIANCE' | 'INTEGRITY';
export type CertStatus = 'VALID' | 'EXPIRING' | 'EXPIRED' | 'REVOKED';

export interface SecurityEvent {
  id: string;
  nodeId: string | null;
  datacenterId: string | null;
  severity: SecuritySeverity;
  category: SecurityCategory;
  title: string;
  description: string;
  rawPayload: Record<string, unknown>;
  resolvedAt: string | null;
  createdAt: string;
}

export interface Certificate {
  id: string;
  domain: string;
  issuer: string;
  algorithm: string;
  validFrom: string;
  validUntil: string;
  autoRenew: boolean;
  status: CertStatus;
}
