import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context.js';
import { requireAuth, requireRole, requireCapability } from './middleware/auth.js';

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
});

export type AppRouter = typeof appRouter;
