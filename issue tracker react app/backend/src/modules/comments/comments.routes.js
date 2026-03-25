// backend/src/modules/comments/comments.routes.js
import { Router } from 'express';
import { createCommentsController } from './comments.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

export function createCommentRoutes({ db }) {
  const router = Router();
  const controller = createCommentsController({ db });

  router.post(
    '/issues/:issueId/comments',
    authenticateJWT,
    controller.create
  );

  router.get(
    '/issues/:issueId/comments',
    authenticateJWT,
    controller.list
  );

  router.delete(
    '/comments/:id',
    authenticateJWT,
    controller.remove
  );

  return router;
}
