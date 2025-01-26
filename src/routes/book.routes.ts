import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBookCreation } from '../middleware/validation.middleware';

const router = Router();
const bookController = new BookController();

router.use(authMiddleware); // Protect all book routes

router.post('/', validateBookCreation, (req, res, next) => bookController.createBook(req, res, next));
router.post('/:bookId/progress', (req, res, next) => bookController.updateProgress(req, res, next));
router.get('/:bookId', (req, res, next) => bookController.getBookProgress(req, res, next));

export default router;