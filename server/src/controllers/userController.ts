import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection';
import { students, teachers, users } from '../db/schema';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { and, eq } from 'drizzle-orm';
import bcrypt from "bcrypt";

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.insert(users).values({ name, username, password: encryptedPassword, role: "ADMIN" });
        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Admin Created Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { uid, name, username, password } = req.body;
        const updateQuery: { name?: string, username?: string, password?: string } = {};

        if (name !== undefined) {
            updateQuery.name = name;
        }
        if (username !== undefined) {
            updateQuery.username = username;
        }
        if (password !== undefined) {
            updateQuery.password = await bcrypt.hash(password, 10);
        }

        await db.update(users).set(updateQuery).where(eq(users.id, uid));
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        if (uid)
            await db.delete(users).where(eq(users.id, uid));
        else
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No UID Found"));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const { name, username, password, courseId, phone } = req.body;

        if (!name || !username || !password || !courseId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const [isExisting] = await db.select().from(users).where(eq(users.username, username)).limit(1);

        if (isExisting) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Teacher Already Exists."));
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({ name, username, password: encryptedPassword, role: "TEACHER" }).returning();

        if (!newUser) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Error While Creating Teacher"));
        }

        await db.insert(teachers).values({ userId: newUser?.id, courseId, phone: phone || null });

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Teacher Created Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const { uid, name, username, password } = req.body;
        const updateQuery: { name?: string, username?: string, password?: string } = {};

        if (name !== undefined) {
            updateQuery.name = name;
        }
        if (username !== undefined) {
            updateQuery.username = username;
        }
        if (password !== undefined) {
            updateQuery.password = await bcrypt.hash(password, 10);
        }

        await db.update(users).set(updateQuery).where(eq(users.id, uid));
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        if (uid)
            await db.delete(users).where(eq(users.id, uid));
        else
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No UID Found"));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Updated Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { name, username, password, courseId, rollNo, semester, phone, address } = req.body;

        if (!name || !username || !password || !courseId || !rollNo || !semester) {
            return res.status(400).json(new ErrorResponse(400, "All Fields Required"));
        }

        const [isExisting] = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (isExisting) {
            return res.status(400).json(new ErrorResponse(400, "Student Already Exists."));
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        // 🔥 TRANSACTION START
        const result = await db.transaction(async (tx) => {

            // Insert user
            const [newUser] = await tx
                .insert(users)
                .values({
                    name,
                    username,
                    password: encryptedPassword
                })
                .returning();

            if (!newUser) {
                tx.rollback();  // rollback inside transaction
                throw new Error("Failed to create user");
            }

            // Insert student
            await tx.insert(students).values({
                userId: newUser.id,
                courseId,
                rollNo,
                semester,
                address: address || null,
                phone: phone || null
            });

            return newUser;
        });

        // 🔥 TRANSACTION END - committed successfully

        return res
            .status(201)
            .json(new ApiResponse(201, result, "Student Created Successfully"));

    } catch (error) {
        return res
            .status(500)
            .json(new ErrorResponse(500, error instanceof Error ? error.message : "Unknown error"));
    }
};

export const updateStudent = async (req: Request, res: Response) => { }

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        if (uid)
            await db.delete(users).where(eq(users.id, uid));
        else
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "No UID Found"));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Delete Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getAllStudent = async (req: Request, res: Response) => {
    try {
        const { courseId, semester } = req.query;

        if (!courseId || !semester) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "All Fields Required"));
        }

        const studentList = await db
            .select({
                id: students.id,
                rollNo: students.rollNo,
                name: users.name,
            })
            .from(students)
            .innerJoin(users, eq(students.userId, users.id))
            .where(
                and(
                    eq(students.courseId, courseId),
                    eq(students.semester, Number(semester))
                )
            );

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, studentList, "Students Fetched Successfully"));
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
