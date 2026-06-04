import {
  pgTable, uuid, text, timestamp, varchar, boolean, integer, jsonb, index
} from 'drizzle-orm/pg-core';
import { nodes } from './compute';

export const incidents = pgTable('incidents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  severity: varchar('severity', { length: 5 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('DETECTED'),
  affectedRegions: text('affected_regions').array().notNull().default([]),
  affectedDatacenters: integer('affected_datacenters').array().notNull().default([]),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  acknowledgedAt: timestamp('acknowledged_at'),
  mitigatedAt: timestamp('mitigated_at'),
  resolvedAt: timestamp('resolved_at'),
  rootCause: text('root_cause'),
  postMortemUrl: text('post_mortem_url'),
  createdBy: uuid('created_by').notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  severityIdx: index('idx_incidents_severity').on(table.severity),
  statusIdx: index('idx_incidents_status').on(table.status),
  detectedIdx: index('idx_incidents_detected').on(table.detectedAt),
}));

export const incidentTimeline = pgTable('incident_timeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id').notNull().references(() => incidents.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  actorId: uuid('actor_id'),
  actorType: varchar('actor_type', { length: 10 }).notNull().default('SYSTEM'),
  action: varchar('action', { length: 255 }).notNull(),
  details: jsonb('details').default({}),
}, (table) => ({
  incidentIdx: index('idx_timeline_incident').on(table.incidentId),
}));

export const failoverJobs = pgTable('failover_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  incidentId: uuid('incident_id'),
  sourceNodeId: uuid('source_node_id').notNull().references(() => nodes.id),
  targetNodeId: uuid('target_node_id').notNull().references(() => nodes.id),
  status: varchar('status', { length: 20 }).notNull().default('PENDING'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  logs: text('logs').default(''),
}, (table) => ({
  incidentIdx: index('idx_failover_incident').on(table.incidentId),
  statusIdx: index('idx_failover_status').on(table.status),
}));

export const runbooks = pgTable('runbooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  category: varchar('category', { length: 100 }).notNull(),
  version: integer('version').notNull().default(1),
  content: text('content').notNull(),
  automatable: boolean('automatable').notNull().default(false),
  lastReviewedAt: timestamp('last_reviewed_at'),
  createdBy: uuid('created_by').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_runbooks_slug').on(table.slug),
  categoryIdx: index('idx_runbooks_category').on(table.category),
}));
