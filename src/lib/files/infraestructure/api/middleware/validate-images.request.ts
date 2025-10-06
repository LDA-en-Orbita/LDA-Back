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
                keyword?: string;
                nasaIds?: string[];
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
        .optional({ nullable: false })
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

    query("keyword").optional({ nullable: true }).isString().withMessage(__("keyword.string")).trim(),

    query("nasaIds")
        .optional({ nullable: true })
        .customSanitizer((v) => {
            if (v == null) return undefined;
            const raw = String(v).trim();
            if (!raw) return undefined;
            if (raw.startsWith("[") && raw.endsWith("]")) {
                try {
                    const parsed = JSON.parse(raw);
                    return Array.isArray(parsed) ? parsed : undefined;
                } catch {
                    return undefined;
                }
            }
            return raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        })
        .custom((value) => {
            if (value === undefined) return true;
            if (!Array.isArray(value)) throw new Error(__("nasaIds.array"));
            if (value.some((v) => typeof v !== "string" || v.trim() === "")) {
                throw new Error(__("nasaIds.items"));
            }
            return true;
        }),

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
        const keyword = (req.query.keyword as string | undefined) ?? undefined;
        const nasaIds = (req.query.nasaIds as string[] | undefined) ?? undefined;

        req.validated_files = { code, type, keyword, nasaIds};
        next();
    },
] as Array<(req: Request, res: Response, next: NextFunction) => void>;
