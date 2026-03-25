// backend/src/modules/comments/comments.controller.js

import { commentsService } from './comments.service.js';
import { NotFoundError, ForbiddenError } from '../../utils/apiError.js';

export function createCommentsController({ db }) {
  const service = commentsService(db);

  return {
    async create(req, res, next) {
      try {
        const { issueId } = req.params;
        const { content } = req.body;

        const comment = await service.createComment({
          issueId,
          userId: req.user.id,
          content
        });

        res.status(201).json({ data: comment });
      } catch (err) {
        next(err);
      }
    },

    async list(req, res, next) {
      try {
        const { issueId } = req.params;
        const result = await service.getCommentsByIssue(issueId, req.query);
        res.json(result);
      } catch (err) {
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        await service.deleteComment(req.params.id, req.user);
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  };
}
