import {
  pgTable, uuid, text, timestamp, varchar, doublePrecision, index
} from 'drizzle-orm/pg-core';

export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  timezone: varchar('timezone', { length: 100 }).notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('ONLINE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const datacenters = pgTable('datacenters', {
  id: uuid('id').defaultRandom().primaryKey(),
  regionId: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  address: text('address').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  tier: varchar('tier', { length: 10 }).notNull().default('T2'),
  status: varchar('status', { length: 20 }).notNull().default('ONLINE'),
  powerCapacityKw: doublePrecision('power_capacity_kw').notNull(),
  coolingType: varchar('cooling_type', { length: 20 }).notNull().default('AIR'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  regionIdx: index('idx_datacenters_region').on(table.regionId),
  slugIdx: index('idx_datacenters_slug').on(table.slug),
}));
