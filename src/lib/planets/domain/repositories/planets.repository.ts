import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";


export interface PlanetsRepository {
    getByCode(code: CodePlanetsEnums): Promise<any>;
    getAll(): Promise<any>;
}
