import { TRPCError } from '@trpc/server';
import type { TRPCContext } from '../context.js';

const ROLE_CAPABILITIES: Record<string, string[]> = {
  VIEWER: ['read:metrics', 'read:alerts', 'read:audit'],
  AUDITOR: ['read:*', 'export:audit'],
  OPERATOR: [
    'read:*', 'write:runbooks', 'execute:failover:request',
    'approve:failover', 'write:alert_rules',
  ],
  ADMIN: ['read:*', 'write:*', 'approve:*', 'manage:users:org'],
  SUPER_ADMIN: ['*'],
};

export function requireAuth(ctx: TRPCContext): void {
  if (!ctx.userId || !ctx.userRole) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
}

export function requireRole(...roles: string[]) {
  return (ctx: TRPCContext): void => {
    requireAuth(ctx);
    if (!ctx.userRole || !roles.includes(ctx.userRole)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Required role: ${roles.join(', ')}`,
      });
    }
  };
}

export function requireCapability(capability: string) {
  return (ctx: TRPCContext): void => {
    requireAuth(ctx);
    if (!ctx.userRole) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'No role assigned' });
    }
    const capabilities = ROLE_CAPABILITIES[ctx.userRole];
    if (!capabilities || (!capabilities.includes('*') && !capabilities.includes(capability))) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing capability: ${capability}`,
      });
    }
  };
}
