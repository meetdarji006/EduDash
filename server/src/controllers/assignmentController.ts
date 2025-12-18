import { Request, Response } from 'express';
import { STATUS_CODES } from '../utils/constants';
import { ApiResponse, ErrorResponse } from '../utils/response';
import { db } from '../db/connection';
import { assignments, subjects, submissions, assignmentQuestions, students, users, marks } from '../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { AuthenticatedRequest } from '../middleware/auth';

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
        const { submissionDetails } = req.body;
        let { assignmentId } = req.params;
        // console.log("Assignment Id:", assignmentId);
        // console.log("Submission Details:", submissionDetails);
        if (!assignmentId) {
            assignmentId = req.body.assignmentId;
        }

        if (!assignmentId || !submissionDetails || !Array.isArray(submissionDetails) || submissionDetails.length === 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Assignment Id and Submission Details are required"));
        }

        // Fetch existing submissions for this assignment
        const existingSubmissions = await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
        const submissionMap = new Map(existingSubmissions.map(s => [s.studentId, s]));

        const toInsert: any[] = [];

        // console.log(`Processing ${submissionDetails.length} submissions for assignment ${assignmentId}`);

        for (const detail of submissionDetails) {
            const { studentId, status } = detail;

            if (!studentId) {
                // console.log("Skipping detail with missing studentId:", detail);
                continue;
            }

            const existing = submissionMap.get(studentId);

            if (existing) {
                // Check status regression: Don't change SUBMITTED to PENDING
                let newStatus = status;
                if (existing.status === 'SUBMITTED' && status === 'PENDING') {
                    // console.log(`Skipping regression for student ${studentId}: SUBMITTED -> PENDING`);
                    newStatus = existing.status;
                }

                // If status provided and different, update
                if (newStatus && newStatus !== existing.status) {
                    // console.log(`Updating student ${studentId}: ${existing.status} -> ${newStatus}`);
                    await db.update(submissions)
                        .set({ status: newStatus })
                        .where(eq(submissions.id, existing.id));
                } else {
                    // console.log(`No change for student ${studentId}: Status remains ${existing.status}`);
                }
            } else {
                // console.log(`New submission for student ${studentId} with status ${status || 'PENDING'}`);
                // New submission record
                toInsert.push({
                    assignmentId,
                    studentId,
                    status: status || 'PENDING',
                });
            }
        }

        if (toInsert.length > 0) {
            // console.log(`Inserting ${toInsert.length} new records`);
            await db.insert(submissions).values(toInsert);
        }

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, "Submissions Updated Successfully"));

    } catch (error) {
        console.error("Error in updateSubmissions:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getAssignments = async (req: Request, res: Response) => {
    try {
        const { courseId, semester } = req.query;

        if (!courseId || !semester) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Course Id and Semester are required"));
        }

        const assignmentList = await db.select({
            id: assignments.id,
            subjectId: assignments.subjectId,
            title: assignments.title,
            description: assignments.description,
            dueDate: assignments.dueDate,
            subjectName: subjects.name,
            subjectCode: subjects.code,
        })
            .from(assignments)
            .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
            .where(
                and(
                    eq(subjects.courseId, courseId as string),
                    eq(subjects.semester, Number(semester))
                )
            );

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, assignmentList, "Assignments Fetched Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const addAssignmentQuestion = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;
        console.log("Request Body:", req.body); // Debugging
        const { questions } = req.body; // or const questions = req.body if it's an array

        if (!assignmentId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Assignment Id and Questions (Array) are required"));
        }

        const formattedQuestions = questions.map((question: any) => ({
            assignmentId,
            question
        }));

        await db.insert(assignmentQuestions).values(formattedQuestions);

        return res.status(STATUS_CODES.CREATED).json(new ApiResponse(STATUS_CODES.CREATED, null, "Questions Added Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }

}

export const getAssignmentQuestions = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;

        if (!assignmentId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Assignment Id is required"));
        }

        const questions = await db.select()
            .from(assignmentQuestions)
            .where(eq(assignmentQuestions.assignmentId, assignmentId));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, questions, "Questions Fetched Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getAssignmentSubmissions = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;
        // console.log("Assignment Id:", assignmentId);
        if (!assignmentId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Assignment Id is required"));
        }

        const assignmentSubmissions = await db.select({
            id: submissions.id,
            studentId: submissions.studentId,
            submittedAt: submissions.submittedAt,
            // fileUrl: submissions.fileUrl,
            status: submissions.status,
        })
            .from(submissions)
            .where(eq(submissions.assignmentId, assignmentId));
        console.log("Assignment Submissions:", assignmentSubmissions.length);
        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, assignmentSubmissions, "Submissions Fetched Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

export const getStudentAssignments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "User not authenticated"));
        }

        const [student] = await db.select().from(students).where(eq(students.userId, userId));

        if (!student) {
            return res.status(STATUS_CODES.NOT_FOUND).json(new ErrorResponse(STATUS_CODES.NOT_FOUND, "Student not found"));
        }

        // Check if student has courseId before querying
        if (!student.courseId) {
            return res.status(STATUS_CODES.BAD_REQUEST).json(new ErrorResponse(STATUS_CODES.BAD_REQUEST, "Student not enrolled in a course"));
        }

        const studentAssignments = await db.select({
            id: assignments.id,
            title: assignments.title,
            description: assignments.description,
            dueDate: assignments.dueDate,
            subjectName: subjects.name,
            subjectCode: subjects.code,
            status: submissions.status,
        })
            .from(assignments)
            .innerJoin(subjects, eq(assignments.subjectId, subjects.id))
            .leftJoin(submissions, and(eq(submissions.assignmentId, assignments.id), eq(submissions.studentId, student.id)))
            // .leftJoin(assignmentQuestions, eq(assignmentQuestions.assignmentId, assignments.id)) // We need questions nested. Doing a join here might duplicate rows for each question.
            .where(
                and(
                    eq(subjects.courseId, student.courseId),
                    eq(subjects.semester, student.semester)
                )
            );

        const assignmentIds = studentAssignments.map(a => a.id);

        // Define explicit type for questionsMap to avoid implicit any errors if strict mode is on
        type QuestionType = typeof assignmentQuestions.$inferSelect;
        let questionsMap: Record<string, QuestionType[]> = {};

        if (assignmentIds.length > 0) {
            const questions = await db.select().from(assignmentQuestions).where(inArray(assignmentQuestions.assignmentId, assignmentIds));
            questions.forEach(q => {
                if (q.assignmentId) {
                    if (!questionsMap[q.assignmentId]) {
                        questionsMap[q.assignmentId] = [];
                    }
                    questionsMap[q.assignmentId]!.push(q);
                }
            });
        }

        const result = studentAssignments.map(a => ({
            ...a,
            status: a.status || "PENDING",
            questions: questionsMap[a.id] || []
        }));

        return res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, result, "Student Assignments Fetched Successfully"));

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}
