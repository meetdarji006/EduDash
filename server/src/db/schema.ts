import { pgTable, unique,uuid, varchar, text, timestamp, integer, date, pgEnum, index } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum("user_role", ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["PRESENT", "ABSENT", "LATE"]);
export const submissionStatusEnum = pgEnum("submission_status", ["SUBMITTED", "LATE", "PENDING"]);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    username: varchar('username', { length: 100 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('STUDENT'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const students = pgTable('students', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    rollNo: varchar('roll_no', { length: 50 }).unique().notNull(),
    courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    semester: integer('semester').notNull(),
    phone: varchar('phone', { length: 15 }),
    address: text('address'),
});

export const teachers = pgTable('teachers', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    phone: varchar('phone', { length: 15 }),
});

export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    duration: integer('duration').default(6), // e.g. 6 semesters
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const subjects = pgTable('subjects', {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    code: varchar('code', { length: 50 }).unique().notNull(),
    semester: integer('semester').notNull(),
    // teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'set null' }),
});

export const attendance = pgTable('attendance', {
    id: uuid('id').primaryKey().defaultRandom(),
    studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    status: attendanceStatusEnum('status').notNull().default('PRESENT')
}, (t) => ({
    // Add this constraint so the DB knows what "Duplicate" means
    unq: unique().on(t.studentId, t.date),
    // Add index on date for faster date-range queries
    dateIdx: index('attendance_date_idx').on(t.date)
}));

export const tests = pgTable('tests', {
    id: uuid('id').primaryKey().defaultRandom(),
    subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 100 }).notNull(),
    maxMarks: integer('max_marks').notNull(),
    date: date('date').notNull(),
});

export const marks = pgTable('marks', {
    id: uuid('id').primaryKey().defaultRandom(),
    testId: uuid('test_id').references(() => tests.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
    marksObtained: integer('marks_obtained').notNull(),
});

export const assignments = pgTable('assignments', {
    id: uuid('id').primaryKey().defaultRandom(),
    subjectId: uuid('subject_id').references(() => subjects.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description'),
    dueDate: date('due_date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const submissions = pgTable('submissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    assignmentId: uuid('assignment_id').references(() => assignments.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
    submittedAt: timestamp('submitted_at').defaultNow(),
    fileUrl: text('file_url'),
    status: submissionStatusEnum('status').default('SUBMITTED'), // 'submitted' | 'late' | 'graded'
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type Mark = typeof marks.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
