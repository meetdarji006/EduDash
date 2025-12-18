import { Router } from 'express';
import { createTest, deleteTest, getStudentTestResults, getTestMarks, getTests, updateMarks, createTestSeries } from '../controllers/testController';

const router = Router();

router.get('/', getTests)
router.get('/student', getStudentTestResults);
router.post('/series', createTestSeries);
router.get('/marks', getTestMarks);
router.post('/', createTest);
router.delete('/:testId', deleteTest);
router.put('/marks', updateMarks);

export default router;
