import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc/router.js';

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.userId!),
      columns: { mfaSecret: false },
    });
    if (!user) throw new Error('User not found');
    return user;
  }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });
      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }
      return { success: true, userId: user.id, role: user.role };
    }),
});
