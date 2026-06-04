import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { nodes, nodeMetrics } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const nodesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ datacenterId: z.string().uuid().optional(), status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(nodes)
        .where(input?.datacenterId ? eq(nodes.datacenterId, input.datacenterId) : undefined)
        .orderBy(desc(nodes.lastHeartbeatAt));
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [node] = await ctx.db.select().from(nodes).where(eq(nodes.id, input.id)).limit(1);
      if (!node) throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' });
      return node;
    }),

  metrics: protectedProcedure
    .input(z.object({ nodeId: z.string().uuid(), limit: z.number().int().positive().max(500).default(100) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(nodeMetrics)
        .where(eq(nodeMetrics.nodeId, input.nodeId))
        .orderBy(desc(nodeMetrics.timestamp))
        .limit(input.limit);
    }),
});
