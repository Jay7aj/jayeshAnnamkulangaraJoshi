import { Router} from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import issueRoutes from './modules/issues/issues.routes.js';
import commentsRoutes from './modules/comments/comments.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/issues', issueRoutes);
router.use(commentsRoutes);

export default router;