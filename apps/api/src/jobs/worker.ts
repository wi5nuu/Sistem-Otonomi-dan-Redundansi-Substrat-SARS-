import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import { collectMetrics } from './metrics-collector.js';
import { evaluateAlerts } from './alert-evaluator.js';
import { applyAuditRetention } from './audit-log-retention.js';
import { healthCheck } from './health-check.js';

const connection = { url: env.REDIS_URL };

const workers: Worker[] = [];

export function setupWorkers(): void {
  const metricsWorker = new Worker('metrics-collection', collectMetrics, { connection });
  const alertsWorker = new Worker('alert-evaluation', evaluateAlerts, { connection });
  const auditWorker = new Worker('audit-retention', applyAuditRetention, { connection });
  const healthWorker = new Worker('health-check', healthCheck, { connection });

  workers.push(metricsWorker, alertsWorker, auditWorker, healthWorker);
}

export async function closeWorkers(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
}
