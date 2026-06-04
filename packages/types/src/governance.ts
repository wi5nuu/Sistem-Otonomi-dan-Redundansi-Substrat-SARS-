export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR' | 'AUDITOR' | 'VIEWER';
export type OrgType = 'OPERATOR' | 'AUDITOR' | 'GOVERNANCE_BOARD';
export type ApprovalRequestType =
  | 'CONFIG_CHANGE'
  | 'NODE_DEACTIVATION'
  | 'REGION_FAILOVER'
  | 'EMERGENCY_SHUTDOWN'
  | 'POLICY_CHANGE';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type ApprovalDecision = 'APPROVE' | 'REJECT';
export type ComplianceFramework = 'GDPR' | 'ISO27001' | 'NIST_800_53' | 'SOC2' | 'LOCAL';
export type ComplianceStatus = 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  organizationId: string;
  createdAt: string;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  requestedBy: string;
  title: string;
  description: string;
  type: ApprovalRequestType;
  payload: Record<string, unknown>;
  requiredApprovers: number;
  currentApprovals: number;
  status: ApprovalStatus;
  expiresAt: string;
  resolvedAt: string | null;
}

export interface Approval {
  id: string;
  requestId: string;
  approverId: string;
  decision: ApprovalDecision;
  comment: string;
  signedAt: string;
  cryptoSignature: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  systemActor: string | null;
  action: string;
  resource: string;
  resourceId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  immutableHash: string;
  timestamp: string;
}

export interface ComplianceCheck {
  id: string;
  checkName: string;
  framework: ComplianceFramework;
  regionCode: string;
  status: ComplianceStatus;
  details: string;
  checkedAt: string;
  nextCheckAt: string;
}
