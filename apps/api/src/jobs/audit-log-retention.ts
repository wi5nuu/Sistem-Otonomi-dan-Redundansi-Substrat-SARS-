import type { Job } from 'bullmq';

export async function applyAuditRetention(job: Job): Promise<void> {
  await job.log(`Audit retention policy applied`);
}
