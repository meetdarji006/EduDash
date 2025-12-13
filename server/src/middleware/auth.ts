import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection';
import { STATUS_CODES, USER_ROLE } from '../utils/constants';
import { ErrorResponse } from '../utils/response';
import jwt, { JwtPayload } from "jsonwebtoken";
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import "dotenv/config"

interface AuthenticatedRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // console.log("token")
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token || typeof token !== "string") {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "Token Required"));
        }

        const secret = process.env.AUTH_KEY || "";

        const response = jwt.verify(token, secret) as JwtPayload;

        if (!response || !response.id) {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "Invalid Token"));
        }
        const [user] = await db.select().from(users).where(eq(users.id, response.id));

        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORISED).json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "Invalid UserId"));
        }
        req.userId = user.id;
        req.userRole = user.role;

        next();
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : 'Unknown error'));
    }
}

// export const isSuperAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const role = req.userRole;

//     if (role !== USER_ROLE.superadmin) {
//         return res.status(STATUS_CODES.FORBIDDEN).json(new ErrorResponse(STATUS_CODES.FORBIDDEN, "Unauthorized Request"));
//     }

//     next();
// }

// export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const role = req.userRole;
//     if (role !== USER_ROLE.admin) {
//         return res.status(STATUS_CODES.FORBIDDEN).json(new ErrorResponse(STATUS_CODES.FORBIDDEN, "Unauthorized Request"));
//     }
//     next();
// }

// export const isTeacher = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const role = req.userRole;
//     if (role !== USER_ROLE.teacher) {
//         return res.status(STATUS_CODES.FORBIDDEN).json(new ErrorResponse(STATUS_CODES.FORBIDDEN, "Unauthorized Request"));
//     }
//     next();
// }

export const authorizeRoles = (roles: string[]) => {

    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            console.log(req.userRole);
            if (!req.userRole) {
                return res
                    .status(STATUS_CODES.UNAUTHORISED)
                    .json(new ErrorResponse(STATUS_CODES.UNAUTHORISED, "No role found"));
            }

            if (!roles.includes(req.userRole)) {
                return res
                    .status(STATUS_CODES.FORBIDDEN)
                    .json(
                        new ErrorResponse(
                            STATUS_CODES.FORBIDDEN,
                            "You are not authorized for this action"
                        )
                    );
            }

            next();
        } catch (error) {
            return res
                .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json(new ErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, "Server Error"));
        }
    };
};
