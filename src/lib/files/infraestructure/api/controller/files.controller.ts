import { withServicesTransaction } from "@shared/infrastructure/transaction/TransactionHandler";
import { ParamsFilesDto } from "@src/lib/files/domain/dto/params-files.dto";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export class FilesController {
    async getByCode(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.validated_files as ParamsFilesDto;

            const info = await withServicesTransaction(async (services) => {
                return await services.filesService.getByCode.execute(params);
            });

            res.status(StatusCodes.OK).json({
                data: info,
            });
        } catch (error) {
            next(error);
        }
    }
}
