const stripDiacritics = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function normalizeKeyword(k: string): string {
  return stripDiacritics(k)
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupeAndNormalizeKeywords(arr?: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of arr) {
    const n = normalizeKeyword(String(raw));
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

export function buildKeywordSummary(items: Array<{ keywords?: string[] }>) {
  const map = new Map<string, number>();
  for (const it of items) {
    for (const k of dedupeAndNormalizeKeywords(it.keywords)) {
      map.set(k, (map.get(k) ?? 0) + 1);
    }
  }
  return Object.fromEntries(
    [...map.entries()].sort((a, b) => b[1] - a[1])
  );
}
