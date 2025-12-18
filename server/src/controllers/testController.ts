import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { db } from '../db/connection';
import { marks, students, subjects, tests, users, testSeries } from '../db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export const createTestSeries = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Name is required"));
        }

        await db.insert(testSeries).values({ name, description });

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Test Series Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const createTest = async (req: Request, res: Response) => {
    try {
        const { subjectId, testSeriesId, title, maxMarks, date } = req.body;

        if (!subjectId || !testSeriesId || !title || !maxMarks || !date) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const formettedDate = new Date(date).toISOString();
        await db.insert(tests).values({ subjectId, testSeriesId, title, maxMarks, date: formettedDate })

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Test Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const updateMarks = async (req: Request, res: Response) => {
    try {
        const { testId, marksDetails } = req.body;

        if (!testId || !marksDetails || !Array.isArray(marksDetails) || marksDetails.length === 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const formettedMarks = marksDetails.map((m: any) => ({
            testId,
            studentId: m.studentId,
            marksObtained: m.marks
        }))

        // console.log(formettedMarks);

        await db.insert(marks).values(formettedMarks)
            .onConflictDoUpdate({
                target: [marks.testId, marks.studentId],
                set: { marksObtained: sql`excluded.marks_obtained` }
            })

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Marks Inserted Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getTests = async (req: Request, res: Response) => {
    try {
        const { courseId, semester } = req.query;

        if (!courseId || !semester) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Course Id and Semester are required"));
        }

        const allTests = await db.select({
            id: tests.id,
            subjectId: tests.subjectId,
            title: tests.title,
            maxMarks: tests.maxMarks,
            date: tests.date,
            subjectName: subjects.name,
            subjectCode: subjects.code,
            courseId: subjects.courseId,
            seriesId : tests.testSeriesId
        })
            .from(tests)
            .innerJoin(subjects, eq(tests.subjectId, subjects.id))
            .where(
                and(
                    eq(subjects.courseId, courseId as string),
                    eq(subjects.semester, Number(semester))
                )
            );

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, allTests, "Tests Fetched Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const deleteTest = async (req: Request, res: Response) => {
    try {
        const { testId } = req.params;
        //console.log(testId)

        if (!testId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Test Id is required"));
        }

        await db.delete(tests).where(eq(tests.id, testId))
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Test Deleted Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getStudentTestResults = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).userId;
        if (!userId) {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "User not authenticated"));
        }

        //console.log(userId)

        const [student] = await db.select().from(students).where(eq(students.userId, userId));

        if (!student) {
            return res.status(STATUS_CODES.NOT_FOUND).json(new ErrorResponse(STATUS_CODES.NOT_FOUND, "Student profile not found"));
        }

        console.log(student)

        const testResults = await db.select({
            marks: marks.marksObtained,
            testSeriesName: testSeries.name,
            testTitle: tests.title,
            maxMarks: tests.maxMarks,
            subjectName: subjects.name,
            subjectCode: subjects.code,
        })
            .from(marks)
            .innerJoin(tests, eq(marks.testId, tests.id))
            .innerJoin(testSeries, eq(tests.testSeriesId, testSeries.id))
            .innerJoin(subjects, eq(tests.subjectId, subjects.id))
            .where(eq(marks.studentId, student.id));

        const groupedResults: Record<string, any[]> = {};

        testResults.forEach((result, index) => {
            if (!groupedResults[result.testSeriesName]) {
                groupedResults[result.testSeriesName] = [];
            }
            groupedResults[result.testSeriesName]!.push({
                id: index + 1,
                subject: result.subjectName,
                code: result.subjectCode,
                marks: result.marks,
                total: result.maxMarks
            });
        });

        // console.log(groupedResults);

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, groupedResults, "Student Test Results Fetched Successfully"));

    } catch (error) {
        // console.log(error)
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getTestMarks = async (req: Request, res: Response) => {
    try {
        const { testId } = req.query;

        if (!testId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Test Id is required"));
        }

        const testMarks = await db.select({
            id: marks.id,
            studentId: students.id,
            name: users.name,
            rollNo: students.rollNo,
            marks: marks.marksObtained,
        })
            .from(marks)
            .innerJoin(students, eq(marks.studentId, students.id))
            .innerJoin(users, eq(students.userId, users.id))
            .where(eq(marks.testId, testId as string));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, testMarks, "Test Marks Fetched Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
