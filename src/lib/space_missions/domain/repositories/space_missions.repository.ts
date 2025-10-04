import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";

export interface SpaceMissionsRepository {
    getByPlanet(code: CodePlanetsEnums): Promise<any>;
    getAll(page: PaginationParams): Promise<any>;
}
