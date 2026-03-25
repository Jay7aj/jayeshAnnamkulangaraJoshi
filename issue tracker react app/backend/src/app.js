// backend/src/app.js

import express from 'express';
import cors from 'cors';
import createRoutes from './routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp({ db } = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Request logging (disabled in test)
  if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        console.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`
        );
      });
      next();
    });
  }

  // Mount API only if DB is provided
  if (db) {
    app.use('/api', createRoutes({ db }));
  }

  // Health should NOT depend on DB
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
}

export default createApp;
