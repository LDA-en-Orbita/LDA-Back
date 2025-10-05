import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { PaginationResponse } from "@shared/pagination/cursor/PaginationResponse";

export interface SpaceMissionsRepository {
    getByPlanet(code: CodePlanetsEnums): Promise<any>;
    getAll(page: PaginationParams): Promise<PaginationResponse<any>>;
}
