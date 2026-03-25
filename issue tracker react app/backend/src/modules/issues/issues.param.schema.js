// // backend/src/modules/issues/issues.param.schema.js
import { z } from 'zod';

export const issueIdParamSchema = z.object({
    id: z.string().uuid()
});
