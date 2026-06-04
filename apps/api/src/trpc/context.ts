import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';

export interface TRPCContext {
  db: typeof db;
  userId?: string;
  userRole?: string;
  orgId?: string;
  req: FastifyRequest;
  res: FastifyReply;
}

export async function createTRPCContext({
  req,
  res,
}: {
  req: FastifyRequest;
  res: FastifyReply;
}): Promise<TRPCContext> {
  const sessionId = req.cookies['session_id'];
  let userId: string | undefined;
  let userRole: string | undefined;
  let orgId: string | undefined;

  if (sessionId) {
    try {
      const session = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, sessionId),
      });
      if (session?.isActive) {
        userId = session.id;
        userRole = session.role;
        orgId = session.organizationId;
      }
    } catch {
      // Session invalid, continue as unauthenticated
    }
  }

  return {
    db,
    userId,
    userRole,
    orgId,
    req,
    res,
  };
}
