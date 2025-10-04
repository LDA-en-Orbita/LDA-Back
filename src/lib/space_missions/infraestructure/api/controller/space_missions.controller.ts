import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { withServicesTransaction } from "@shared/infrastructure/transaction/TransactionHandler";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export class SpaceMissionsController {
    async getByPlanet(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.params.code as CodePlanetsEnums;
            const info = await withServicesTransaction(async (services) => {
                return await services.spaceMissionsService.getByPlanet.execute(
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
            const page = req.page as PaginationParams;

            const info = await withServicesTransaction(async (services) => {
                return await services.spaceMissionsService.getAll.execute(page);
            });
            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
}
