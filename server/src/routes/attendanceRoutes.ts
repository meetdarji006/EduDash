import { Router } from 'express';
import { createAttendance, getAttendance, getStudentMonthlyAttendance, getStudentAttendanceHistory } from '../controllers/attendanceController';

const router = Router();

router.post('/', createAttendance);
router.get('/', getAttendance);
router.get('/:studentId/monthly', getStudentMonthlyAttendance);
router.get('/:studentId/history', getStudentAttendanceHistory);

export default router;
