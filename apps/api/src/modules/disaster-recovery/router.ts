import { z } from 'zod';
import { eq, desc, asc, and } from 'drizzle-orm';
import { incidents, incidentTimeline, failoverJobs, runbooks } from '@sars/schemas';
import { incidentSeveritySchema, incidentStatusSchema } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../../trpc/router.js';

export const disasterRecoveryRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      severity: incidentSeveritySchema.optional(),
      status: incidentStatusSchema.optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.severity) conditions.push(eq(incidents.severity, input.severity));
      if (input?.status) conditions.push(eq(incidents.status, input.status));
      return ctx.db.select().from(incidents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(incidents.detectedAt));
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [incident] = await ctx.db.select().from(incidents).where(eq(incidents.id, input.id)).limit(1);
      if (!incident) throw new Error('Incident not found');
      return incident;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      severity: incidentSeveritySchema,
      affectedRegions: z.array(z.string()).default([]),
      affectedDatacenters: z.array(z.number().int()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const [incident] = await ctx.db.insert(incidents).values({
        title: input.title,
        severity: input.severity,
        affectedRegions: input.affectedRegions,
        affectedDatacenters: input.affectedDatacenters,
        status: 'DETECTED',
        createdBy: ctx.userId!,
      }).returning();
      return incident;
    }),

  timeline: protectedProcedure
    .input(z.object({ incidentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(incidentTimeline)
        .where(eq(incidentTimeline.incidentId, input.incidentId))
        .orderBy(desc(incidentTimeline.timestamp));
    }),

  failoverJobs: protectedProcedure
    .input(z.object({ incidentId: z.string().uuid().optional(), status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.incidentId) conditions.push(eq(failoverJobs.incidentId, input.incidentId));
      if (input?.status) conditions.push(eq(failoverJobs.status, input.status));
      return ctx.db.select().from(failoverJobs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(failoverJobs.startedAt));
    }),

  runbooks: protectedProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.select().from(runbooks)
        .where(input?.category ? eq(runbooks.category, input.category) : undefined)
        .orderBy(asc(runbooks.title));
    }),
});
