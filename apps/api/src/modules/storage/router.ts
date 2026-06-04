import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { storageClusters, storageMetrics } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const storageRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ datacenterId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(storageClusters)
        .where(input?.datacenterId ? eq(storageClusters.datacenterId, input.datacenterId) : undefined)
        .orderBy(desc(storageClusters.lastIntegrityCheckAt));
    }),

  metrics: protectedProcedure
    .input(z.object({ clusterId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(storageMetrics)
        .where(eq(storageMetrics.clusterId, input.clusterId))
        .orderBy(desc(storageMetrics.timestamp))
        .limit(100);
    }),
});
