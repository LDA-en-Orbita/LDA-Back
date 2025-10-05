export function makePlanetPredicate(planetEn: string) {
    const p = planetEn.toLowerCase();
    const mustInclude = [p, p === "earth" ? "terra" : ""].filter(Boolean);

    const blacklist = [
        "artist concept",
        "artist's concept",
        "concept art",
        "illustration",
        "infographic",
        "trappist",
        "kepler",
        "exoplanet",
        "exomoon",
        "the planets",
        "nso",
        "symphony",
        "concert",
        "patch",
        "logo",
        "poster",
        "celebration",
        "brew house",
        "dogs",
        "drone",
        "pennsylvania",
    ];

    const isHit = (s?: string) =>
        !!s && mustInclude.some((k) => s.toLowerCase().includes(k));
    const hasBlack = (s?: string) =>
        !!s && blacklist.some((b) => s.toLowerCase().includes(b));

    return (item: any) => {
        const d = item?.data?.[0];
        const title = d?.title as string | undefined;
        const desc = d?.description as string | undefined;
        const kws = Array.isArray(d?.keywords)
            ? d.keywords.map((x: string) => x.toLowerCase())
            : [];
        const joined = [title, desc, kws.join(" ")].filter(Boolean).join(" ");

        if (!isHit(joined)) return false;
        if (hasBlack(joined)) return false;

        return true;
    };
}
