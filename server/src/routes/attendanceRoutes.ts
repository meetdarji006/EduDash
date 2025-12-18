import { Router } from 'express';
import { createAttendance, getAttendance, getStudentMonthlyAttendance, getStudentAttendanceHistory } from '../controllers/attendanceController';
import { authorizeRoles } from '../middleware/auth';
import { USER_ROLE } from '../utils/constants';

const router = Router();

router.post('/', authorizeRoles([USER_ROLE.admin,USER_ROLE.teacher]), createAttendance);
router.get('/', getAttendance);
router.get('/:studentId/monthly', getStudentMonthlyAttendance);
router.get('/:studentId/history', getStudentAttendanceHistory);

export default router;
