/// <reference path="../types/express.d.ts" />
import axios from 'axios';
import { AppDataSource } from '../config/database';
import { Book } from '../models/Book';
import { AppError } from '../utils/errors';
import { ReadingProgress } from '../models/ReadingProgress';

export class BookService {
    private bookRepository = AppDataSource.getRepository(Book);

    async validateAndEnrichISBN(isbn: string): Promise<any> {
        // Clean ISBN (remove hyphens and spaces) - for hyphen, \s for whitespace, / /g for global to replace all instances
        const cleanIsbn = isbn.replace(/[-\s]/g, '');
        
        // Basic ISBN-13 validation: \d for digit, {13} for 13 digits, ^ and $ anchor the regex to the start and end of the string
        if (!/^\d{13}$/.test(cleanIsbn)) {
            throw new AppError(400, 'Invalid ISBN format');
        }

        try {
            // Fetch book data from Open Library API, which is in data[`ISBN:${cleanIsbn}`]
            const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
            return response.data[`ISBN:${cleanIsbn}`] || null;
        } catch (error) {
            console.error('Error fetching book metadata:', error);
            return null;
            // not using AppError because this happens even when code is correct, ISBN entry may just not exist
        }
    }

    async createBook(userId: number, bookData: Partial<Book>): Promise<Book> { /// use Partial so that only some of Book's properties required, not all
        const book = this.bookRepository.create({
            ...bookData,
            user: { id: userId }
        });

        if (bookData.isbn) {
            const metadata = await this.validateAndEnrichISBN(bookData.isbn);
            if (metadata) {
                book.metadata = metadata;
                // Update book details if not provided
                book.title = book.title || metadata.title;
                book.author = book.author || metadata.authors?.[0]?.name;
                book.coverUrl = book.coverUrl || metadata.cover?.large;
            }
        }

        return this.bookRepository.save(book);
    }

    async updateReadingProgress(bookId: number, userId: number, progress: Partial<ReadingProgress>): Promise<ReadingProgress> {
        const progressRepository = AppDataSource.getRepository(ReadingProgress);
        
        // Verify book belongs to user
        const book = await this.bookRepository.findOne({
            where: { id: bookId, user: { id: userId } }
        });

        if (!book) {
            throw new AppError(404, 'Book not found');
        }
        // why not update instead of creating new one every time?
        const newProgress = progressRepository.create({
            ...progress,
            book: { id: bookId },
            user: { id: userId },
            readingDate: new Date()
        });

        return progressRepository.save(newProgress);
    }

    async getBookWithProgress(bookId: number, userId: number): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id: bookId, user: { id: userId } }, // 1. Filter by book ID and user ID
            relations: ['readingProgress'],             // 2. Include related readingProgress
            order: {                                    // 3. Order related readingProgress by readingDate in DESC order
                readingProgress: {
                    readingDate: 'DESC'
                }
            }
        });

        if (!book) {
            throw new AppError(404, 'Book not found');
        }

        return book;
    }

    async updateBook(bookId: number, userId: number, bookData: Partial<Book>): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id: bookId, user: { id: userId } }
        });

        if (!book) {
            throw new AppError(404, 'Book not found');
        }

        // Update book fields, preserving existing data
        Object.assign(book, bookData);

        // Re-enrich ISBN data if provided
        if (bookData.isbn) {
            const metadata = await this.validateAndEnrichISBN(bookData.isbn);
            if (metadata) {
                book.metadata = metadata;
                book.title = book.title || metadata.title;
                book.author = book.author || metadata.authors?.[0]?.name;
                book.coverUrl = book.coverUrl || metadata.cover?.large;
            }
        }

        return this.bookRepository.save(book);
    }

    async deleteBook(bookId: number, userId: number): Promise<void> {
        const result = await this.bookRepository.delete({
            id: bookId,
            user: { id: userId }
        });

        if (result.affected === 0) {
            throw new AppError(404, 'Book not found');
        }
    }
   
    async removeReadingProgress(bookId: number): Promise<void> {
        const progressRepository = AppDataSource.getRepository(ReadingProgress);
    
        // Remove all reading progress records associated with the book
        const result = await progressRepository.delete({ book: { id: bookId } });
    
        if (result.affected === 0) {
            console.log('No reading progress found for the book');
        } else {
            console.log(`${result.affected} reading progress record(s) removed`);
        }
    }

    async listBooks(userId: number, options: {
        page?: number, 
        limit?: number, 
        search?: string
    } = {}): Promise<{ books: Book[], total: number }> {
        const { 
            page = 1, 
            limit = 10, 
            search 
        } = options;

        console.log(page + " " + limit + " " + search);
        
        const queryBuilder = this.bookRepository.createQueryBuilder('book')
            .where('book.user.id = :userId', { userId })
            .orderBy('book.createdAt', 'DESC');

        // Optional search functionality
        if (search) {
            queryBuilder.andWhere(
                '(book.title ILIKE :search OR book.author ILIKE :search)', 
                { search: `%${search}%` }
            );
        }

        const total = await queryBuilder.getCount();
        
        const books = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return { 
            books, 
            total 
        };
    }
}