import { Router } from 'express';
import { createTest, deleteTest, getTests, updateMarks } from '../controllers/testController';

const router = Router();

router.get('/', getTests)
router.post('/', createTest);
router.delete('/:testId', deleteTest);
router.put('/', updateMarks);

export default router;
