import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { SpaceMissionsRepository } from "../../domain/repositories/space_missions.repository";

export class FindByPlanetUseCase{
    constructor(
        private readonly spaceMissionsRepository: SpaceMissionsRepository,
    ) {}

    async execute(code: CodePlanetsEnums): Promise<Record<CodePlanetsEnums, any>> {
        const data = await this.spaceMissionsRepository.getByPlanet(code);
        return data;
    }
}
