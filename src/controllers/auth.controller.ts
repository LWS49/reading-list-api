import { Request, Response, RequestHandler } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import { NextFunction } from 'express-serve-static-core';

export const register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction // added next so that error can be passed to error middleware
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        // Check if user exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(409, 'Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword
        });
        
        await userRepository.save(user);
        res.status(201).json({ message: "User created" });
    } catch (error) {
       next(error); // if catch error, pass to error middleware
    }
};

export const login: RequestHandler = async (
    req: Request, 
    res: Response, 
    next: NextFunction // added next so that error can be passed to error middleware
): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new AppError(401, 'Invalid credentials');
        }
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (error) {
        next(error); // if catch error, pass to error middleware
    }
};