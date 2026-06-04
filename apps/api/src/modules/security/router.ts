import { z } from 'zod';
import { eq, desc, and } from 'drizzle-orm';
import { securityEvents, certificates } from '@sars/schemas';
import { securitySeveritySchema, certStatusSchema } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const securityRouter = createTRPCRouter({
  listEvents: protectedProcedure
    .input(z.object({
      severity: securitySeveritySchema.optional(),
      category: z.string().optional(),
      limit: z.number().int().positive().max(500).default(100),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.severity) conditions.push(eq(securityEvents.severity, input.severity));
      if (input?.category) conditions.push(eq(securityEvents.category, input.category));
      return ctx.db.select().from(securityEvents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(securityEvents.createdAt))
        .limit(input?.limit ?? 100);
    }),

  listCertificates: protectedProcedure
    .input(z.object({
      status: certStatusSchema.optional(),
      domain: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.status) conditions.push(eq(certificates.status, input.status));
      if (input?.domain) conditions.push(eq(certificates.domain, input.domain));
      return ctx.db.select().from(certificates)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(certificates.validUntil));
    }),
});
