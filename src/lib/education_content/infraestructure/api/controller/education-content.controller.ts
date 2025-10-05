import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { withServicesTransaction } from "@shared/infrastructure/transaction/TransactionHandler";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export class EducationContentController {
    async getByPlanet(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.params.code as CodePlanetsEnums;
            const info = await withServicesTransaction(async (services) => {
                return await services.educationContentService.getByPlanet.execute(
                    code
                );
            });
            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page: PaginationParams = {
                cursor: Number(req.query.cursor) || 1,
                limit: Number(req.query.limit) || 10,
            };
            const info = await withServicesTransaction(async (services) => {
                return await services.educationContentService.getAll.execute(
                    page
                );
            });
            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
}
