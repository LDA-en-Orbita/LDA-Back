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


export type PlanetImageItem = {
  title: string;
  nasaId: string;
  url: string;
  source: string;
  keywords?: string[];
};

export type PlanetImageJson = {
  planet: string;
  count: number;
  keywordsIndex?: Record<string, number>;
  groups?: Record<string, PlanetImageItem[]>;
  groupsIndex?: Record<string, number>;
};

