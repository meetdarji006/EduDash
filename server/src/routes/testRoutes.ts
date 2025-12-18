import { Router } from 'express';
import { createTest, deleteTest, getStudentTestResults, getTestMarks, getTests, updateMarks, createTestSeries } from '../controllers/testController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';


const router = Router();

router.get('/', getTests)
router.get('/student', getStudentTestResults);
router.post('/series', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), createTestSeries);
router.get('/marks', getTestMarks);
router.post('/', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), createTest);
router.delete('/:testId', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), deleteTest);
router.put('/marks', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), updateMarks);

export default router;
