import OpenAI from "openai";
import {
    CandidateImage,
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
import { OutItem } from "@shared/types/json-write.type";

type PlanetImageJsonExtended = PlanetImageJson & {
    keywordsIndex?: Record<string, number>;
    groups?: Record<string, OutItem[]>;
    groupsIndex?: Record<string, number>;
};

export class NasaSynchronizeRepository implements SynchronizeRepository {
    private readonly base = config.HOST_NASA_IMAGE;
    private readonly openai: OpenAI;
    private readonly writer: JsonDatasetWriter<`${CodePlanetsEnums}`>;
    private readonly subdir?: string | string[];

    constructor(opts: CtorOpts = {}) {
        const apiKey = opts.apiKey ?? config.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY is required");
        this.openai = new OpenAI({ apiKey });

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

    async resolve(
        nasaId: string,
        title?: string
    ): Promise<ResolvedImage | null> {
        const res = await fetch(
            `${this.base}/asset/${encodeURIComponent(nasaId)}`
        );
        if (!res.ok) return null;

        const json = await res.json();
        const hrefs: string[] = (json?.collection?.items ?? [])
            .map((i: any) => i?.href)
            .filter(Boolean);

        const pick = (tag: string) => hrefs.find((u) => u.includes(tag));
        const best =
            pick("~orig.") ??
            pick("~large.") ??
            pick("~medium.") ??
            hrefs.find((u) => /\.(jpg|jpeg|png|tif)$/i.test(u));

        if (!best) return null;

        return {
            nasaId,
            title: title ?? nasaId,
            bestUrl: best.replace(/^http:/, "https:"),
            altUrls: hrefs
                .filter((u) => u !== best && /\.(jpg|jpeg|png|tif)$/i.test(u))
                .map((u) => u.replace(/^http:/, "https:")),
            source: "images-assets.nasa.gov",
            keywords: [],
        };
    }

    async curateToJson(
        planetEn: string,
        items: ResolvedImage[]
    ): Promise<PlanetImageJsonExtended> {
        const SLICE_MAX = 120;
        const subset = items.slice(0, SLICE_MAX);

        const schema = {
            type: "object",
            properties: {
                planet: { type: "string" },
                count: { type: "integer" },
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            nasaId: { type: "string" },
                            url: { type: "string" },
                            source: { type: "string" },
                            keywords: {
                                type: "array",
                                items: { type: "string" },
                            },
                        },
                        required: ["title", "nasaId", "url", "source"],
                        additionalProperties: false,
                    },
                },
            },
            required: ["planet", "count", "items"],
            additionalProperties: false,
        } as const;

        const sys = [
            "You are an astronomy image curator.",
            "Return ONLY valid JSON matching the provided schema (no prose, no extra keys).",
            "Use ONLY the provided candidates; never invent URLs or IDs.",
            `The requested planet is "${planetEn}" (Solar System planet).`,
            "Primary subject MUST be the planet itself: full/partial disk, surface/terrain, or atmosphere.",
            "Allowed vantage points: space telescopes, orbiters, landers/rovers — ONLY if the planet is the main subject.",
            "STRICTLY EXCLUDE: spacecraft/rovers/instruments as subjects, mission logos/patches, illustrations/infographics, artist concepts, concerts/events, exoplanets, or items unrelated to the planet.",
            "Avoid homonyms and off-topic results (e.g., chemical 'Mercury', music events named 'Mars'). When in doubt, exclude.",
            "Each selected item SHOULD mention the planet in title/description/keywords (case-insensitive).",
        ].join(" ");

        const resp = await this.openai.chat.completions.create({
            model: "gpt-5.1-mini",
            temperature: 0.1,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "planet_image_collection",
                    schema,
                    strict: true,
                },
            },
            messages: [
                { role: "system", content: sys },
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Planet: ${planetEn}` },
                        {
                            type: "text",
                            text: "Resolved candidates (JSON array):",
                        },
                        {
                            type: "text",
                            text: JSON.stringify(subset).slice(0, 180_000),
                        },
                    ],
                },
            ],
        });

        const raw = resp.choices[0].message?.content ?? "{}";
        let parsed: any;
        try {
            parsed = JSON.parse(raw);
        } catch {
            parsed = { planet: planetEn, items: [] };
        }

        const norm = normalizeKeyword;
        const planetKey = norm(planetEn);

        const BAD_KEYWORDS = [
            "artist concept",
            "artist's concept",
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

        type OutItem = {
            title: string;
            nasaId: string;
            url: string;
            source: string;
            keywords?: string[];
        };

        const candidateItems: OutItem[] = Array.isArray(parsed?.items)
            ? parsed.items
            : subset.map((x) => ({
                  title: x.title,
                  nasaId: x.nasaId,
                  url: x.bestUrl,
                  source: x.source,
                  keywords: x.keywords ?? [],
              }));

        const appearsToBePlanet = (it: OutItem) => {
            const inTitle = norm(it.title || "").includes(planetKey);
            const inKeywords = (it.keywords ?? []).some((k) =>
                norm(k).includes(planetKey)
            );
            return inTitle || inKeywords;
        };

        const hasBadKeyword = (it: OutItem) => {
            const blob = [
                norm(it.title || ""),
                ...(it.keywords ?? []).map(norm),
            ].join(" | ");
            return BAD_KEYWORDS.some((b) => blob.includes(b));
        };

        const seenIds = new Set<string>();
        const seenUrls = new Set<string>();

        const cleaned: OutItem[] = candidateItems
            .filter((it) => it?.nasaId && it?.url)
            .filter(appearsToBePlanet)
            .filter((it) => !hasBadKeyword(it))
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
            const phrases = dedupeAndNormalizeKeywords(kws).filter(
                (k) => k !== planetKey
            );
            if (phrases.length === 0) return "";
            phrases.sort((a, b) => a.localeCompare(b));
            return phrases.map(phraseKey).join("_");
        };

        const groupsMap = new Map<string, OutItem[]>();
        for (const it of cleaned) {
            const gkey = makeGroupKey(it.keywords ?? []);
            if (!gkey) continue;
            if (!groupsMap.has(gkey)) groupsMap.set(gkey, []);
            groupsMap.get(gkey)!.push(it);
        }

        const groups = Object.fromEntries(groupsMap.entries());
        const groupsIndex = Object.fromEntries(
            Object.entries(groups).map(([k, arr]) => [k, arr.length])
        );

        cleaned.sort((a, b) => {
            const ak = (a.keywords ?? []).some((k) => k.includes(planetKey))
                ? 0
                : 1;
            const bk = (b.keywords ?? []).some((k) => k.includes(planetKey))
                ? 0
                : 1;
            if (ak !== bk) return ak - bk;
            return (a.title || "").localeCompare(b.title || "");
        });

        const out: PlanetImageJsonExtended = {
            planet: (parsed?.planet as string) || planetEn,
            count: cleaned.length,
            items: cleaned,
            keywordsIndex,
            groups,
            groupsIndex,
        };

        return out;
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
