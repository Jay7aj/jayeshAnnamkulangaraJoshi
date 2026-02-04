import { Router } from 'express';
import * as issuesController from './issues.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, issuesController.create);
router.get('/', authenticateJWT, issuesController.list);
router.get('/:id', authenticateJWT, issuesController.get);
router.patch('/:id', authenticateJWT, issuesController.update);
router.delete('/:id', authenticateJWT, issuesController.remove);

export default router;
