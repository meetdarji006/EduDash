import { Request, Response } from 'express';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { db } from '../db/connection';
import { marks, subjects, tests } from '../db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export const createTest = async (req: Request, res: Response) => {
    try {
        const { subjectId, title, maxMarks, date } = req.body;

        if (!subjectId || !title || !maxMarks || !date) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const formettedDate = new Date(date).toISOString();
        await db.insert(tests).values({ subjectId, title, maxMarks, date: formettedDate })

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

        const formettedMarks = marksDetails.map((m) => ({
            testId,
            ...m
        }))

        await db.insert(marks).values(formettedMarks)

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
            courseId: subjects.courseId
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
        console.log(testId)

        if (!testId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Test Id is required"));
        }

        await db.delete(tests).where(eq(tests.id, testId))
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Test Deleted Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
