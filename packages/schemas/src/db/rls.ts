import { sql } from 'drizzle-orm';

export function enableRLS(table: string) {
  return sql`ALTER TABLE ${sql.identifier(table)} ENABLE ROW LEVEL SECURITY`;
}

export function createRLSPolicy(name: string, table: string, using: string) {
  return sql`CREATE POLICY ${sql.identifier(name)} ON ${sql.identifier(table)} FOR ALL USING (${sql.raw(using)})`;
}
