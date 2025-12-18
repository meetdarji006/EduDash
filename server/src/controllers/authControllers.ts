import { Request, Response } from 'express';
import { db } from '../db/connection';
import { users, students, courses, subjects } from '../db/schema';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import jwt from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm';
import { ComparePassword } from '../utils/bcryptCompare';

export const login = async (req: Request, res: Response) => {
    //console.log("Login attempt:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Please Provide username and password"));
    }

    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Please Provide Valid Credentials."));
    }

    const match = ComparePassword(password, user.password);

    if (!match) {
        return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Please Provide Valid Password."));
    }

    const secret = process.env.AUTH_KEY || "";
    const token = jwt.sign({ id: user.id }, secret);

    const data = {
        token,
        username: user.username,
        role: user.role,
    };

    return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, data, "Login Successfull"))
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "Unauthorized"));
        }

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json(new ErrorResponse(STATUS_CODES.NOT_FOUND, "User not found"));
        }

        let responseData: any = { ...user };
        delete responseData.password;

        if (user.role === 'STUDENT') {
            const [student] = await db.select().from(students).where(eq(students.userId, userId));
            if (student) {
                responseData = { ...responseData, studentDetails: student };

                if (student.courseId) {
                    const [course] = await db.select().from(courses).where(eq(courses.id, student.courseId));
                    if (course) {
                        responseData.courseName = course.name;
                    }

                    const studentSubjects = await db.select()
                        .from(subjects)
                        .where(
                            and(
                                eq(subjects.courseId, student.courseId),
                                eq(subjects.semester, student.semester)
                            )
                        );

                    responseData.subjects = studentSubjects;
                }
            }
        }

        // console.log(responseData)

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, responseData, "User fetched successfully"));


    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : "Internal Server Error"));
    }
}
