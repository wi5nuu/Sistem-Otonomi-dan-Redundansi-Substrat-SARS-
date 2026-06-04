import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const nodesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ datacenterId: z.string().uuid().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.datacenterId) {
        conditions.push({ datacenterId: input.datacenterId });
      }
      return ctx.db.query.nodes.findMany({
        where: conditions.length > 0 ? (nodes, { eq, and }) => and(
          ...conditions.map((c) => eq(nodes.datacenterId, c.datacenterId!))
        ) : undefined,
        orderBy: (nodes, { desc }) => [desc(nodes.lastHeartbeatAt)],
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const node = await ctx.db.query.nodes.findFirst({
        where: (nodes, { eq }) => eq(nodes.id, input.id),
      });
      if (!node) throw new Error('Node not found');
      return node;
    }),

  metrics: protectedProcedure
    .input(z.object({
      nodeId: z.string().uuid(),
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.nodeMetrics.findMany({
        where: (metrics, { eq, and, gte, lte }) => {
          const conds = [eq(metrics.nodeId, input.nodeId)];
          if (input.from) conds.push(gte(metrics.timestamp, new Date(input.from)));
          if (input.to) conds.push(lte(metrics.timestamp, new Date(input.to)));
          return and(...conds);
        },
        orderBy: (metrics, { desc }) => [desc(metrics.timestamp)],
        limit: 500,
      });
    }),
});
