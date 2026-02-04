export class ApiError extends Error{
    constructor(statusCode, message, details = null){
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends ApiError{
    constructor(message, details){
        super(400, message, details);
    }
}

export class UnauthorizedError extends ApiError{
    constructor(message = 'Unauthorized'){
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
}