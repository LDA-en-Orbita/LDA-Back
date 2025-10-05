import {
    CodePlanetsEnums,
    getNameByCode,
} from "@shared/enums/code-planets.enum";
import {
    CandidateImage,
    PlanetImageJson,
    ResolvedImage,
} from "@src/lib/synchronize/domain/dto/syncrhonize-image.dto";
import { SynchronizeRepository } from "../../../domain/repositories/synchronize.repository";

export class SynchronizeImagesUseCase {
    constructor(
        private readonly synchronizeRepository: SynchronizeRepository
    ) {}

    async execute(code: CodePlanetsEnums): Promise<{
        code: CodePlanetsEnums;
        nameEs: string;
        data: PlanetImageJson & { keywordsIndex?: Record<string, number> };
        savedPath?: string;
    }> {
        const nameEs = getNameByCode(code, "es")!;
        const nameEn = getNameByCode(code, "en")!;

        const raw: CandidateImage[] =
            await this.synchronizeRepository.searchByPlanet(nameEn);
        if (!raw?.length) {
            const empty: PlanetImageJson = {
                planet: nameEn,
                count: 0,
                items: [],
            };
            let savedPath: string | undefined;
            try {
                savedPath = await this.synchronizeRepository.persistImagesJson(
                    code,
                    { code, nameEs, data: empty }
                );
            } catch {}
            return { code, nameEs, data: empty, savedPath };
        }

        const seen = new Set<string>();
        const candidates = raw
            .filter((c) => !!c.previewUrl && !!c.nasaId)
            .filter((c) =>
                seen.has(c.nasaId) ? false : (seen.add(c.nasaId), true)
            );

        const resolvedFromPreview: ResolvedImage[] = candidates.map((c) => ({
            nasaId: c.nasaId,
            title: c.title ?? c.nasaId,
            bestUrl: c.previewUrl!,
            altUrls: [],
            source: "images-api.nasa.gov",
            credit: undefined,
            keywords: c.keywords ?? [],
        }));

        const MAX_ITEMS = 120;
        const slice = resolvedFromPreview.slice(0, MAX_ITEMS);

        let curated: PlanetImageJson & {
            keywordsIndex?: Record<string, number>;
        };
        try {
            const out = await this.synchronizeRepository.curateToJson(
                nameEn,
                slice
            );
            curated = {
                planet: out.planet ?? nameEn,
                count: Number(out.count ?? out.items?.length ?? 0),
                items: Array.isArray(out.items) ? out.items : [],
                ...((out as any).keywordsIndex
                    ? { keywordsIndex: (out as any).keywordsIndex }
                    : {}),
            };
        } catch {
            curated = {
                planet: nameEn,
                count: slice.length,
                items: slice.map((x) => ({
                    title: x.title,
                    nasaId: x.nasaId,
                    url: x.bestUrl,
                    source: x.source,
                    keywords: x.keywords,
                })),
            };
        }

        let savedPath: string | undefined;
        try {
            savedPath = await this.synchronizeRepository.persistImagesJson(
                code,
                { code, nameEs, data: curated }
            );
        } catch {}

        return { code, nameEs, data: curated, savedPath };
    }
}
