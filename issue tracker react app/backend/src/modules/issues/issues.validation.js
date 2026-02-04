import {z} from 'zod';

export const createIssueSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assignedTo: z.string().uuid().optional()
})

export const updateIssueSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assignedTo: z.string().uuid().nullable().optional()
});
