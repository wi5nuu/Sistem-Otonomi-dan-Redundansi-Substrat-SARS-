import type { Job } from 'bullmq';

export async function evaluateAlerts(job: Job): Promise<void> {
  await job.log(`Alert evaluation started`);
}
