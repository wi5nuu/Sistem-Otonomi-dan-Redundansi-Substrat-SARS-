import {
  pgTable, uuid, text, timestamp, varchar, boolean, integer, jsonb, index
} from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 30 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('VIEWER'),
  mfaEnabled: boolean('mfa_enabled').notNull().default(false),
  mfaSecret: text('mfa_secret'),
  lastLoginAt: timestamp('last_login_at'),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  orgIdx: index('idx_users_org').on(table.organizationId),
  roleIdx: index('idx_users_role').on(table.role),
}));

export const approvalRequests = pgTable('approval_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestedBy: uuid('requested_by').notNull().references(() => users.id),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 30 }).notNull(),
  payload: jsonb('payload').default({}),
  requiredApprovers: integer('required_approvers').notNull().default(3),
  currentApprovals: integer('current_approvals').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  expiresAt: timestamp('expires_at').notNull(),
  resolvedAt: timestamp('resolved_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('idx_approval_req_status').on(table.status),
  requesterIdx: index('idx_approval_req_requester').on(table.requestedBy),
  expiresIdx: index('idx_approval_req_expires').on(table.expiresAt),
}));

export const approvals = pgTable('approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').notNull().references(() => approvalRequests.id, { onDelete: 'cascade' }),
  approverId: uuid('approver_id').notNull().references(() => users.id),
  decision: varchar('decision', { length: 10 }).notNull(),
  comment: text('comment').notNull(),
  signedAt: timestamp('signed_at').defaultNow().notNull(),
  cryptoSignature: text('crypto_signature').notNull(),
}, (table) => ({
  requestIdx: index('idx_approvals_request').on(table.requestId),
  approverIdx: index('idx_approvals_approver').on(table.approverId),
}));

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  systemActor: text('system_actor'),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: varchar('resource_id', { length: 255 }).notNull(),
  before: jsonb('before'),
  after: jsonb('after'),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent').notNull(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  immutableHash: varchar('immutable_hash', { length: 128 }).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  actionIdx: index('idx_audit_action').on(table.action),
  resourceIdx: index('idx_audit_resource').on(table.resource),
  userIdx: index('idx_audit_user').on(table.userId),
  tsIdx: index('idx_audit_timestamp').on(table.timestamp),
  hashIdx: index('idx_audit_hash').on(table.immutableHash),
}));

export const complianceChecks = pgTable('compliance_checks', {
  id: uuid('id').defaultRandom().primaryKey(),
  checkName: varchar('check_name', { length: 255 }).notNull(),
  framework: varchar('framework', { length: 20 }).notNull(),
  regionCode: varchar('region_code', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  details: text('details').notNull().default(''),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
  nextCheckAt: timestamp('next_check_at').notNull(),
}, (table) => ({
  frameworkIdx: index('idx_compliance_framework').on(table.framework),
  regionIdx: index('idx_compliance_region').on(table.regionCode),
  statusIdx: index('idx_compliance_status').on(table.status),
}));
