import {
  pgTable, uuid, timestamp, varchar, doublePrecision, integer, index
} from 'drizzle-orm/pg-core';
import { datacenters } from './regions.js';

export const energySources = pgTable('energy_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  datacenterId: uuid('datacenter_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  capacityKw: doublePrecision('capacity_kw').notNull(),
  currentOutputKw: doublePrecision('current_output_kw').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
  contractExpiresAt: timestamp('contract_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  dcIdx: index('idx_energy_dc').on(table.datacenterId),
}));

export const energyMetrics = pgTable('energy_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').notNull().references(() => energySources.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  outputKw: doublePrecision('output_kw').notNull(),
  efficiency: doublePrecision('efficiency').notNull(),
  estimatedRemainingHours: doublePrecision('estimated_remaining_hours').notNull(),
}, (table) => ({
  sourceTsIdx: index('idx_energy_metrics_source_ts').on(table.sourceId, table.timestamp),
}));

export const upsSystems = pgTable('ups_systems', {
  id: uuid('id').defaultRandom().primaryKey(),
  datacenterId: uuid('datacenter_id').notNull().references(() => datacenters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  capacityKwh: doublePrecision('capacity_kwh').notNull(),
  currentChargePercent: doublePrecision('current_charge_percent').notNull(),
  estimatedRuntimeMinutes: integer('estimated_runtime_minutes').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ONLINE'),
  lastTestedAt: timestamp('last_tested_at'),
}, (table) => ({
  dcUpsIdx: index('idx_ups_dc').on(table.datacenterId),
}));
