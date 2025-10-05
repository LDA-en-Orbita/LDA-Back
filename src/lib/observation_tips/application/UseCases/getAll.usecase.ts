import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { PaginationResponse } from "@shared/pagination/cursor/PaginationResponse";
import { ObservationTipsRepository } from "../../domain/repositories/observation-tips.repository";

export class getAllUseCase {
    constructor(
        private readonly observationTipsRepository: ObservationTipsRepository
    ) {}

    async execute(page: PaginationParams): Promise<PaginationResponse<any>> {
        const data = await this.observationTipsRepository.getAll(page);
        return data;
    }
}
