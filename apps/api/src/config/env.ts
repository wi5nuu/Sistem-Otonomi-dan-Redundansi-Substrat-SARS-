import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  MEILISEARCH_URL: z.string().url().default('http://localhost:7700'),
  MEILISEARCH_MASTER_KEY: z.string().optional(),
  SESSION_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(64),
  TOTP_ISSUER: z.string().default('SARS-Platform'),
  MINIO_ENDPOINT: z.string().default('localhost:9000'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET_NAME: z.string().default('sars-storage'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().optional(),
  PAGERDUTY_API_KEY: z.string().optional(),
  OTEL_ENDPOINT: z.string().url().default('http://localhost:4318'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  FEATURE_WEBAUTHN: z.coerce.boolean().default(false),
  FEATURE_3D_GLOBE: z.coerce.boolean().default(false),
  FEATURE_AI_ANOMALY_DETECTION: z.coerce.boolean().default(false),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.coerce.number().default(60000),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  const formatted = parsed.error.flatten();
  for (const [key, errors] of Object.entries(formatted.fieldErrors)) {
    for (const err of errors) {
      console.error(`  - ${key}: ${err}`);
    }
  }
  process.exit(1);
}

export const env = parsed.data;
