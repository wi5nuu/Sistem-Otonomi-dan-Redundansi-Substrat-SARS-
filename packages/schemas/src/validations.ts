import { z } from 'zod';

export const regionCodeSchema = z.enum(['AMERICAS', 'EUROPE', 'APAC', 'AFRICA', 'ARCTIC']);
export const regionStatusSchema = z.enum(['ONLINE', 'DEGRADED', 'OFFLINE', 'MAINTENANCE']);
export const dcTierSchema = z.enum(['T1', 'T2', 'T3', 'T4']);
export const coolingTypeSchema = z.enum(['AIR', 'LIQUID', 'HYBRID', 'FREE_AIR']);
export const nodeArchitectureSchema = z.enum(['X86_64', 'ARM64', 'RISC_V']);
export const nodeStatusSchema = z.enum(['ACTIVE', 'DEGRADED', 'OFFLINE', 'MAINTENANCE']);
export const storageTierSchema = z.enum(['HOT', 'WARM', 'COLD', 'ARCHIVE']);
export const energyTypeSchema = z.enum(['SOLAR', 'GRID', 'HYDRO', 'WIND', 'DIESEL', 'HYDROGEN']);
export const networkLinkTypeSchema = z.enum(['DARK_FIBER', 'LEASED_LINE', 'SATELLITE', 'INTERNET']);
export const securitySeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']);
export const securityCategorySchema = z.enum(['AUTH', 'INTRUSION', 'ANOMALY', 'COMPLIANCE', 'INTEGRITY']);
export const certStatusSchema = z.enum(['VALID', 'EXPIRING', 'EXPIRED', 'REVOKED']);
export const incidentSeveritySchema = z.enum(['P1', 'P2', 'P3', 'P4']);
export const incidentStatusSchema = z.enum(['DETECTED', 'TRIAGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);
export const failoverJobStatusSchema = z.enum(['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'ROLLED_BACK']);
export const userRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'AUDITOR', 'VIEWER']);
export const orgTypeSchema = z.enum(['OPERATOR', 'AUDITOR', 'GOVERNANCE_BOARD']);
export const approvalRequestTypeSchema = z.enum([
  'CONFIG_CHANGE', 'NODE_DEACTIVATION', 'REGION_FAILOVER',
  'EMERGENCY_SHUTDOWN', 'POLICY_CHANGE',
]);
export const approvalStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED']);
export const approvalDecisionSchema = z.enum(['APPROVE', 'REJECT']);
export const complianceFrameworkSchema = z.enum(['GDPR', 'ISO27001', 'NIST_800_53', 'SOC2', 'LOCAL']);
export const complianceStatusSchema = z.enum(['PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE']);
export const alertSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
export const alertStatusSchema = z.enum(['FIRING', 'ACKNOWLEDGED', 'RESOLVED']);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const auditLogFilterSchema = z.object({
  action: z.string().optional(),
  resource: z.string().optional(),
  userId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().optional(),
}).merge(paginationSchema);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: userRoleSchema,
  organizationId: z.string().uuid(),
});

export const approvalActionSchema = z.object({
  requestId: z.string().uuid(),
  decision: approvalDecisionSchema,
  comment: z.string().min(10).max(2000),
});

export const alertRuleSchema = z.object({
  name: z.string().min(1).max(255),
  layerType: z.string().min(1).max(50),
  metric: z.string().min(1).max(100),
  operator: z.enum(['>', '<', '>=', '<=', '==', '!=']),
  threshold: z.number(),
  severity: alertSeveritySchema,
  cooldownMinutes: z.number().int().positive().default(5),
  channels: z.array(z.enum(['email', 'slack', 'pagerduty', 'webhook'])).min(1),
});

export const createAlertRuleSchema = alertRuleSchema;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255),
});

export const createAuditLogSchema = z.object({
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(100),
  resourceId: z.string().min(1).max(255),
  userId: z.string().uuid().optional(),
  systemActor: z.string().optional(),
  before: z.any().optional(),
  after: z.any().optional(),
  ipAddress: z.string().min(1).max(45),
  userAgent: z.string().min(1),
  sessionId: z.string().min(1).max(255),
});

export const createApprovalSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  type: approvalRequestTypeSchema,
  payload: z.any().optional(),
  requiredApprovers: z.number().int().positive().default(3),
  expiresAt: z.string().datetime(),
});

export const createNodeSchema = z.object({
  datacenterId: z.string().uuid(),
  hostname: z.string().min(1).max(255),
  ipAddress: z.string().min(1).max(45),
  architecture: nodeArchitectureSchema.default('X86_64'),
  vendor: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  cpuCores: z.number().int().positive(),
  ramGb: z.number().int().positive(),
});

export const createDatacenterSchema = z.object({
  regionId: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  tier: dcTierSchema.default('T2'),
  powerCapacityKw: z.number().positive(),
  coolingType: coolingTypeSchema.default('AIR'),
});

export const createNetworkLinkSchema = z.object({
  sourceDcId: z.string().uuid(),
  targetDcId: z.string().uuid(),
  type: networkLinkTypeSchema,
  bandwidthGbps: z.number().positive(),
  latencyMs: z.number().min(0),
  provider: z.string().min(1).max(255),
  redundancyLevel: z.number().int().positive().default(1),
});
