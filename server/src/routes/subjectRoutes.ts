import { Router } from 'express';
import { getAllSubjects, createSubject, deleteSubject, updateSubject } from '../controllers/subjectController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';

const router = Router();

router.get('/', getAllSubjects);
router.post('/', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), createSubject);
router.put('/', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), updateSubject);
router.delete('/:uid', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), deleteSubject);

export default router;
