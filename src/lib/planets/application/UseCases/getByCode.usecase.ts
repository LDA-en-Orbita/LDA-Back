import { CodePlanetsEnums } from "../../domain/enums/code-planets.enum";
import { PlanetsRepository } from "../../domain/repositories/planets.repository";

export class GetByCodeUseCase{
    constructor(
		private readonly planetsRepository: PlanetsRepository,
    ) {}

    async execute(code: CodePlanetsEnums): Promise<any> {
        const data = await this.planetsRepository.getByCode(code);
        return data;
    }
}
