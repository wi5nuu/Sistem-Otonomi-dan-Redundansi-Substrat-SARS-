import { sql } from 'drizzle-orm';

export function createHypertables(): ReturnType<typeof sql> {
  return sql`
    SELECT create_hypertable('node_metrics', 'timestamp', if_not_exists => TRUE);
    SELECT create_hypertable('storage_metrics', 'timestamp', if_not_exists => TRUE);
    SELECT create_hypertable('energy_metrics', 'timestamp', if_not_exists => TRUE);
    SELECT create_hypertable('network_metrics', 'timestamp', if_not_exists => TRUE);
  `;
}
