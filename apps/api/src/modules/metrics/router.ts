import { sql, eq } from 'drizzle-orm';
import { nodes, nodeMetrics, storageClusters, storageMetrics, energySources, energyMetrics, networkLinks, networkMetrics } from '@sars/schemas';
import { createTRPCRouter, protectedProcedure } from '../../trpc/router.js';

export const metricsRouter = createTRPCRouter({
  globalHealthScore: protectedProcedure.query(async ({ ctx }) => {
    const nodeCount = await ctx.db.select({ count: sql<number>`count(*)` }).from(nodes);
    const activeNodes = await ctx.db.select({ count: sql<number>`count(*)` }).from(nodes)
      .where(eq(nodes.status, 'ACTIVE'));

    const storageCount = await ctx.db.select({ count: sql<number>`count(*)` }).from(storageClusters);
    const onlineStorage = await ctx.db.select({ count: sql<number>`count(*)` }).from(storageClusters)
      .where(eq(storageClusters.status, 'ONLINE'));

    const linkCount = await ctx.db.select({ count: sql<number>`count(*)` }).from(networkLinks);
    const activeLinks = await ctx.db.select({ count: sql<number>`count(*)` }).from(networkLinks)
      .where(eq(networkLinks.status, 'ACTIVE'));

    const sourceCount = await ctx.db.select({ count: sql<number>`count(*)` }).from(energySources);
    const activeSources = await ctx.db.select({ count: sql<number>`count(*)` }).from(energySources)
      .where(eq(energySources.status, 'ACTIVE'));

    const totalComponents = Number(nodeCount[0]!.count) + Number(storageCount[0]!.count) + Number(linkCount[0]!.count) + Number(sourceCount[0]!.count);
    const healthyComponents = Number(activeNodes[0]!.count) + Number(onlineStorage[0]!.count) + Number(activeLinks[0]!.count) + Number(activeSources[0]!.count);
    const score = totalComponents > 0 ? Math.round((healthyComponents / totalComponents) * 100) : 100;

    return {
      score,
      totalComponents,
      healthyComponents,
      timestamp: new Date().toISOString(),
    };
  }),

  layerHealth: protectedProcedure.query(async ({ ctx }) => {
    const [nodeCount] = await ctx.db.select({ count: sql<number>`count(*)` }).from(nodes);
    const [activeNodes] = await ctx.db.select({ count: sql<number>`count(*)` }).from(nodes)
      .where(eq(nodes.status, 'ACTIVE'));

    const [storageCount] = await ctx.db.select({ count: sql<number>`count(*)` }).from(storageClusters);
    const [onlineStorage] = await ctx.db.select({ count: sql<number>`count(*)` }).from(storageClusters)
      .where(eq(storageClusters.status, 'ONLINE'));

    const [linkCount] = await ctx.db.select({ count: sql<number>`count(*)` }).from(networkLinks);
    const [activeLinks] = await ctx.db.select({ count: sql<number>`count(*)` }).from(networkLinks)
      .where(eq(networkLinks.status, 'ACTIVE'));

    const [sourceCount] = await ctx.db.select({ count: sql<number>`count(*)` }).from(energySources);
    const [activeSources] = await ctx.db.select({ count: sql<number>`count(*)` }).from(energySources)
      .where(eq(energySources.status, 'ACTIVE'));

    return {
      compute: { total: Number(nodeCount!.count), healthy: Number(activeNodes!.count), score: nodeCount!.count > 0 ? Math.round((Number(activeNodes!.count) / Number(nodeCount!.count)) * 100) : 100 },
      storage: { total: Number(storageCount!.count), healthy: Number(onlineStorage!.count), score: storageCount!.count > 0 ? Math.round((Number(onlineStorage!.count) / Number(storageCount!.count)) * 100) : 100 },
      network: { total: Number(linkCount!.count), healthy: Number(activeLinks!.count), score: linkCount!.count > 0 ? Math.round((Number(activeLinks!.count) / Number(linkCount!.count)) * 100) : 100 },
      energy: { total: Number(sourceCount!.count), healthy: Number(activeSources!.count), score: sourceCount!.count > 0 ? Math.round((Number(activeSources!.count) / Number(sourceCount!.count)) * 100) : 100 },
    };
  }),
});
