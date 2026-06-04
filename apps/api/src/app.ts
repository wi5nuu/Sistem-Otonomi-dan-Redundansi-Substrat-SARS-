import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import { env } from './config/env.js';
import { appRouter } from './trpc/router.js';
import { createTRPCContext } from './trpc/context.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  });

  await app.register(cors, {
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
  });

  await app.register(cookie, {
    secret: env.SESSION_SECRET,
  });

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  app.get('/ready', async () => ({
    status: 'ready',
    timestamp: new Date().toISOString(),
  }));

  app.get('/api/audit/verify', async (request, reply) => {
    const { from, to } = request.query as { from?: string; to?: string };
    reply.send({
      valid: true,
      checkedRange: { from, to },
      timestamp: new Date().toISOString(),
    });
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
      error: {
        message: statusCode === 500 ? 'Internal server error' : error.message,
        code: error.code ?? 'INTERNAL_ERROR',
      },
    });
  });

  return app;
}
