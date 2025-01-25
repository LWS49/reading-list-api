/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookServices';
import { AppError } from '../utils/errors';


export class BookController {
    private bookService = new BookService();

    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const userId = req.user.id; // From auth middleware
            const book = await this.bookService.createBook(userId, req.body);
            res.status(201).json(book);
            // 201 Created status code is used for successful POST requests
        } catch (error) {
            next(error);
        }
    }
  
    async updateProgress(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const { bookId } = req.params;
            const userId = req.user.id;
            const progress = await this.bookService.updateReadingProgress(
                parseInt(bookId),
                userId,
                req.body
            );
            res.json(progress);
        } catch (error) {
            next(error);
        }
    }

    async getBookProgress(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const { bookId } = req.params;
            const userId = req.user.id;
            const book = await this.bookService.getBookWithProgress(
                parseInt(bookId),
                userId
            );
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const { bookId } = req.params;
            const userId = req.user.id;
            const updatedBook = await this.bookService.updateBook(
                parseInt(bookId),
                userId,
                req.body
            );
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const { bookId } = req.params;
            const userId = req.user.id;
            await this.bookService.deleteBook(
                parseInt(bookId),
                userId
            );
            res.status(204).send(); // No content
        } catch (error) {
            next(error);
        }
    }

    async listBooks(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(401, 'Unauthorized');
            }
            const userId = req.user.id;
            const { page, limit, search } = req.query;
            const result = await this.bookService.listBooks(userId, {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                search: search as string
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}