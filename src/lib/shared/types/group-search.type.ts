export type KeywordsIndex = Record<string, number>;
export type Groups<T = any> = Record<string, T[]>;
export type GroupSearchResult<T = any> = {
  usedKeyword?: string;
  suggestions: string[];
  matchedGroupKeys: string[];
  totalItems: number;
  items: T[];
};
