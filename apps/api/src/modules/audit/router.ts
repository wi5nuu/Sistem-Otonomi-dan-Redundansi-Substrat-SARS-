import { z } from 'zod';
import { eq, desc, and, asc, sql } from 'drizzle-orm';
import { auditLogs } from '@sars/schemas';
import { auditLogFilterSchema } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const auditRouter = createTRPCRouter({
  list: protectedProcedure
    .input(auditLogFilterSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, from, to, search, ...filters } = input;
      const conditions = [];
      if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
      if (filters.resource) conditions.push(eq(auditLogs.resource, filters.resource));
      if (filters.userId) conditions.push(eq(auditLogs.userId, filters.userId));
      if (from) conditions.push(sql`${auditLogs.timestamp} >= ${new Date(from)}`);
      if (to) conditions.push(sql`${auditLogs.timestamp} <= ${new Date(to)}`);
      if (search) conditions.push(sql`${auditLogs.action} ILIKE ${`%${search}%`}`);

      const items = await ctx.db.select().from(auditLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(auditLogs.timestamp))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      return { items, total: items.length, page, pageSize };
    }),

  verify: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.select().from(auditLogs)
      .orderBy(asc(auditLogs.timestamp));

    if (logs.length === 0) return { valid: true, totalEntries: 0 };

    let prevHash = '0'.repeat(96);
    for (const log of logs) {
      const { immutableHash, ...rest } = log;
      const content = JSON.stringify({ ...rest, previousHash: prevHash });
      const hb = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(content));
      const calculatedHash = Array.from(new Uint8Array(hb)).map((b) => b.toString(16).padStart(2, '0')).join('');
      
      if (calculatedHash !== immutableHash) {
        return { valid: false, totalEntries: logs.length, brokenAt: log.id };
      }
      prevHash = calculatedHash;
    }

    return { valid: true, totalEntries: logs.length };
  }),
});
