import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(err, req, res, next){

    if(err instanceof ZodError){
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

      // PostgreSQL errors (safe fallback)
    if (err.code) {
        return res.status(400).json({
            message: 'Database error',
            code: err.code
        });
    }

    const status = err.status || 500;

    return res.status(status).json({
        message: err.message || 'Internal server error'
    });
}