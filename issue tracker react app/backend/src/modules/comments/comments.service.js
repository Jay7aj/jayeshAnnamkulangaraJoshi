import { pool } from '../../config/db.js';
import { getIssueById } from '../issues/issues.services.js';
import { ForbiddenError, NotFoundError } from '../../utils/apiError.js';

export async function createComment({ issueId, authorId, content }) {
    const issue = await getIssueById(issueId);

    if (!issue) {
        throw new NotFoundError('Issue not found');
    }

    if (issue.status === 'DONE') {
        throw new ForbiddenError('Cannot comment on closed issue');
    }

    const query = `
        INSERT INTO comments (issue_id, author_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const { rows } = await pool.query(query, [
        issueId,
        authorId,
        content
    ]);

    return rows[0];
}

export async function getCommentsByIssue(issueId, {page = 1, limit = 20}) {
    const offset = (page - 1)* limit;
    const countQuery = `SELECT COUNT(*) FROM comments WHERE issue_id = $1`;
    const query = `
        SELECT c.*, u.name AS author_name
        FROM comments c
        JOIN users u ON u.id = c.author_id
        WHERE c.issue_id = $1
        ORDER BY c.created_at ASC
    `;

    const totalResult = await pool.query(countQuery, [issueId]);

    const dataResult = await pool.query(query, [issueId, limit, offset]);
    const total = Number(totalResult.rows[0].count);
    return {
        meta:{
            page,
            limit,
            total,
            totalPages: Math.ceil(total/limit),
            hasNext: page * limit< total,
            hasPrev: page > 1
        },
        data: dataResult.rows
    };
}

export async function deleteComment(commentId, user) {
    const { rows } = await pool.query(
        `SELECT * FROM comments WHERE id = $1`,
        [commentId]
    );

    const comment = rows[0];
    if (!comment) {
        throw new NotFoundError('Comment not found');
    }

    if (comment.author_id !== user.id && user.role !== 'ADMIN') {
        throw new ForbiddenError();
    }

    await pool.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
}
