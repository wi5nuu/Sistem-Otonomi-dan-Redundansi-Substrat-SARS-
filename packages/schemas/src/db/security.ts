import {
  pgTable, uuid, text, timestamp, varchar, boolean, index, jsonb
} from 'drizzle-orm/pg-core';
import { nodes } from './compute.js';
import { datacenters } from './regions.js';

export const securityEvents = pgTable('security_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  nodeId: uuid('node_id'),
  datacenterId: uuid('datacenter_id'),
  severity: varchar('severity', { length: 20 }).notNull(),
  category: varchar('category', { length: 20 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  rawPayload: jsonb('raw_payload').default({}),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  severityIdx: index('idx_sec_events_severity').on(table.severity),
  categoryIdx: index('idx_sec_events_category').on(table.category),
  createdIdx: index('idx_sec_events_created').on(table.createdAt),
}));

export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  domain: varchar('domain', { length: 255 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  algorithm: varchar('algorithm', { length: 50 }).notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  autoRenew: boolean('auto_renew').notNull().default(true),
  status: varchar('status', { length: 20 }).notNull().default('VALID'),
}, (table) => ({
  domainIdx: index('idx_certs_domain').on(table.domain),
  statusIdx: index('idx_certs_status').on(table.status),
  validUntilIdx: index('idx_certs_valid_until').on(table.validUntil),
}));
