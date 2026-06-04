import { buildApp } from './app.js';
import { env } from './config/env.js';
import { closeDb } from './db/index.js';

async function main(): Promise<void> {
  const app = await buildApp();

  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, shutting down gracefully...`);
      await app.close();
      await closeDb();
      process.exit(0);
    });
  }

  process.on('unhandledRejection', (reason) => {
    app.log.error({ err: reason }, 'Unhandled Promise rejection');
  });

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`SARS API server running on ${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err, 'Failed to start server');
    process.exit(1);
  }
}

main();
