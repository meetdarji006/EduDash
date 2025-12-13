import { Router } from 'express';
import { getAllSubjects, createSubject, deleteSubject, updateSubject } from '../controllers/subjectController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';

const router = Router();

router.get('/', getAllSubjects);
router.post('/', authorizeRoles([USER_ROLE.superadmin, USER_ROLE.admin]), createSubject);
router.put('/', authorizeRoles([USER_ROLE.superadmin, USER_ROLE.admin]), updateSubject);
router.delete('/:uid', authorizeRoles([USER_ROLE.superadmin, USER_ROLE.admin]), deleteSubject);

export default router;
