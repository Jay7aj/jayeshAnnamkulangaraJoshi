import { pool } from '../../config/db.js';
import { ISSUE_STATUS_TRANSITIONS } from './issues.workflow.js';
import { BadRequestError } from '../../utils/apiError.js';

/**
 * Issues service factory
 * @param {Pool | PoolClient} db
 */
export function issuesService(db = pool) {
    return {
        async createIssue({ title, description, priority, createdBy, assignedTo }) {
            const query = `
                INSERT INTO issues (title, description, priority, created_by, assigned_to)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;

            const values = [
                title,
                description,
                priority || 'MEDIUM',
                createdBy,
                assignedTo ?? null
            ];

            const { rows } = await db.query(query, values);
            return rows[0];
        },

        async getAllIssues(filters) {
            const {
                status,
                priority,
                assignedTo,
                createdBy,
                search,
                page = 1,
                limit = 20,
                sort = 'created_at',
                order = 'DESC'
            } = filters;

            const allowedSortFields = ['created_at', 'updated_at', 'priority', 'status'];
            if (!allowedSortFields.includes(sort)) {
                throw new BadRequestError('Invalid sort field');
            }

            const values = [];
            const where = [];

            if (status) {
                values.push(status);
                where.push(`status = $${values.length}`);
            }

            if (priority) {
                values.push(priority);
                where.push(`priority = $${values.length}`);
            }

            if (assignedTo) {
                values.push(assignedTo);
                where.push(`assigned_to = $${values.length}`);
            }

            if (createdBy) {
                values.push(createdBy);
                where.push(`created_by = $${values.length}`);
            }

            if (search) {
                values.push(`%${search}%`);
                where.push(
                `(title ILIKE $${values.length} OR description ILIKE $${values.length})`
                );
            }

            const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

            const safePage = Math.max(Number(page), 1);
            const safeLimit = Math.min(Math.max(Number(limit), 1), 100);
            const offset = (safePage - 1) * safeLimit;

            const countQuery = `
                SELECT COUNT(*) FROM issues
                ${whereClause}
            `;

            const dataQuery = `
                SELECT *
                FROM issues
                ${whereClause}
                ORDER BY ${sort} ${order.toUpperCase()}
                LIMIT $${values.length + 1}
                OFFSET $${values.length + 2}
            `;

            const totalResult = await db.query(countQuery, values);
            const total = Number(totalResult.rows[0].count);
            const totalPages = Math.ceil(total / safeLimit);

            const dataResult = await db.query(dataQuery, [
                ...values,
                safeLimit,
                offset
            ]);

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

    async getIssueById(id) {
        const { rows } = await db.query(
            `SELECT * FROM issues WHERE id = $1`,
            [id]
        );
        return rows[0];
        },

    async updateIssue(id, updates) {
        const current = await this.getIssueById(id);
        if (!current) return null;

        if (updates.status) {
            const allowed = ISSUE_STATUS_TRANSITIONS[current.status];
            if (!allowed || !allowed.includes(updates.status)) {
            throw new BadRequestError(
                `Invalid status transition: ${current.status} -> ${updates.status}`
            );
            }
        }

        const fields = [];
        const values = [];
        let i = 1;

        const fieldMap = {
            title: 'title',
            description: 'description',
            status: 'status',
            priority: 'priority',
            assignedTo: 'assigned_to'
        };

        for (const [key, column] of Object.entries(fieldMap)) {
            if (updates[key] !== undefined) {
            fields.push(`${column} = $${i++}`);
            values.push(updates[key]);
            }
        }

        if (fields.length === 0) return current;

        values.push(id);

        const query = `
            UPDATE issues
            SET ${fields.join(', ')}
            WHERE id = $${i}
            RETURNING *;
        `;

        const { rows } = await db.query(query, values);
        return rows[0];
    },

    async deleteIssue(id) {
        const { rows } = await db.query(
            `DELETE FROM issues WHERE id = $1 RETURNING *`,
            [id]
        );
        return rows[0];
        }
    };
}
