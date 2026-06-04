import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { createAuditHash } from '@sars/utils';
import { db } from '../db/index.js';
import { auditLogs } from '@sars/schemas';

async function auditPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.decorate('audit', {
    async log(params: {
      userId?: string;
      systemActor?: string;
      action: string;
      resource: string;
      resourceId: string;
      before?: Record<string, unknown>;
      after?: Record<string, unknown>;
      ipAddress: string;
      userAgent: string;
      sessionId: string;
    }): Promise<void> {
      const lastEntry = await db.query.auditLogs.findFirst({
        orderBy: (logs, { desc }) => [desc(logs.timestamp)],
      });

      const previousHash = lastEntry?.immutableHash ?? '0'.repeat(96);
      const content = {
        ...params,
        previousHash,
        timestamp: new Date().toISOString(),
      };

      const immutableHash = await createAuditHash(
        params as unknown as Record<string, unknown>,
        previousHash,
      );

      await db.insert(auditLogs).values({
        ...params,
        immutableHash,
        timestamp: new Date(),
      });
    },

    async verifyChain(): Promise<{ valid: boolean; brokenAtIndex: number | null }> {
      const entries = await db.query.auditLogs.findMany({
        orderBy: (logs, { asc }) => [asc(logs.timestamp)],
      });

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]!;
        const prevHash = i === 0 ? '0'.repeat(96) : entries[i - 1]!.immutableHash;
        const { immutableHash, ...rest } = entry;
        const expected = await createAuditHash(
          rest as unknown as Record<string, unknown>,
          prevHash,
        );
        if (expected !== immutableHash) {
          return { valid: false, brokenAtIndex: i };
        }
      }

      return { valid: true, brokenAtIndex: null };
    },
  });
}

export default fp(auditPlugin, { name: 'sars-audit' });

declare module 'fastify' {
  interface FastifyInstance {
    audit: {
      log(params: {
        userId?: string;
        systemActor?: string;
        action: string;
        resource: string;
        resourceId: string;
        before?: Record<string, unknown>;
        after?: Record<string, unknown>;
        ipAddress: string;
        userAgent: string;
        sessionId: string;
      }): Promise<void>;
      verifyChain(): Promise<{ valid: boolean; brokenAtIndex: number | null }>;
    };
  }
}
