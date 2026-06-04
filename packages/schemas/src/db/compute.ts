import {
  pgTable, uuid, text, timestamp, varchar, doublePrecision, integer, index
} from 'drizzle-orm/pg-core';
import { datacenters } from './regions.js';

export const nodes = pgTable('nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  datacenterId: uuid('datacenter_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  hostname: varchar('hostname', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  architecture: varchar('architecture', { length: 20 }).notNull().default('X86_64'),
  vendor: varchar('vendor', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  cpuCores: integer('cpu_cores').notNull(),
  ramGb: integer('ram_gb').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
  lastHeartbeatAt: timestamp('last_heartbeat_at').defaultNow().notNull(),
  uptimeSeconds: integer('uptime_seconds').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  dcIdx: index('idx_nodes_datacenter').on(table.datacenterId),
  hostnameIdx: index('idx_nodes_hostname').on(table.hostname),
  statusIdx: index('idx_nodes_status').on(table.status),
}));

export const nodeMetrics = pgTable('node_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  nodeId: uuid('node_id').notNull().references(() => nodes.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  cpuPercent: doublePrecision('cpu_percent').notNull(),
  ramPercent: doublePrecision('ram_percent').notNull(),
  networkInMbps: doublePrecision('network_in_mbps').notNull(),
  networkOutMbps: doublePrecision('network_out_mbps').notNull(),
  temperatureCelsius: doublePrecision('temperature_celsius').notNull(),
  powerWatts: doublePrecision('power_watts').notNull(),
}, (table) => ({
  nodeTsIdx: index('idx_node_metrics_node_ts').on(table.nodeId, table.timestamp),
  tsIdx: index('idx_node_metrics_ts').on(table.timestamp),
}));
