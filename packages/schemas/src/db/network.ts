import {
  pgTable, uuid, timestamp, varchar, doublePrecision, integer, index
} from 'drizzle-orm/pg-core';
import { datacenters } from './regions';

export const networkLinks = pgTable('network_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceDcId: uuid('source_dc_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  targetDcId: uuid('target_dc_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(),
  bandwidthGbps: doublePrecision('bandwidth_gbps').notNull(),
  latencyMs: doublePrecision('latency_ms').notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
  redundancyLevel: integer('redundancy_level').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index('idx_network_source').on(table.sourceDcId),
  targetIdx: index('idx_network_target').on(table.targetDcId),
}));

export const networkMetrics = pgTable('network_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  linkId: uuid('link_id').notNull().references(() => networkLinks.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  utilizationPercent: doublePrecision('utilization_percent').notNull(),
  latencyMs: doublePrecision('latency_ms').notNull(),
  packetLossPercent: doublePrecision('packet_loss_percent').notNull(),
  errorRate: doublePrecision('error_rate').notNull(),
}, (table) => ({
  linkTsIdx: index('idx_network_metrics_link_ts').on(table.linkId, table.timestamp),
}));
