import { CodePlanetsEnums } from "../enums/code-planets.enum";

export interface PlanetsRepository {
    getByCode(code: string): Promise<any>;
    getAll(): Promise<Record<CodePlanetsEnums, any>>;
}
