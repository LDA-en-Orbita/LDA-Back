import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { CandidateImage, PlanetImageJson, ResolvedImage } from "../dto/syncrhonize-image.dto";

export interface SynchronizeRepository {
  searchByPlanet(planetEn: string, page?: number): Promise<CandidateImage[]>;
  resolve(nasaId: string, title?: string): Promise<ResolvedImage | null>;
  curateToJson(planetEn: string, items: ResolvedImage[]): Promise<PlanetImageJson>;

  persistImagesJson(code: CodePlanetsEnums, payload: {
    code: CodePlanetsEnums;
    nameEs: string;
    data: PlanetImageJson;
  }): Promise<string>;
}
