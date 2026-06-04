import { z } from 'zod';
import { and, eq, or, desc } from 'drizzle-orm';
import { networkLinks, networkMetrics } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const networkRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      sourceDcId: z.string().uuid().optional(),
      targetDcId: z.string().uuid().optional(),
      type: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.sourceDcId) conditions.push(eq(networkLinks.sourceDcId, input.sourceDcId));
      if (input?.targetDcId) conditions.push(eq(networkLinks.targetDcId, input.targetDcId));
      if (input?.type) conditions.push(eq(networkLinks.type, input.type));
      return ctx.db.select().from(networkLinks)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
    }),

  metrics: protectedProcedure
    .input(z.object({ linkId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(networkMetrics)
        .where(eq(networkMetrics.linkId, input.linkId))
        .orderBy(desc(networkMetrics.timestamp))
        .limit(100);
    }),
});
