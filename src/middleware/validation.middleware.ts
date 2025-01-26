import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

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

// Create DTO (Data Transfer Object) for validation
export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    @Matches(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, {
        message: 'Invalid ISBN format'
    })
    isbn?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    totalPages?: number;
}

export const validateBookCreation = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const bookDto = plainToClass(CreateBookDto, req.body);
        const errors = await validate(bookDto);

        if (errors.length > 0) {
            const validationErrors = errors.map(
                error => Object.values(error.constraints || {})
            ).flat();

            throw new AppError(400, validationErrors.join(', '));
        }

        next();
    } catch (error) {
        next(error);
    }
};