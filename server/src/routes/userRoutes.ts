import { Router } from 'express';
import { createAdmin, createStudent, createTeacher, deleteAdmin, deleteStudent, deleteTeacher, updateAdmin, updateStudent, updateTeacher,getAllStudents } from '../controllers/userController';
import { updateMarks } from '../controllers/testController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';

const router = Router();

router.post('/teacher', authorizeRoles([USER_ROLE.admin]), createTeacher);
router.put('/teacher', authorizeRoles([USER_ROLE.admin]), updateTeacher);
router.delete('/teacher/:uid', authorizeRoles([USER_ROLE.admin]), deleteTeacher);

router.post('/student', authorizeRoles([USER_ROLE.admin]), createStudent);
router.put('/student', authorizeRoles([USER_ROLE.admin]), updateStudent);
router.delete('/student/:uid', authorizeRoles([USER_ROLE.admin]), deleteStudent);

router.post('/admin', authorizeRoles([USER_ROLE.admin]), createAdmin);
router.put('/admin', authorizeRoles([USER_ROLE.admin]), updateAdmin);
router.delete('/admin/:uid', authorizeRoles([USER_ROLE.admin]), deleteAdmin);

router.get('/students', getAllStudents);
// router.post('/marks', updateMarks);


export default router;
