import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction // though unused, all four parameters are necessary
    // Express identifies error handling middleware by looking for functions with exactly four arguments
) => {
    console.error(err.stack);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error', // include status for better clarity
            message: err.message });
        return;
    }

    // Handle other errors
    res.status(500).json({
        status: 'error', // include status for better clarity
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }) // only include error message in developement
    });
};