import { Request, Response } from 'express';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { db } from '../db/connection';
import { assignments, submissions } from '../db/schema';


export const createAssignment = async (req: Request, res: Response) => {
    try {
        const { subjectId, title, description, dueDate } = req.body;

        if (!subjectId || !title || !description || !dueDate) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const formettedDate = new Date(dueDate).toISOString();
        await db.insert(assignments).values({ subjectId, title, description, dueDate: formettedDate })

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Assignment Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const updateSubmissions = async (req: Request, res: Response) => {
    try {
        const { subjectId, assignmentId, submissionDetails } = req.body;

        if (!subjectId || !assignmentId || !submissionDetails || !Array.isArray(submissionDetails) || submissionDetails.length === 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const formettedSubmissions = submissionDetails.map((s) => ({
            subjectId,
            assignmentId,
            ...s
        }))

        await db.insert(submissions).values(formettedSubmissions)

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Assignments Inserted Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
