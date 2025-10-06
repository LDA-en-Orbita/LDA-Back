import { JsonDatasetReader } from "@shared/datasets/json-dataset";
import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { searchGroupsByKeyword } from "@shared/utils/group-search";
import { ParamsFilesDto } from "@src/lib/files/domain/dto/params-files.dto";
import { FilesRepository } from "@src/lib/files/domain/repositories/files.repository";
import { CtorOpts } from "@src/lib/synchronize/domain/types/ctor-options.type";

export class NasaFilesRepository implements FilesRepository {
    private readonly reader: JsonDatasetReader<`${CodePlanetsEnums}`>;
    private readonly subdir?: string | string[];

    constructor(opts: CtorOpts = {}) {
        const dataset = opts.dataset ?? "synchronize";
        this.reader = new JsonDatasetReader<`${CodePlanetsEnums}`>(dataset);
        this.subdir = opts.subdir ?? ["images"];
    }
    async getByCode(params: ParamsFilesDto): Promise<any>{

        const payload = await this.reader.readByIdFrom(params.code,this.subdir);
        const result = searchGroupsByKeyword({
            query: params.target as string,
            keywordsIndex: payload.data.keywordsIndex,
            groups: payload.data.groups
        });

        return result;
    };

}
