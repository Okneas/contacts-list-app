import cors from 'cors';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/errorHandler';
import { contactsRouter } from './routes/contacts.routes';
import { swaggerSpec } from './swagger';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    }),
  );
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

  app.get('/api/health', (_req, res) => res.json({ data: { ok: true } }));
  app.use('/api/contacts', contactsRouter);

  app.use(errorHandler);

  return app;
}