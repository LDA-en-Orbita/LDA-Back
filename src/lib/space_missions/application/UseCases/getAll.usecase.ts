import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { SpaceMissionsRepository } from "../../domain/repositories/space_missions.repository";

export class getAllUseCase{
    constructor(
        private readonly spaceMissionsRepository: SpaceMissionsRepository,
    ) {}

    async execute(page: PaginationParams): Promise<any> {
        const data = await this.spaceMissionsRepository.getAll(page);
        return data;
    }
}
