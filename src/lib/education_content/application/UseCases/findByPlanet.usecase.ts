import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { EducationContentRepository } from "../../domain/repositories/education-content.repository";

export class FindByPlanetUseCase {
    constructor(
        private readonly educationContentRepository: EducationContentRepository
    ) {}

    async execute(
        code: CodePlanetsEnums
    ): Promise<Record<CodePlanetsEnums, any>> {
        const data = await this.educationContentRepository.getByPlanet(code);
        return data;
    }
}
