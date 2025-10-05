import { DatasetKey } from "@shared/config/constants";
import {
    CodePlanetsEnums,
    PLANET_CODES,
} from "@shared/enums/code-planets.enum";
import { JsonDatasetReader } from "@shared/datasets/json-dataset";
import { PaginationParams } from "@shared/pagination/cursor/PaginationParams";
import { PaginationResponse } from "@shared/pagination/cursor/PaginationResponse";
import { buildComparator } from "@shared/infrastructure/helpers";
import { EducationContentRepository } from "@src/lib/education_content/domain/repositories/education-content.repository";

export class NasaEducationContentRepository
    implements EducationContentRepository
{
    private reader: JsonDatasetReader<CodePlanetsEnums>;
    constructor(dataset: DatasetKey = "education_content") {
        this.reader = new JsonDatasetReader<CodePlanetsEnums>(dataset);
    }

    async getByPlanet(code: CodePlanetsEnums): Promise<any> {
        const all = await this.reader.readById(code);
        const sorted = all.slice().sort(
            buildComparator({
                key: "launch_date",
                type: "date",
                dir: "desc",
                nulls: "last",
            })
        );
        return sorted;
    }

    async getAll<T>(page: PaginationParams): Promise<PaginationResponse<T>> {
        const { cursor = 0, limit = 5 } = page;
        const all = await this.reader.readMany<T>(PLANET_CODES, false);
        const sorted = all.slice().sort(
            buildComparator<T>({
                key: "launch_date",
                type: "date",
                dir: "desc",
                nulls: "last",
            })
        );

        const start = Math.max(0, cursor);
        const end = Math.min(start + Math.max(1, limit), sorted.length);
        return {
            data: sorted.slice(start, end),
            nextCursor: end < sorted.length ? end : null,
            hasMore: end < sorted.length,
        };
    }
}
