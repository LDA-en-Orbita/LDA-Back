import { withServicesTransaction } from "@shared/infrastructure/transaction/TransactionHandler";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";

export class PlanetsController {
    async getByCode(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.params.code as CodePlanetsEnums;
            const info = await withServicesTransaction(async (services) => {
                return await services.planetService.getByCode.execute(code);
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
            const info = await withServicesTransaction(async (services) => {
                return await services.planetService.getAll.execute();
            });
            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
}
