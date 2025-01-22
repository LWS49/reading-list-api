import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookServices';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
    };
    // guarantees that req will always have user with id field
}

export class BookController {
    private bookService = new BookService();

    /**
     * Creates a new book entry for the authenticated user.
     * The function retrieves the user ID from the authenticated request and calls the service
     * layer to create the book. Upon success, a 201 status code is returned along with the 
     * created book data. If an error occurs, it is passed to the next error-handling middleware.
     * 
     * @param {AuthenticatedRequest} req - The request object containing user and book data.
     * @param {Response} res - The response object used to send the created book data.
     * @param {NextFunction} next - The next middleware function for error handling.
     */
    async createBook(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id; // From auth middleware
            const book = await this.bookService.createBook(userId, req.body);
            res.status(201).json(book);
            // 201 Created status code is used for successful POST requests
        } catch (error) {
            next(error);
        }
    }

    /**
     * Updates the reading progress of a specific book for the authenticated user.
     * The function verifies the user's identity, retrieves the book ID from the request parameters,
     * and calls the service layer to update the reading progress. The updated progress is returned
     * in the response. If any error occurs, it is passed to the next middleware.
     * 
     * @param {AuthenticatedRequest} req - The request object containing the book ID, progress data, and user information.
     * @param {Response} res - The response object used to send the updated progress data.
     * @param {NextFunction} next - The next middleware function for error handling.
     */    
    async updateProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
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

    /**
     * Retrieves the reading progress of a specific book for the authenticated user.
     * The function retrieves the book ID from the request parameters, validates the user,
     * and fetches the book data along with its reading progress from the service layer. 
     * The book data is returned in the response. Any errors are passed to the next error handler.
     * 
     * @param {AuthenticatedRequest} req - The request object containing the book ID and user information.
     * @param {Response} res - The response object used to send the book and progress data.
     * @param {NextFunction} next - The next middleware function for error handling.
     */
    async getBookProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
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
}