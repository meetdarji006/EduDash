import { Router } from 'express';
import { createAssignment, updateSubmissions, getAssignments, addAssignmentQuestion, getAssignmentQuestions, getAssignmentSubmissions, getStudentAssignments } from '../controllers/assignmentController';

const router = Router();

router.get('/', getAssignments);
router.post('/', createAssignment);
router.get('/student', getStudentAssignments);
router.get('/:assignmentId/questions', getAssignmentQuestions);
router.post('/:assignmentId/questions', addAssignmentQuestion);
router.get('/:assignmentId/submissions', getAssignmentSubmissions);
router.put('/:assignmentId/submissions', updateSubmissions);

export default router;
