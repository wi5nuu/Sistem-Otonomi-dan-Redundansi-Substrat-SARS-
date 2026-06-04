import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../../trpc/router.js';
import { alertRuleSchema } from '@sars/schemas';

export const alertsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ status: z.string().optional(), severity: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.alerts.findMany({
        where: (alerts, { eq, and }) => {
          const conds = [];
          if (input?.status) conds.push(eq(alerts.status, input.status));
          if (input?.severity) conds.push(eq(alerts.severity, input.severity));
          return and(...conds);
        },
        orderBy: (alerts, { desc }) => [desc(alerts.firedAt)],
        limit: 100,
      });
    }),

  rules: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.alertRules.findMany({
      orderBy: (rules, { asc }) => [asc(rules.name)],
    });
  }),

  createRule: adminProcedure
    .input(alertRuleSchema)
    .mutation(async ({ ctx, input }) => {
      const [rule] = await ctx.db.insert(alertRules).values(input).returning();
      return rule;
    }),
});
