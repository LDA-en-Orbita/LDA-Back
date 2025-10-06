import { ParamsFilesDto } from "../dto/params-files.dto";

export interface FilesRepository {
    getByCode(params: ParamsFilesDto): Promise<any>;
}
