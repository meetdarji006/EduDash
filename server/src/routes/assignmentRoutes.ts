import { Router } from 'express';
import { createAssignment, updateSubmissions } from '../controllers/assignmentController';

const router = Router();

router.post('/', createAssignment);
router.put('/', updateSubmissions);

export default router;
