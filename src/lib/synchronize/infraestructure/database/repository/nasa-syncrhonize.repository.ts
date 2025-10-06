import {
    CandidateImage,
    PlanetImageItem,
    PlanetImageJson,
    ResolvedImage,
} from "@src/lib/synchronize/domain/dto/syncrhonize-image.dto";
import { SynchronizeRepository } from "@src/lib/synchronize/domain/repositories/synchronize.repository";
import { config } from "@config/Environment.config";
import { CodePlanetsEnums } from "@shared/enums/code-planets.enum";
import { JsonDatasetWriter } from "@shared/datasets/json-dataset";
import { CtorOpts } from "@src/lib/synchronize/domain/types/ctor-options.type";
import { makePlanetPredicate } from "@shared/utils/planet-filters";
import {
    buildKeywordSummary,
    dedupeAndNormalizeKeywords,
    normalizeKeyword,
} from "@shared/utils/keywords";

export class NasaSynchronizeRepository implements SynchronizeRepository {
    private readonly base = config.HOST_NASA_IMAGE;
    private readonly writer: JsonDatasetWriter<`${CodePlanetsEnums}`>;
    private readonly subdir?: string | string[];

    constructor(opts: CtorOpts = {}) {
        const dataset = opts.dataset ?? "synchronize";
        this.writer = new JsonDatasetWriter<`${CodePlanetsEnums}`>(dataset);
        this.subdir = opts.subdir ?? ["images"];
    }

    async searchByPlanet(planetEn: string): Promise<CandidateImage[]> {
        const q = encodeURIComponent(planetEn);
        const url = `${this.base}/search?media_type=image&q=${q}&title=${q}&description=${q}&keywords=${q}&page_size=100`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`NASA /search failed: ${res.status}`);
        const json = await res.json();

        const rawItems: any[] = json?.collection?.items ?? [];
        const keep = makePlanetPredicate(planetEn);
        const items = rawItems.filter(keep);

        const mapped: CandidateImage[] = items
            .map((it: any) => {
                const d = it?.data?.[0];
                const preview = it?.links?.find((l: any) => !!l?.href)?.href as
                    | string
                    | undefined;
                if (!d?.nasa_id || !preview) return null as any;

                return {
                    nasaId: String(d.nasa_id),
                    title:
                        typeof d.title === "string"
                            ? d.title
                            : String(d.title ?? d.nasa_id),
                    keywords: dedupeAndNormalizeKeywords(
                        Array.isArray(d.keywords) ? d.keywords : []
                    ),
                    previewUrl: preview.replace(/^http:/, "https:"),
                } as CandidateImage;
            })
            .filter(Boolean);

        const seenId = new Set<string>();
        const seenUrl = new Set<string>();
        const out = mapped.filter((c) => {
            if (seenId.has(c.nasaId)) return false;
            if (c.previewUrl && seenUrl.has(c.previewUrl)) return false;
            seenId.add(c.nasaId);
            if (c.previewUrl) seenUrl.add(c.previewUrl);
            return true;
        });

        return out;
    }

    async curateToJson(
        planetEn: string,
        items: ResolvedImage[]
    ): Promise<PlanetImageJson> {
        const SLICE_MAX = 120;
        const subset = items.slice(0, SLICE_MAX);

        const norm = normalizeKeyword;
        const planetKey = norm(planetEn);
        const BAD = [
            "artist concept",
            "artist's concept",
            "concept art",
            "illustration",
            "infographic",
            "logo",
            "patch",
            "concert",
            "orchestra",
            "the planets",
            "trappist-1",
            "exoplanet",
        ].map(norm);

        type FlatItem = {
            title: string;
            nasaId: string;
            url: string;
            source: string;
            keywords: string[];
        };

        const candidates: FlatItem[] = subset.map((x) => ({
            title: x.title ?? x.nasaId,
            nasaId: x.nasaId,
            url: x.bestUrl?.replace(/^http:/, "https:"),
            source: x.source,
            keywords: Array.isArray(x.keywords) ? x.keywords : [],
        }));

        const appearsPlanet = (it: FlatItem) => {
            const blob = [norm(it.title), ...it.keywords.map(norm)].join(" | ");
            return blob.includes(planetKey);
        };
        const hasBad = (it: FlatItem) => {
            const blob = [norm(it.title), ...it.keywords.map(norm)].join(" | ");
            return BAD.some((b) => blob.includes(b));
        };

        const seenIds = new Set<string>();
        const seenUrls = new Set<string>();
        const cleaned: FlatItem[] = candidates
            .filter((it) => it?.nasaId && it?.url)
            .filter(appearsPlanet)
            .filter((it) => !hasBad(it))
            .filter((it) => {
                if (seenIds.has(it.nasaId) || seenUrls.has(it.url))
                    return false;
                seenIds.add(it.nasaId);
                seenUrls.add(it.url);
                return true;
            })
            .map((it) => ({
                ...it,
                keywords: dedupeAndNormalizeKeywords(it.keywords),
            }));

        const keywordsIndex = buildKeywordSummary(cleaned);

        const phraseKey = (k: string) => norm(k).replace(/\s+/g, "_");

        const makeGroupKey = (kws: string[] = []) => {
            const normed = dedupeAndNormalizeKeywords(kws);
            const hasPlanet = normed.includes(planetKey);
            const rest = normed.filter((k) => k !== planetKey);
            if (!rest.length && !hasPlanet) return "";
            rest.sort((a, b) => a.localeCompare(b));
            const parts = hasPlanet ? [planetKey, ...rest] : rest;
            return parts.map(phraseKey).join("_");
        };

        const groupsMap = new Map<string, PlanetImageItem[]>();
        for (const it of cleaned) {
            const gkey = makeGroupKey(it.keywords);
            if (!gkey) continue;
            if (!groupsMap.has(gkey)) groupsMap.set(gkey, []);
            groupsMap.get(gkey)!.push({
                title: it.title,
                nasaId: it.nasaId,
                url: it.url,
                source: it.source,
                keywords: it.keywords,
            });
        }

        const groups = Object.fromEntries(groupsMap.entries());
        const groupsIndex = Object.fromEntries(
            Object.entries(groups).map(([k, arr]) => [k, arr.length])
        );

        const count = Object.values(groupsIndex).reduce((a, b) => a + b, 0);

        return {
            planet: planetEn,
            count,
            keywordsIndex,
            groups,
            groupsIndex,
        };
    }

    async persistImagesJson(
        code: CodePlanetsEnums,
        payload: {
            code: CodePlanetsEnums;
            nameEs: string;
            data: PlanetImageJson;
        }
    ): Promise<string> {
        return this.writer.writeById(`${code}`, payload, {
            subdir: this.subdir,
            pretty: true,
            atomic: true,
        });
    }
}
