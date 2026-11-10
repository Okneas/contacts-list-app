import cors from 'cors';
import express, { Express } from 'express';
import { errorHandler } from './middleware/errorHandler';
import { contactsRouter } from './routes/contacts.routes';


export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ data: { ok: true } }));
  app.use('/api/contacts', contactsRouter);

  app.use(errorHandler);

  return app;
}