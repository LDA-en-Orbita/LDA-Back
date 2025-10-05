import { ParamsFilesDto } from "../../domain/dto/params-files.dto";
import { FilesRepository } from "../../domain/repositories/files.repository";

export class GetByCodeAndTypeUseCase {

    constructor(private readonly filesRepository: FilesRepository) {}

    async execute(params: ParamsFilesDto): Promise<any> {
        // const file = await this.filesRepository.getByCode(params);
        // return file;
    }
}
