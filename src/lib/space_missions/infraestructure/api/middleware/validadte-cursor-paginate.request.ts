// src/interfaces/http/middlewares/ValidatePaginationRequest.ts
import { Request, Response, NextFunction } from "express";
import { query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { __ } from "@shared/validations/messages";

declare global {
    namespace Express {
        interface Request {
            page?: { cursor: number; limit: number };
        }
    }
}

export const ValidateCursorPaginationRequest = [
    query("cursor")
        .optional()
        .isInt({ min: 0 })
        .withMessage(__("cursor.invalid"))
        .toInt()
        .customSanitizer((v) => (v === undefined || Number.isNaN(v) ? 0 : v)),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage(__("limit.range"))
        .toInt()
        .customSanitizer((v) => (v === undefined || Number.isNaN(v) ? 5 : v)),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                errors: errors.array(),
            });
        }
        const cursor = (req.query.cursor as unknown as number) ?? 0;
        const limit = (req.query.limit as unknown as number) ?? 5;

        req.page = { cursor, limit };
        next();
    },
] as Array<(req: Request, res: Response, next: NextFunction) => void>;
