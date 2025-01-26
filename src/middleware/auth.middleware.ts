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

        console.error('Attempting to verify token');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hD1X7er03H8CBTYFXwoM') as JwtPayload;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ 
            where: { id: decoded.userId },
            select: ['id'] // Only select id for security
        });

        if (!user) {
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