import { Request, Response, RequestHandler } from 'express';
import AppDataSource from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            email,
            password: hashedPassword
        });
        
        await userRepository.save(user);
        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error during login" });
    }
};