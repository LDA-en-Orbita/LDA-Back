import { DatasetKey } from "@shared/config/constants";
import { PlanetsRepository } from "src/lib/planets/domain/repositories/planets.repository";
import {
    CodePlanetsEnums,
    PLANET_CODES,
} from "@shared/enums/code-planets.enum";
import { JsonDatasetReader } from "@shared/datasets/json-dataset";

export class PrismaPlanetRepository implements PlanetsRepository {
    private reader: JsonDatasetReader<CodePlanetsEnums>;
    constructor(dataset: DatasetKey = "planets") {
        this.reader = new JsonDatasetReader<CodePlanetsEnums>(dataset);
    }

    async getByCode(code: CodePlanetsEnums): Promise<any> {
        return this.reader.readById(code);
    }

    async getAll(): Promise<Record<CodePlanetsEnums, any>> {
        return this.reader.readMany(PLANET_CODES);
    }
}
