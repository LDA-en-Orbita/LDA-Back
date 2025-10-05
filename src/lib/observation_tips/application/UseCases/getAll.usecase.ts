import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { PaginationResponse } from "@shared/pagination/cursor/PaginationResponse";

export class getAllUseCase {
    constructor(
        private readonly spaceMissionsRepository: SpaceMissionsRepository
    ) {}

    async execute(page: PaginationParams): Promise<PaginationResponse<any>> {
        const data = await this.spaceMissionsRepository.getAll(page);
        return data;
    }
}
