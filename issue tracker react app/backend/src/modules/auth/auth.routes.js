// backend/src/modules/auth/auth.routes.js
import { Router } from 'express';
import { createAuthController } from './auth.controller.js';

export function createAuthRoutes({ db }) {
  const router = Router();
  const controller = createAuthController({ db });

  router.post('/register', controller.register);
  router.post('/login', controller.login);

  return router;
}
