// // backend/src/modules/issues/issues.routes.js
import { Router } from 'express';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import { createIssuesController } from './issues.controller.js';

export function createIssueRoutes({ db }) {
  const router = Router();
  const controller = createIssuesController({ db });

  router.use(authenticateJWT);

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}
