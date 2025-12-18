import { Router } from 'express';
import { createAdmin, createStudent, createTeacher, deleteAdmin, deleteStudent, deleteTeacher, updateAdmin, updateStudent, updateTeacher,getAllStudents } from '../controllers/userController';
import { updateMarks } from '../controllers/testController';

const router = Router();

router.post('/teacher', createTeacher);
router.put('/teacher', updateTeacher);
router.delete('/teacher/:uid', deleteTeacher);

router.post('/student', createStudent);
router.put('/student', updateStudent);
router.delete('/student/:uid', deleteStudent);

router.post('/admin', createAdmin);
router.put('/admin', updateAdmin);
router.delete('/admin/:uid', deleteAdmin);

router.get('/students', getAllStudents);
router.post('/marks', updateMarks);


export default router;
