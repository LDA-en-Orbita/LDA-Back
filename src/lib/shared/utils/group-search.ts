import { Groups, GroupSearchResult, KeywordsIndex } from "@shared/types/group-search.type";

const norm = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "_");

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function findKeywordCandidates(keywordsIndex: KeywordsIndex, qKey: string): string[] {
  const keys = Object.keys(keywordsIndex);
  const contains = keys.filter(k => k.includes(qKey));
  const starts = keys.filter(k => k.startsWith(qKey));
  const merged = Array.from(new Set([...starts, ...contains]));
  merged.sort((a, b) => {
    const fa = keywordsIndex[a] ?? 0;
    const fb = keywordsIndex[b] ?? 0;
    if (fb !== fa) return fb - fa;
    return a.length - b.length;
  });
  return merged.slice(0, 10);
}

function buildGroupTokenRegex(keywordKey: string): RegExp {
  const token = escapeRegex(keywordKey);
  return new RegExp(`(?:^|_)${token}(?:_|$)`);
}

export function searchGroupsByKeyword<T = any>(
  params: {
    query: string;
    keywordsIndex: KeywordsIndex;
    groups: Groups;
  }
): GroupSearchResult<T> {
  const { query, keywordsIndex, groups } = params;
  const qKey = norm(query);

  let keywordKey = qKey;
  let candidates: string[] = [];
  if (!(qKey in keywordsIndex)) {
    candidates = findKeywordCandidates(keywordsIndex, qKey);
    if (candidates.length > 0) {
      keywordKey = candidates[0];
      candidates = candidates.slice(1);
    }
  }

  const rx = buildGroupTokenRegex(keywordKey);
  const matchedGroupKeys = Object.keys(groups).filter(k => rx.test(k));

  const dedupBy = (it: any) => it?.nasaId ?? it?.url ?? JSON.stringify(it);
  const seen = new Set<string>();
  const items: T[] = [];
  for (const gk of matchedGroupKeys) {
    const arr = groups[gk] ?? [];
    for (const it of arr) {
      const key = String(dedupBy(it));
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(it);
    }
  }

  return { keywordKey, candidates, matchedGroupKeys, items };
}
