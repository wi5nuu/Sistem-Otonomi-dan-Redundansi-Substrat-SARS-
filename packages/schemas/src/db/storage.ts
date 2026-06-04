import {
  pgTable, uuid, timestamp, varchar, doublePrecision, integer, index
} from 'drizzle-orm/pg-core';
import { datacenters } from './regions';

export const storageClusters = pgTable('storage_clusters', {
  id: uuid('id').defaultRandom().primaryKey(),
  datacenterId: uuid('datacenter_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  tier: varchar('tier', { length: 20 }).notNull().default('HOT'),
  totalTb: doublePrecision('total_tb').notNull(),
  usedTb: doublePrecision('used_tb').notNull(),
  replicationFactor: integer('replication_factor').notNull().default(3),
  erasureCodingScheme: varchar('erasure_coding_scheme', { length: 50 }).default('RS-4+2'),
  status: varchar('status', { length: 20 }).notNull().default('ONLINE'),
  lastIntegrityCheckAt: timestamp('last_integrity_check_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  dcIdx: index('idx_storage_dc').on(table.datacenterId),
}));

export const storageMetrics = pgTable('storage_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  clusterId: uuid('cluster_id').notNull().references(() => storageClusters.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  readIops: doublePrecision('read_iops').notNull(),
  writeIops: doublePrecision('write_iops').notNull(),
  readLatencyMs: doublePrecision('read_latency_ms').notNull(),
  writeLatencyMs: doublePrecision('write_latency_ms').notNull(),
  throughputMbps: doublePrecision('throughput_mbps').notNull(),
}, (table) => ({
  clusterTsIdx: index('idx_storage_metrics_cluster_ts').on(table.clusterId, table.timestamp),
}));
