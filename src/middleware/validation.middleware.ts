import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const validateAuth = (req: Request, res: Response, next: NextFunction): void => {
    /* The validateAuth middleware (and any Express middleware) should always have 3 arguments: req, res, and next. 
    These represent the request, response, and the function to call the next middleware or route handler. */
    
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new AppError(400, 'Email and password required');
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError(400, 'Invalid email format');
        }
    
        if (password.length < 6) {
            throw new AppError(400, 'Password must be at least 6 characters');
        }
    
        next();
    } catch (error) {
        next(error);
    }
};
