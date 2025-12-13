const SUBMISSION_STATUS = {
    submitted: "SUBMITTED",
    pending: "PENDING",
    late: "LATE"
};
const ATTENDANCE_STATUS = {
    present: "PRESENT",
    absent: "ABSENT",
    late: "LATE"
};

const USER_ROLE = {
    student: "STUDENT",
    superadmin: "SUPER_ADMIN",
    admin: "ADMIN",
    teacher: "TEACHER"
}

const STATUS_CODES = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    UNAUTHORISED: 401,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
}

export { USER_ROLE, SUBMISSION_STATUS, ATTENDANCE_STATUS, STATUS_CODES };
