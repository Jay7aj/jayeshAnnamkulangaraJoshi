import { Router } from 'express';
import { authenticateJWT } from '../../middleware/auth.middleware.js';
import * as controller from './comments.controller.js';

const router = Router();

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
    '/comments/:commentId',
    authenticateJWT,
    controller.remove
);

export default router;
