/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

interface JwtPayload {
    userId: number;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log('Auth Middleware Hit');
    console.log('Headers:', req.headers);
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.error('No authorization header');
            throw new AppError(401, 'No authentication token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.error('Invalid token format');
            throw new AppError(401, 'Invalid authentication format');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'hD1X7er03H8CBTYFXwoM') as JwtPayload;
            console.log('Token decoded:', decoded); // Log the decoded token
        } catch (err) {
            console.error('JWT Verification Error:', err);
            throw new AppError(401, 'Invalid or expired token');
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ 
            where: { id: decoded.userId },
            select: ['id'] // Only select id for security
        });

        if (!user) {
            console.error('User not found for ID:', decoded.userId);
            throw new AppError(401, 'User not found');
        }

        req.user = { id: user.id };
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError(401, 'Invalid or expired token'));
        } else {
            next(error);
        }
    }
};