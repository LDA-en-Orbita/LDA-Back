export interface CandidateImage {
  nasaId: string;
  title: string;
  description?: string;
  keywords?: string[];
  previewUrl?: string;
  assetJsonUrl: string;
}

export interface ResolvedImage {
  nasaId: string;
  title: string;
  bestUrl: string;
  altUrls: string[];
  source: string;
  credit?: string;
  keywords?: string[];
}

export type PlanetImageJson = {
  planet: string;
  count: number;
  items: Array<{
    title: string;
    nasaId: string;
    url: string;
    source: string;
    keywords?: string[];
  }>;
  keywordsIndex?: Record<string, number>;
  groups?: Record<string, PlanetImageJson["items"]>;
  groupsIndex?: Record<string, number>;
};
