import type { Job } from 'bullmq';

export async function collectMetrics(job: Job): Promise<void> {
  await job.log(`Metrics collection started at ${new Date().toISOString()}`);
}
