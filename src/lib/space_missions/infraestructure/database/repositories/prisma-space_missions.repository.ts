import { DatasetKey } from "@shared/config/constants";
import { CodePlanetsEnums, PLANET_CODES } from "@shared/enums/code-planets.enum";
import { SpaceMissionsRepository } from "src/lib/space_missions/domain/repositories/space_missions.repository";
import { JsonDatasetReader } from "@shared/datasets/json-dataset";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";

export class PrismaSpaceMissionsRepository implements SpaceMissionsRepository {
    private reader: JsonDatasetReader<CodePlanetsEnums>;
    constructor(dataset: DatasetKey = "space_missions") {
        this.reader = new JsonDatasetReader<CodePlanetsEnums>(dataset);
    }

    async getByPlanet(code: CodePlanetsEnums): Promise<any> {
        return this.reader.readById(code);
    }

    async getAll(page: PaginationParams): Promise<any> {
        return this.reader.readMany(PLANET_CODES);
    }
}
