// src/middleware/logging.middleware.ts
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Create logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

export const requestLoggingMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration,
            body: req.body
        });
    });

    next();
};