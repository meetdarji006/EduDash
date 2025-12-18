import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection';
import { courses } from '../db/schema';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { eq } from 'drizzle-orm';

export const getAllCourse = async (req: Request, res: Response) => {
    try {
        const courseList = await db.select().from(courses);
        //console.log(courseList);
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, courseList, "Courses Fetched Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { name, duration } = req.body;
        if (!name || !duration) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }
        const newCourse = await db.insert(courses).values({ name, duration });
        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Course Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { courseid } = req.params;

        //console.log(courseid)
        if (!courseid) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No CourseId Found"));
        }
        const course = await db.select().from(courses).where(eq(courses.id, courseid))

        if (!course) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No Course Found"));
        }

        await db.delete(courses).where(eq(courses.id, courseid));
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Deleted Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { courseid } = req.params;
        const { name, duration } = req.body;
        const updateQuery: { name?: string, duration?: number } = {};

        if (name !== undefined) {
            updateQuery.name = name;
        }
        if (duration !== undefined) {
            updateQuery.duration = duration;
        }

        await db.update(courses).set(updateQuery).where(eq(courses.id, courseid as string));
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
