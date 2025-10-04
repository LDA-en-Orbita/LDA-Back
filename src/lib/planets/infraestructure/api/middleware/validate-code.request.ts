import { resolveToPlanetCode } from "@shared/infrastructure/helpers";
import { __ } from "@shared/validations/messages";
import { Request, Response, NextFunction } from "express";
import { param, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";

declare global {
    namespace Express {
        interface Request {
            validated?: { code: CodePlanetsEnums };
        }
    }
}

export const ValidateCodeRequest = [
    param("code")
        .exists({ checkFalsy: true })
        .withMessage(__("code.required"))
        .bail()
        .isString()
        .withMessage(__("code.string"))
        .bail()
        .custom((value) => {
            const code = resolveToPlanetCode(String(value));
            if (!code) throw new Error(__("code.invalid"));
            return true;
        })
        .customSanitizer((value) => resolveToPlanetCode(String(value))!),

    (req: Request, res: Response, next: NextFunction) => {
        let errors = validationResult(req);
        let errorArray = errors.array();
        if ((req as any)._validationErrors) {
            errorArray = [...errorArray, ...(req as any)._validationErrors];
        }
        if (errorArray.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                errors: errorArray,
            });
        }
        req.validated = { code: req.query.code as CodePlanetsEnums };
        next();
    },
] as Array<(req: Request, res: Response, next: NextFunction) => void>;
