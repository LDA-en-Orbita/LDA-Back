import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { PaginationResponse } from "@shared/pagination/cursor/PaginationResponse";
import { EducationContentRepository } from "../../domain/repositories/education-content.repository";

export class getAllUseCase {
    constructor(
        private readonly educationContentRepository: EducationContentRepository
    ) {}

    async execute(page: PaginationParams): Promise<PaginationResponse<any>> {
        const data = await this.educationContentRepository.getAll(page);
        return data;
    }
}
