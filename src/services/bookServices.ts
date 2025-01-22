import axios from 'axios';
import AppDataSource from '../config/database';
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
            where: { id: bookId, user: { id: userId } },
            relations: ['readingProgress'],
            order: {
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
}