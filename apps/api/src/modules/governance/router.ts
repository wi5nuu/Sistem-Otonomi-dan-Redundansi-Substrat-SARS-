import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../../trpc/router.js';
import { createUserSchema, approvalActionSchema, auditLogFilterSchema } from '@sars/schemas';

export const governanceRouter = createTRPCRouter({
  listUsers: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      columns: { mfaSecret: false },
      orderBy: (users, { asc }) => [asc(users.name)],
    });
  }),

  createUser: adminProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.insert(users).values(input).returning();
      return user;
    }),

  auditLogs: protectedProcedure
    .input(auditLogFilterSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, ...filters } = input;
      const conditions = [];
      if (filters.action) conditions.push({ action: filters.action });
      if (filters.resource) conditions.push({ resource: filters.resource });
      if (filters.userId) conditions.push({ userId: filters.userId });

      const items = await ctx.db.query.auditLogs.findMany({
        where: (logs, { eq, and }) => {
          const conds = conditions.map((c) => eq(logs[c.key], c.value));
          return and(...conds);
        },
        orderBy: (logs, { desc }) => [desc(logs.timestamp)],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      return { items, total: items.length, page, pageSize };
    }),

  approvalRequests: protectedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.approvalRequests.findMany({
        where: input?.status
          ? (req, { eq }) => eq(req.status, input.status!)
          : undefined,
        orderBy: (req, { desc }) => [desc(req.createdAt)],
      });
    }),

  approve: protectedProcedure
    .input(approvalActionSchema)
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.approvalRequests.findFirst({
        where: (req, { eq }) => eq(req.id, input.requestId),
      });
      if (!request) throw new Error('Approval request not found');
      if (request.status !== 'PENDING') throw new Error('Request already resolved');

      const newApprovals = request.currentApprovals + 1;
      const newStatus = newApprovals >= request.requiredApprovers ? 'APPROVED' : 'PENDING';

      await ctx.db.update(approvalRequests)
        .set({ currentApprovals: newApprovals, status: newStatus })
        .where(eq(approvalRequests.id, input.requestId));

      return { success: true, status: newStatus };
    }),
});
