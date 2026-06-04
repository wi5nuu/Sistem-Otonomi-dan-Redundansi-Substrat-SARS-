import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { energySources, energyMetrics, upsSystems } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const energyRouter = createTRPCRouter({
  sources: protectedProcedure
    .input(z.object({ datacenterId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(energySources)
        .where(input?.datacenterId ? eq(energySources.datacenterId, input.datacenterId) : undefined)
        .orderBy(desc(energySources.createdAt));
    }),

  metrics: protectedProcedure
    .input(z.object({ sourceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(energyMetrics)
        .where(eq(energyMetrics.sourceId, input.sourceId))
        .orderBy(desc(energyMetrics.timestamp))
        .limit(100);
    }),

  upsSystems: protectedProcedure
    .input(z.object({ datacenterId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(upsSystems)
        .where(input?.datacenterId ? eq(upsSystems.datacenterId, input.datacenterId) : undefined)
        .orderBy(desc(upsSystems.lastTestedAt));
    }),
});
