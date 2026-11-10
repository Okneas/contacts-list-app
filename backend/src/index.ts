import 'dotenv/config';
import { createApp } from './app';
import { config } from './config';
import { checkDbConnection, closeDb } from './db';

async function bootstrap(): Promise<void> {
  await checkDbConnection();
  console.log(`[db] connected to ${config.db.host}:${config.db.port}/${config.db.database}`);

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[server] listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[fatal] failed to start:', err);
  process.exit(1);
});