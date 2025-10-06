import {
    Groups,
    GroupSearchResult,
    KeywordsIndex,
} from "@shared/types/group-search.type";

const norm = (s: string) =>
    s
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[\s\-]+/g, "_")
        .replace(/^_+|_+$/g, "");

const escapeRx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function buildTokenRegex(token: string): RegExp {
    const t = escapeRx(token);
    return new RegExp(`(?:^|_)${t}(?:_|$)`);
}

const normalizeId = (v: string) => v.trim().toUpperCase();

type MatchMode = "OR" | "AND";

const buildNormIndexMap = (index: KeywordsIndex) => {
    const m = new Map<string, string[]>();
    for (const k of Object.keys(index)) {
        const nk = norm(k);
        const arr = m.get(nk) ?? [];
        if (!arr.includes(k)) arr.push(k);
        m.set(nk, arr);
    }
    return m;
};

export function searchGroupsStrict<T = any>(params: {
    keywords?: string | string[];
    nasaIds?: string[];
    keywordsIndex: KeywordsIndex;
    groups: Groups<T>;
    mode?: MatchMode;
}): GroupSearchResult<T> {
    const { keywords, nasaIds, keywordsIndex, groups, mode = "OR" } = params;

    const normIndex = buildNormIndexMap(keywordsIndex);

    const keysNorm = (() => {
        if (!keywords) return [];
        const arr = Array.isArray(keywords) ? keywords : [keywords];
        const normed = arr.map(norm).filter(Boolean);
        return normed.filter((k) => normIndex.has(k));
    })();

    if (keywords && keysNorm.length === 0) {
        return {
            usedKeyword: undefined,
            suggestions: [],
            matchedGroupKeys: [],
            totalItems: 0,
            items: [],
        };
    }

    let matchedGroupKeys: string[];
    if (keysNorm.length > 0) {
        const groupKeys = Object.keys(groups);
        if (mode === "AND") {
            const regexes = keysNorm.map(buildTokenRegex);
            matchedGroupKeys = groupKeys.filter((gk) =>
                regexes.every((rx) => rx.test(gk))
            );
        } else {
            const regexes = keysNorm.map(buildTokenRegex);
            matchedGroupKeys = groupKeys.filter((gk) =>
                regexes.some((rx) => rx.test(gk))
            );
        }
    } else {
        matchedGroupKeys = Object.keys(groups);
    }

    const seen = new Set<string>();
    const dedupKey = (it: any) =>
        it?.nasaId ?? it?.nasaID ?? it?.url ?? JSON.stringify(it);

    const allMatched: T[] = [];
    for (const gk of matchedGroupKeys) {
        const arr = groups[gk] ?? [];
        for (const it of arr) {
            const k = String(dedupKey(it));
            if (seen.has(k)) continue;
            seen.add(k);
            allMatched.push(it);
        }
    }

    const totalItems = allMatched.length;

    let items = allMatched;
    if (Array.isArray(nasaIds) && nasaIds.length > 0) {
        const wanted = new Set(nasaIds.map(normalizeId));
        items = allMatched.filter((it: any) => {
            const id = it?.nasaId ?? it?.nasaID ?? "";
            return wanted.has(normalizeId(String(id)));
        });
    }

    const usedKeyword = keysNorm.length === 1 ? keysNorm[0] : undefined;

    return {
        usedKeyword,
        suggestions: [],
        matchedGroupKeys,
        totalItems,
        items,
    };
}
