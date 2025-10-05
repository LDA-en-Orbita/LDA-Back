import {
    CodePlanetsEnums,
    getNameByCode,
} from "@shared/enums/code-planets.enum";
import { withServicesTransaction } from "@shared/infrastructure/transaction/TransactionHandler";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export class SyncrhonizeImagesController {
    async synchronize(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.params.code as CodePlanetsEnums;
            const info = await withServicesTransaction(async (services) => {
                return services.synchronizeService.images.execute(code);
            });
            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
}
