import { z } from 'zod';

export const listIssuesQuerySchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assignedTo: z.string().uuid().optional(),
    createdBy: z.string().uuid().optional(),
    search: z.string().min(1).optional(),

    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),

    sort: z.enum(['created_at', 'updated_at', 'priority', 'status'])
        .default('created_at'),

    order: z.enum(['asc', 'desc']).default('desc')
});
