import { CodePlanetsEnums } from "../../domain/enums/code-planets.enum";
import { PlanetsRepository } from "../../domain/repositories/planets.repository";

export class GetAllUseCase{
    constructor(
        private readonly planetsRepository: PlanetsRepository,
    ) {}

    async execute(): Promise<Record<CodePlanetsEnums, any>> {
        const data = await this.planetsRepository.getAll();
        return data;
    }
}
