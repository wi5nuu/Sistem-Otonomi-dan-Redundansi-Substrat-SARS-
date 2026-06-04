import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context.js';
import { requireAuth, requireRole, requireCapability } from './middleware/auth.js';

import { alertsRouter } from '../modules/alerts/router.js';
import { auditRouter } from '../modules/audit/router.js';
import { authRouter } from '../modules/auth/router.js';
import { drRouter } from '../modules/disaster-recovery/router.js';
import { energyRouter } from '../modules/energy/router.js';
import { governanceRouter } from '../modules/governance/router.js';
import { metricsRouter } from '../modules/metrics/router.js';
import { networkRouter } from '../modules/network/router.js';
import { nodesRouter } from '../modules/nodes/router.js';
import { runbooksRouter } from '../modules/runbooks/router.js';
import { securityRouter } from '../modules/security/router.js';
import { storageRouter } from '../modules/storage/router.js';

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  requireAuth(ctx);
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  requireRole('ADMIN', 'SUPER_ADMIN')(ctx);
  return next({ ctx });
});

export const superAdminProcedure = t.procedure.use(({ ctx, next }) => {
  requireRole('SUPER_ADMIN')(ctx);
  return next({ ctx });
});

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({
    status: 'ok' as const,
    timestamp: new Date().toISOString(),
  })),
  alerts: alertsRouter,
  audit: auditRouter,
  auth: authRouter,
  dr: drRouter,
  energy: energyRouter,
  governance: governanceRouter,
  metrics: metricsRouter,
  network: networkRouter,
  nodes: nodesRouter,
  runbooks: runbooksRouter,
  security: securityRouter,
  storage: storageRouter,
});

export type AppRouter = typeof appRouter;
