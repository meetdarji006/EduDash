import { Router } from 'express';
import { login, getMe } from '../controllers/authControllers';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', isAuthenticated, getMe);

export default router;
