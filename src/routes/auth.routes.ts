import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateAuth } from '../middleware/validation.middleware';

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);

export default router;