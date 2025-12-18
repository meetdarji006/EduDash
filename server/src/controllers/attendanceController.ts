import { Request, Response } from 'express';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { db } from '../db/connection';
import { attendance, students, users } from '../db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const createAttendance = async (req: Request, res: Response) => {
    try {
        const { date, attendanceDetails } = req.body;

        if (!date || !attendanceDetails || !Array.isArray(attendanceDetails) || attendanceDetails.length === 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        // 1. Prepare the data
        // Ensure 'a' contains studentId and status matching your schema keys
        const formattedAttendance = attendanceDetails.map(a => ({
            date: date,
            studentId: a.studentId,
            status: a.status
        }));

        // 2. Perform the Upsert (Insert or Update)
        await db.insert(attendance)
            .values(formattedAttendance)
            .onConflictDoUpdate({
                // The columns that form the unique constraint
                target: [attendance.studentId, attendance.date],

                // What to update if a conflict is found.
                // `excluded.status` refers to the new status value you tried to insert
                set: { status: sql`excluded.status` }
            });

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Attendance Saved Successfully"));

    } catch (error) {
        // Helpful for debugging: log the error
        console.error("Attendance Insert Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getAttendance = async (req: Request, res: Response) => {

    const { date, semester, courseId } = req.query as { date: string; semester: string; courseId: string };

    //console.log("Get attendance request params:", { date, semester, courseId });

    try {
        if (!date || !semester || !courseId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Date, Semester, and Course ID are required"));
        }

        const today = new Date();
        const selected = new Date(date);

        if (selected > today) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Date cannot be in the future"));
        }

        // Logic: Get ALL students for the Course/Sem -> Attach Attendance if it exists for that Date
        const attendanceRecords = await db
            .select({
                studentId: students.id,
                name: users.name,
                rollno: students.rollNo,
                status: attendance.status,  // Will be null if no attendance record exists
                attendanceId: attendance.id, // Useful for frontend updates
            })
            .from(students) // 1. Start with Students
            .innerJoin(users, eq(students.userId, users.id)) // 2. Get Student Names
            .leftJoin(
                attendance,
                and(
                    eq(attendance.studentId, students.id),
                    eq(attendance.date, selected.toISOString()) // 3. Join Attendance ONLY for selected date
                )
            )
            .where(
                and(
                    eq(students.semester, Number(semester)),
                    eq(students.courseId, courseId)
                )
            );

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, attendanceRecords, "Attendance Fetched Successfully"));

    } catch (error) {
        console.error("Attendance Fetch Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getStudentMonthlyAttendance = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        if (!studentId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Student ID is required"));
        }

        // 1. Verify student exists (optional but good practice)
        const student = await db.query.students.findFirst({
            where: eq(students.id, studentId)
        });

        if (!student) {
            return res.status(STATUS_CODES.NOT_FOUND).json(new ErrorResponse(STATUS_CODES.NOT_FOUND, "Student not found"));
        }

        // 2. Fetch all attendance for this student
        const attendanceRecords = await db
            .select()
            .from(attendance)
            .where(eq(attendance.studentId, studentId));

        // 3. Group by Month
        // Structure: { "2023-10": { PRESENT: 5, ABSENT: 1, TOTAL: 6, ... } }
        const monthlyStats: Record<string, any> = {};

        attendanceRecords.forEach(record => {
            if (!record.date) return;

            const dateObj = new Date(record.date);
            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyStats[monthKey]) {
                monthlyStats[monthKey] = { TOTAL: 0, PRESENT: 0, ABSENT: 0, LATE: 0 };
            }

            const stats = monthlyStats[monthKey];
            stats.TOTAL += 1;

            const status = record.status as string;
            if (stats[status] !== undefined) {
                stats[status] += 1;
            }
        });

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, {
            studentId,
            monthlyStats
        }, "Student Monthly Attendance Fetched Successfully"));

    } catch (error) {
        console.error("Student Attendance Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getStudentAttendanceHistory = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        if (!studentId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Student ID is required"));
        }

        // 1. Fetch all attendance
        const attendanceRecords = await db
            .select()
            .from(attendance)
            .where(eq(attendance.studentId, studentId))
            .orderBy(attendance.date);

            //console.log(attendanceRecords)

        // 2. Group by Month with Details
        const history: Record<string, any> = {};

        attendanceRecords.forEach(record => {
            if (!record.date) return;

            const dateObj = new Date(record.date);
            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

            if (!history[monthKey]) {
                history[monthKey] = {
                    stats: { TOTAL: 0, PRESENT: 0, ABSENT: 0, LATE: 0 },
                    records: []
                };
            }

            // Update Stats
            const stats = history[monthKey].stats;
            stats.TOTAL += 1;

            const status = record.status as string;

            if (stats[status] !== undefined) {
                stats[status] += 1;
            }

            // Add Record Detail
            history[monthKey].records.push({
                id: record.id,
                date: record.date,
                status: record.status
            });
        });

        //console.log(history)

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, {
            studentId,
            data : history
        }, "Student Attendance History Fetched Successfully"));

    } catch (error) {
        console.error("Student History Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

