import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from '@sars/schemas';

const queryClient = postgres(env.DATABASE_URL, {
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
export type DB = typeof db;

export async function closeDb(): Promise<void> {
  await queryClient.end({ timeout: 5 });
}
