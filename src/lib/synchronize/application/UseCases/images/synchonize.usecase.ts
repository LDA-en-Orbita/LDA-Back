import { CodePlanetsEnums, getNameByCode } from "@shared/enums/code-planets.enum";
import { PlanetImageJson, ResolvedImage } from "@src/lib/synchronize/domain/dto/syncrhonize-image.dto";
import { SynchronizeRepository } from "@src/lib/synchronize/domain/repositories/synchronize.repository";

export class SynchronizeImagesUseCase {
  constructor(private readonly synchronizeRepository: SynchronizeRepository) {}

  async execute(code: CodePlanetsEnums) {
    const nameEs = getNameByCode(code, "es")!;
    const nameEn = getNameByCode(code, "en")!;

    const raw = await this.synchronizeRepository.searchByPlanet(nameEn);
    if (!raw?.length) {
      return { code, nameEs, data: { planet: nameEn, count: 0, items: [] } };
    }

    const seen = new Set<string>();
    const candidates = raw
      .filter((c) => !!c.previewUrl && !!c.nasaId)
      .filter((c) => (seen.has(c.nasaId) ? false : (seen.add(c.nasaId), true)));

    const resolvedFromPreview: ResolvedImage[] = candidates.map((c) => ({
      nasaId: c.nasaId,
      title: c.title ?? c.nasaId,
      bestUrl: c.previewUrl!,
      altUrls: [],
      source: "images-api.nasa.gov",
      credit: undefined,
      keywords: c.keywords ?? [],
    }));

    const MAX_LLM = 120;
    const slice = resolvedFromPreview.slice(0, MAX_LLM);

    let curated: PlanetImageJson;
    curated = await this.synchronizeRepository.curateToJson(nameEn, slice) as PlanetImageJson;

    await this.synchronizeRepository.persistImagesJson(code, {
      code,
      nameEs,
      data: curated,
    });

    return { code, nameEs, data: curated };
  }
}
