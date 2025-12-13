import { Request, Response } from 'express';
import { db } from '../db/connection';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import bcrypt from "bcrypt";
import { subjects } from '../db/schema';
import { and, eq } from 'drizzle-orm';

export const getAllSubjects = async (req: Request, res: Response) => {
    try {
        const { courseId, semester } = req.query;

        if (!courseId || !semester) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }
        const subjectList = await db
            .select()
            .from(subjects)
            .where(
                and(
                    eq(subjects.courseId, courseId),
                    eq(subjects.semester, Number(semester))
                )
            );

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, subjectList, "Subjects Fetched Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { courseId, semester, name, code } = req.body;

        if (!courseId || !semester || !name || !code) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const [isExisting] = await db.select().from(subjects).where(eq(subjects.code, code)).limit(1);

        if (isExisting) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Subject Already Exists."));
        }

        await db.insert(subjects).values({ courseId, semester, name, code });

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Subject Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }

}

export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId, courseId, semester, name, code } = req.body;

        const updateQuery: {
            courseId?: string,
            semester?: number,
            name?: string,
            code?: string
        } = {};

        if (name !== undefined) {
            updateQuery.name = name;
        }
        if (courseId !== undefined) {
            updateQuery.courseId = courseId;
        }
        if (semester !== undefined) {
            updateQuery.semester = semester;
        }
        if (code !== undefined) {
            updateQuery.code = code;
        }

        await db.update(subjects).set(updateQuery).where(eq(subjects.id, subjectId));
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId } = req.params;
        if (subjectId)
            await db.delete(users).where(eq(subjects.id, subjectId));
        else
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No UID Found"));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Delete Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
