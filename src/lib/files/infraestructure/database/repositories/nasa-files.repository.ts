import { config } from "@config/Environment.config";
import { ParamsFilesDto } from "@src/lib/files/domain/dto/params-files.dto";
import { FilesRepository } from "@src/lib/files/domain/repositories/files.repository";
import { CtorOpts } from "@src/lib/synchronize/domain/types/ctor-options.type";
import OpenAI from "openai";

export class NasaFilesRepository implements FilesRepository {
    private readonly openai: OpenAI;

    constructor(opts: CtorOpts = {}) {
        const apiKey = opts.apiKey ?? config.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY is required");
        this.openai = new OpenAI({ apiKey });
    }

    async getByCode(params: ParamsFilesDto): Promise<any>{

    };

}
