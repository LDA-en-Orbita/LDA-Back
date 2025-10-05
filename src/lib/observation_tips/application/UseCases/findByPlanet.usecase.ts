import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { ObservationTipsRepository } from "../../domain/repositories/observation-tips.repository";

export class FindByPlanetUseCase {
    constructor(
        private readonly observationTipsRepository: ObservationTipsRepository
    ) {}

    async execute(
        code: CodePlanetsEnums
    ): Promise<Record<CodePlanetsEnums, any>> {
        const data = await this.observationTipsRepository.getByPlanet(code);
        return data;
    }
}
