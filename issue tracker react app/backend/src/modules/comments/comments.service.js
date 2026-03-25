// backend/src/modules/comments/comments.service.js

import { ForbiddenError, NotFoundError } from '../../utils/apiError.js';

/**
 * Comments service factory
 * @param {Pool | PoolClient} db
 */
export function commentsService(db) {
  return {
    async createComment({ issueId, userId, content }) {
      // Ensure issue exists
      const issueResult = await db.query(
        'SELECT id, status FROM issues WHERE id = $1',
        [issueId]
      );

      if (issueResult.rowCount === 0) {
        throw new NotFoundError('Issue not found');
      }

      if (issueResult.rows[0].status === 'DONE') {
        throw new ForbiddenError('Cannot comment on closed issue');
      }

      const result = await db.query(
        `
        INSERT INTO comments (issue_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [issueId, userId, content]
      );

      return result.rows[0];
    },

    async getCommentsByIssue(issueId, { page = 1, limit = 20 } = {}) {
      const safePage = Math.max(Number(page), 1);
      const safeLimit = Math.min(Math.max(Number(limit), 1), 100);
      const offset = (safePage - 1) * safeLimit;

      const countResult = await db.query(
        'SELECT COUNT(*) FROM comments WHERE issue_id = $1',
        [issueId]
      );

      const dataResult = await db.query(
        `
        SELECT
          c.id,
          c.content,
          c.created_at,
          c.updated_at,
          u.id AS user_id,
          u.name AS user_name
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.issue_id = $1
        ORDER BY c.created_at ASC
        LIMIT $2 OFFSET $3
        `,
        [issueId, safeLimit, offset]
      );

      const total = Number(countResult.rows[0].count);
      const totalPages = Math.ceil(total / safeLimit);

      return {
        meta: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages,
          hasNext: safePage < totalPages,
          hasPrev: safePage > 1
        },
        data: dataResult.rows
      };
    },

    async deleteComment(commentId, user) {
      const result = await db.query(
        'SELECT * FROM comments WHERE id = $1',
        [commentId]
      );

      if (result.rowCount === 0) {
        throw new NotFoundError('Comment not found');
      }

      const comment = result.rows[0];

      if (comment.user_id !== user.id && user.role !== 'ADMIN') {
        throw new ForbiddenError('Not allowed to delete this comment');
      }

      await db.query(
        'DELETE FROM comments WHERE id = $1',
        [commentId]
      );
    }
  };
}
