import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../../packages/schemas/src/db/*.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://sars:password@localhost:5432/sars_db',
  },
});
