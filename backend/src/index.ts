import { config } from './config';
import { checkDbConnection, closeDb } from './db';

async function bootstrap() {
  await checkDbConnection();
  console.log(`[db] connected to ${config.db.host}:${config.db.port}/${config.db.database}`);

  process.on('SIGINT', async () => {
    await closeDb();
    process.exit(0);
  });

  console.log(`[server] placeholder, PORT=${config.port}`);
}

bootstrap().catch((err) => {
  console.error('[fatal] failed to start:', err);
  process.exit(1);
});