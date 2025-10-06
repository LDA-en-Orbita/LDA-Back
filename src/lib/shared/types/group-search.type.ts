export type KeywordsIndex = Record<string, number>;
export type Groups = Record<string, any[]>;
export type GroupSearchResult<T = any> = {
  keywordKey: string;
  candidates: string[];
  matchedGroupKeys: string[];
  items: T[]
};
