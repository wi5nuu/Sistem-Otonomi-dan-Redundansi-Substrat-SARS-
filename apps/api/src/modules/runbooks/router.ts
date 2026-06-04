import { z } from 'zod';
import { eq, desc, asc, and, like } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { runbooks } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../../trpc/router.js';

export const runbooksRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input?.category) conditions.push(eq(runbooks.category, input.category));
      if (input?.search) conditions.push(like(runbooks.title, `%${input.search}%`));
      return ctx.db.select().from(runbooks)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(runbooks.category));
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [runbook] = await ctx.db.select().from(runbooks).where(eq(runbooks.id, input.id)).limit(1);
      if (!runbook) throw new TRPCError({ code: 'NOT_FOUND', message: 'Runbook not found' });
      return runbook;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      slug: z.string().min(1).max(200),
      category: z.string().min(1).max(100),
      content: z.string().min(1),
      automatable: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const [runbook] = await ctx.db.insert(runbooks).values({
        title: input.title,
        slug: input.slug,
        category: input.category,
        content: input.content,
        automatable: input.automatable,
        createdBy: ctx.userId!,
      }).returning();
      return runbook;
    }),
});
