import { Request, Response, NextFunction } from "express";
import { param, query, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { __ } from "@shared/validations/messages";
import { resolveToPlanetCode } from "@shared/infrastructure/helpers";
import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { APP_CATALOG, DatasetKey } from "@shared/config/constants";

declare global {
    namespace Express {
        interface Request {
            validated_files?: {
                code: CodePlanetsEnums;
                type?: DatasetKey;
            };
        }
    }
}

const allowedDatasetTypes = Object.keys(APP_CATALOG.datasets) as DatasetKey[];

export const ValidateCodeAndTypeRequest = [
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

    query("type")
        .optional({ nullable: true })
        .isString()
        .withMessage(__("type.string"))
        .bail()
        .custom((value) => {
            const v = String(value).trim();
            if (!allowedDatasetTypes.includes(v as DatasetKey)) {
                const allowed = allowedDatasetTypes.join(", ");
                throw new Error(
                    `Valor inválido para "type". Permitidos: ${allowed}`
                );
            }
            return true;
        })
        .customSanitizer((value) => String(value).trim() as DatasetKey),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                errors: errors.array(),
            });
        }

        const code = req.params.code as CodePlanetsEnums;
        const type = (req.query.type as DatasetKey | undefined) ?? undefined;

        req.validated_files = { code, type };
        next();
    },
] as Array<(req: Request, res: Response, next: NextFunction) => void>;
