import {
  pgTable, uuid, text, timestamp, varchar, boolean, integer, index
} from 'drizzle-orm/pg-core';

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  layerType: varchar('layer_type', { length: 50 }).notNull(),
  metric: varchar('metric', { length: 100 }).notNull(),
  operator: varchar('operator', { length: 10 }).notNull(),
  threshold: integer('threshold').notNull(),
  severity: varchar('severity', { length: 10 }).notNull(),
  cooldownMinutes: integer('cooldown_minutes').notNull().default(5),
  channels: text('channels').array().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdBy: uuid('created_by').notNull(),
}, (table) => ({
  layerIdx: index('idx_alert_rules_layer').on(table.layerType),
  activeIdx: index('idx_alert_rules_active').on(table.isActive),
}));

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  ruleId: uuid('rule_id'),
  severity: varchar('severity', { length: 10 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  message: text('message').notNull(),
  affectedResource: varchar('affected_resource', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('FIRING'),
  firedAt: timestamp('fired_at').defaultNow().notNull(),
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedAt: timestamp('resolved_at'),
  acknowledgedBy: uuid('acknowledged_by'),
}, (table) => ({
  severityIdx: index('idx_alerts_severity').on(table.severity),
  statusIdx: index('idx_alerts_status').on(table.status),
  firedIdx: index('idx_alerts_fired').on(table.firedAt),
}));
