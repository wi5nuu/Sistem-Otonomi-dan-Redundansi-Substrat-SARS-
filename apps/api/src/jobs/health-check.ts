import type { Job } from 'bullmq';

export async function healthCheck(job: Job): Promise<void> {
  await job.log(`Health check completed`);
}
