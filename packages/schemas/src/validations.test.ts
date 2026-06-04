import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  createAuditLogSchema,
  createApprovalSchema,
  createAlertRuleSchema,
  createNodeSchema,
  createDatacenterSchema,
  createNetworkLinkSchema,
  paginationSchema,
  approvalActionSchema,
  createUserSchema,
  auditLogFilterSchema,
  dateRangeSchema,
} from './validations.js';

describe('registerSchema', () => {
  const valid = { email: 'test@example.com', password: 'StrongP@ss1', name: 'Test User' };

  it('should validate a valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Ab1' });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = registerSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject password exceeding max length', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'A'.repeat(129) });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  const valid = { email: 'admin@sars.io', password: 'password123' };

  it('should validate valid login', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'notanemail' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({ ...valid, password: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({ password: 'password123' });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({ email: 'admin@sars.io' });
    expect(result.success).toBe(false);
  });

  it('should reject empty object', () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe('createAuditLogSchema', () => {
  const valid = {
    action: 'user.login',
    resource: 'auth',
    resourceId: 'usr-123',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    sessionId: 'sess-abc-123',
  };

  it('should validate a valid audit log', () => {
    expect(createAuditLogSchema.safeParse(valid).success).toBe(true);
  });

  it('should accept optional userId, before, after', () => {
    const result = createAuditLogSchema.safeParse({
      ...valid,
      userId: '550e8400-e29b-41d4-a716-446655440000',
      before: { name: 'old' },
      after: { name: 'new' },
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty action', () => {
    const result = createAuditLogSchema.safeParse({ ...valid, action: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const result = createAuditLogSchema.safeParse({ action: 'test' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid userId (not a uuid)', () => {
    const result = createAuditLogSchema.safeParse({ ...valid, userId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });
});

describe('createApprovalSchema', () => {
  const valid = {
    title: 'Decommission Node NYC-01',
    description: 'Need approval to decom node in datacenter 5',
    type: 'NODE_DEACTIVATION',
    expiresAt: '2026-12-31T23:59:59Z',
  };

  it('should validate a valid approval request', () => {
    expect(createApprovalSchema.safeParse(valid).success).toBe(true);
  });

  it('should accept optional payload and custom requiredApprovers', () => {
    const result = createApprovalSchema.safeParse({
      ...valid,
      payload: { nodeId: 'abc' },
      requiredApprovers: 5,
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const result = createApprovalSchema.safeParse({ ...valid, title: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid approval type', () => {
    const result = createApprovalSchema.safeParse({ ...valid, type: 'INVALID_TYPE' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid datetime for expiresAt', () => {
    const result = createApprovalSchema.safeParse({ ...valid, expiresAt: 'not-a-date' });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    expect(createApprovalSchema.safeParse({}).success).toBe(false);
  });
});

describe('createAlertRuleSchema', () => {
  const valid = {
    name: 'High CPU Alert',
    layerType: 'compute',
    metric: 'cpu_percent',
    operator: '>',
    threshold: 90,
    severity: 'CRITICAL',
    channels: ['slack', 'email'],
  };

  it('should validate a valid alert rule', () => {
    expect(createAlertRuleSchema.safeParse(valid).success).toBe(true);
  });

  it('should use default cooldownMinutes', () => {
    const result = createAlertRuleSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cooldownMinutes).toBe(5);
    }
  });

  it('should reject empty name', () => {
    const result = createAlertRuleSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid operator', () => {
    const result = createAlertRuleSchema.safeParse({ ...valid, operator: '>>' });
    expect(result.success).toBe(false);
  });

  it('should reject empty channels', () => {
    const result = createAlertRuleSchema.safeParse({ ...valid, channels: [] });
    expect(result.success).toBe(false);
  });

  it('should reject invalid severity', () => {
    const result = createAlertRuleSchema.safeParse({ ...valid, severity: 'EXTREME' });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    expect(createAlertRuleSchema.safeParse({}).success).toBe(false);
  });
});

describe('createNodeSchema', () => {
  const valid = {
    datacenterId: '550e8400-e29b-41d4-a716-446655440000',
    hostname: 'nyc01-node42',
    ipAddress: '10.0.0.42',
    vendor: 'Dell',
    model: 'PowerEdge R750',
    cpuCores: 32,
    ramGb: 256,
  };

  it('should validate a valid node', () => {
    expect(createNodeSchema.safeParse(valid).success).toBe(true);
  });

  it('should default architecture to X86_64', () => {
    const result = createNodeSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.architecture).toBe('X86_64');
    }
  });

  it('should accept ARM64 architecture', () => {
    const result = createNodeSchema.safeParse({ ...valid, architecture: 'ARM64' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid architecture', () => {
    const result = createNodeSchema.safeParse({ ...valid, architecture: 'ITANIUM' });
    expect(result.success).toBe(false);
  });

  it('should reject non-positive cpuCores', () => {
    const result = createNodeSchema.safeParse({ ...valid, cpuCores: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject empty hostname', () => {
    const result = createNodeSchema.safeParse({ ...valid, hostname: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    expect(createNodeSchema.safeParse({}).success).toBe(false);
  });
});

describe('createDatacenterSchema', () => {
  const valid = {
    regionId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'NYC-01',
    slug: 'nyc-01',
    address: '100 Broad St, New York, NY',
    lat: 40.7128,
    lng: -74.006,
    powerCapacityKw: 5000,
  };

  it('should validate a valid datacenter', () => {
    expect(createDatacenterSchema.safeParse(valid).success).toBe(true);
  });

  it('should default tier to T2 and coolingType to AIR', () => {
    const result = createDatacenterSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.tier).toBe('T2');
      expect(result.data.coolingType).toBe('AIR');
    }
  });

  it('should reject invalid tier', () => {
    const result = createDatacenterSchema.safeParse({ ...valid, tier: 'T5' });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = createDatacenterSchema.safeParse({ ...valid, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject non-positive powerCapacityKw', () => {
    const result = createDatacenterSchema.safeParse({ ...valid, powerCapacityKw: -100 });
    expect(result.success).toBe(false);
  });

  it('should reject missing regionId', () => {
    const { regionId, ...withoutRegion } = valid;
    const result = createDatacenterSchema.safeParse(withoutRegion);
    expect(result.success).toBe(false);
  });
});

describe('createNetworkLinkSchema', () => {
  const valid = {
    sourceDcId: '550e8400-e29b-41d4-a716-446655440000',
    targetDcId: '660e8400-e29b-41d4-a716-446655440001',
    type: 'DARK_FIBER',
    bandwidthGbps: 100,
    latencyMs: 5.2,
    provider: 'Equinix',
  };

  it('should validate a valid network link', () => {
    expect(createNetworkLinkSchema.safeParse(valid).success).toBe(true);
  });

  it('should default redundancyLevel to 1', () => {
    const result = createNetworkLinkSchema.safeParse(valid);
    if (result.success) {
      expect(result.data.redundancyLevel).toBe(1);
    }
  });

  it('should reject invalid link type', () => {
    const result = createNetworkLinkSchema.safeParse({ ...valid, type: 'FIBER_OPTIC' });
    expect(result.success).toBe(false);
  });

  it('should reject negative latency', () => {
    const result = createNetworkLinkSchema.safeParse({ ...valid, latencyMs: -1 });
    expect(result.success).toBe(false);
  });

  it('should reject non-positive bandwidth', () => {
    const result = createNetworkLinkSchema.safeParse({ ...valid, bandwidthGbps: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject empty provider', () => {
    const result = createNetworkLinkSchema.safeParse({ ...valid, provider: '' });
    expect(result.success).toBe(false);
  });
});
