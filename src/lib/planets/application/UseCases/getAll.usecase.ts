import { PlanetsRepository } from "../../domain/repositories/planets.repository";

export class GetAllUseCase{
    constructor(
        private readonly planetsRepository: PlanetsRepository,
    ) {}

    async execute(): Promise<any> {
        const data = await this.planetsRepository.getAll();
        return data;
    }
}
