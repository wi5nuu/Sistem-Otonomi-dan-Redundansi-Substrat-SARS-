import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { alertRules, alerts } from '@sars/schemas';
import { alertRuleSchema, alertSeveritySchema, alertStatusSchema } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../../trpc/router.js';
import { requireRole } from '../../trpc/middleware/auth.js';

export const alertsRouter = createTRPCRouter({
  listRules: protectedProcedure
    .input(z.object({
      layerType: z.string().max(50).optional(),
      isActive: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.layerType) conditions.push(eq(alertRules.layerType, input.layerType));
      if (input?.isActive !== undefined) conditions.push(eq(alertRules.isActive, input.isActive));
      return ctx.db.select().from(alertRules)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(alertRules.name));
    }),

  createRule: adminProcedure
    .input(alertRuleSchema.extend({
      createdBy: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [rule] = await ctx.db.insert(alertRules).values(input).returning();
      return rule;
    }),

  list: protectedProcedure
    .input(z.object({
      severity: alertSeveritySchema.optional(),
      status: alertStatusSchema.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.severity) conditions.push(eq(alerts.severity, input.severity));
      if (input?.status) conditions.push(eq(alerts.status, input.status));
      return ctx.db.select().from(alerts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(alerts.firedAt));
    }),

  acknowledge: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      requireRole('OPERATOR', 'ADMIN', 'SUPER_ADMIN')(ctx);
      const [existing] = await ctx.db.select().from(alerts).where(eq(alerts.id, input.id)).limit(1);
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Alert not found' });
      const [updated] = await ctx.db.update(alerts)
        .set({ status: 'ACKNOWLEDGED', acknowledgedAt: new Date(), acknowledgedBy: ctx.userId })
        .where(eq(alerts.id, input.id))
        .returning();
      return updated;
    }),

  resolve: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db.select().from(alerts).where(eq(alerts.id, input.id)).limit(1);
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Alert not found' });
      const [updated] = await ctx.db.update(alerts)
        .set({ status: 'RESOLVED', resolvedAt: new Date() })
        .where(eq(alerts.id, input.id))
        .returning();
      return updated;
    }),
});
