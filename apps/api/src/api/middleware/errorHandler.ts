import { Request, Response, NextFunction } from 'express';
import logger from '../../shared/logger';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export function createError(message: string, statusCode = 500): AppError {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const statusCode = err.statusCode || 500;
    const isDev = process.env.NODE_ENV === 'development';

    logger.error(`[${req.method}] ${req.path} - ${statusCode}: ${err.message}`, {
        stack: isDev ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        message: err.isOperational ? err.message : 'Internal Server Error',
        ...(isDev && { stack: err.stack }),
    });
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
}

export function asyncHandler<T extends Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: T, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
