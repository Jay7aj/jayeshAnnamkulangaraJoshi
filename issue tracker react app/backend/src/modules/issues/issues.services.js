import { pool } from '../../config/db.js';
import { ISSUE_STATUS_TRANSITIONS } from './issues.workflow.js';
import { BadRequestError } from '../../utils/apiError.js';

export async function createIssue({ title, description, priority, createdBy, assignedTo }) {
    const query = `
        INSERT INTO issues (title, description, priority, created_by, assigned_to)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [title, description, priority || 'MEDIUM', createdBy, assignedTo ?? null];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function getAllIssues(filters) {
    const {
        status,
        priority,
        assignedTo,
        createdBy,
        search,
        page,
        limit,
        sort,
        order
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
        where.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(1, pageNumber);
    const safeLimit = Math.max(1, limitNumber);
    const offset = (safePage - 1) * safeLimit;

    const countQuery = `
        SELECT COUNT(*) FROM issues
        ${whereClause}
    `;

    const dataQuery = `
        SELECT *
        FROM issues
        ${whereClause}
        ORDER BY ${sort} ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    const totalResult = await pool.query(countQuery, values);
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / safeLimit);

    const dataResult = await pool.query(dataQuery, [...values, safeLimit, offset]);

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
}

export async function getIssueById(id) {
    const { rows } = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
    return rows[0];
}

export async function updateIssue(id, updates) {
    const current = await getIssueById(id);
    if (!current) return null;

    if (updates.status) {
        const allowedNextStatuses = ISSUE_STATUS_TRANSITIONS[current.status];
        if (!allowedNextStatuses){
            throw new BadRequestError(`Unknown issue status: ${current.status}`);
        }

        if (!allowedNextStatuses.includes(updates.status)) {
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

    for (const [inputKey, dbColumn] of Object.entries(fieldMap)) {
        if (updates[inputKey] !== undefined) {
            fields.push(`${dbColumn} = $${i++}`);
            values.push(updates[inputKey]);
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

    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function deleteIssue(id) {
    const { rows } = await pool.query(
        `DELETE FROM issues WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows[0];
}
