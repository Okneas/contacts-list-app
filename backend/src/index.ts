import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { config } from './config';
import { checkDbConnection, closeDb } from './db';
import { errorHandler } from './middleware/errorHandler';
import { contactsRouter } from './routes/contacts.routes';

async function bootstrap(): Promise<void> {
  await checkDbConnection();
  console.log(`[db] connected to ${config.db.host}:${config.db.port}/${config.db.database}`);

  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'],
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ data: { ok: true } }));
  app.use('/api/contacts', contactsRouter);

  app.use(errorHandler);

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