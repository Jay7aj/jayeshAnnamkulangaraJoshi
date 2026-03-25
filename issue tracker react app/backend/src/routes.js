// backend/src/routes.js

import { Router } from 'express';
import {createAuthRoutes} from './modules/auth/auth.routes.js';
import {createIssueRoutes} from './modules/issues/issues.routes.js';
import {createCommentRoutes} from './modules/comments/comments.routes.js';
import { createUserRoutes } from './modules/users/users.routes.js';

export default function createRoutes({ db }) {
  const router = Router();

  router.use('/auth', createAuthRoutes({ db }));
  router.use('/issues', createIssueRoutes({ db }));
  router.use('/comments', createCommentRoutes({ db }));
  router.use('/users', createUserRoutes({ db }));

  return router;
}
