import { Router } from 'express';
import { createCourse, updateCourse, deleteCourse, getAllCourse } from '../controllers/courseController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';

const router = Router();

router.get('/', getAllCourse);
router.post('/', authorizeRoles([USER_ROLE.admin]), createCourse);
router.put('/', authorizeRoles([USER_ROLE.admin]), updateCourse);
router.delete('/:courseid', authorizeRoles([USER_ROLE.admin]), deleteCourse);

export default router;
