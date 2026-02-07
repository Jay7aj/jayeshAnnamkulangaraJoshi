import { pool } from '../../config/db.js';
import { issuesService } from '../issues/issues.services.js';
import { ForbiddenError, NotFoundError } from '../../utils/apiError.js';

/**
 * Comments service factory
 * @param {Pool | PoolClient} db
 */
export function commentsService(db = pool) {
    const issueService = issuesService(db);

    return {
        async createComment({ issueId, authorId, content }) {
            const issue = await issueService.getIssueById(issueId);

            if (!issue) {
                throw new NotFoundError('Issue not found');
            }

            if (issue.status === 'DONE') {
                throw new ForbiddenError('Cannot comment on closed issue');
            }

            const query = `
                INSERT INTO comments (issue_id, user_id, content)
                VALUES ($1, $2, $3)
                RETURNING *
            `;

            const { rows } = await db.query(query, [
                issueId,
                authorId,
                content
            ]);

            return rows[0];
        },

        async getCommentsByIssue(issueId, { page = 1, limit = 20 } = {}) {
            const safePage = Math.max(Number(page), 1);
            const safeLimit = Math.min(Math.max(Number(limit), 1), 100);
            const offset = (safePage - 1) * safeLimit;

            const countQuery = `
                SELECT COUNT(*) FROM comments WHERE issue_id = $1
            `;

            const dataQuery = `
                SELECT c.*, u.name AS author_name
                FROM comments c
                JOIN users u ON u.id = c.user_id
                WHERE c.issue_id = $1
                ORDER BY c.created_at ASC
                LIMIT $2 OFFSET $3
            `;

            const totalResult = await db.query(countQuery, [issueId]);
            const total = Number(totalResult.rows[0].count);

            const dataResult = await db.query(dataQuery, [
                issueId,
                safeLimit,
                offset
            ]);

            return {
                meta: {
                    page: safePage,
                    limit: safeLimit,
                    total,
                    totalPages: Math.ceil(total / safeLimit),
                    hasNext: safePage * safeLimit < total,
                    hasPrev: safePage > 1
                },
                data: dataResult.rows
            };
        },

        async deleteComment(commentId, user) {
            const { rows } = await db.query(
                `SELECT * FROM comments WHERE id = $1`,
                [commentId]
            );

            const comment = rows[0];
            if (!comment) {
                throw new NotFoundError('Comment not found');
            }

            if (comment.user_id !== user.id && user.role !== 'ADMIN') {
                throw new ForbiddenError();
            }

            await db.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
        }
    };
}
