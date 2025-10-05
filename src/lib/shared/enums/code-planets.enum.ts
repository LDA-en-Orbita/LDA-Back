export enum CodePlanetsEnums {
    MERCURIO = "199",
    VENUS = "299",
    TIERRA = "399",
    MARTE = "499",
    JUPITER = "599",
    SATURNO = "699",
    URANO = "799",
    NEPTUNO = "899",
    PLUTON = "999",
}

export type Locale = "es" | "en";

const CODE_TO_NAME: Record<Locale, Record<CodePlanetsEnums, string>> = {
    es: {
        [CodePlanetsEnums.MERCURIO]: "Mercurio",
        [CodePlanetsEnums.VENUS]: "Venus",
        [CodePlanetsEnums.TIERRA]: "Tierra",
        [CodePlanetsEnums.MARTE]: "Marte",
        [CodePlanetsEnums.JUPITER]: "Júpiter",
        [CodePlanetsEnums.SATURNO]: "Saturno",
        [CodePlanetsEnums.URANO]: "Urano",
        [CodePlanetsEnums.NEPTUNO]: "Neptuno",
        [CodePlanetsEnums.PLUTON]: "Plutón",
    },
    en: {
        [CodePlanetsEnums.MERCURIO]: "Mercury",
        [CodePlanetsEnums.VENUS]: "Venus",
        [CodePlanetsEnums.TIERRA]: "Earth",
        [CodePlanetsEnums.MARTE]: "Mars",
        [CodePlanetsEnums.JUPITER]: "Jupiter",
        [CodePlanetsEnums.SATURNO]: "Saturn",
        [CodePlanetsEnums.URANO]: "Uranus",
        [CodePlanetsEnums.NEPTUNO]: "Neptune",
        [CodePlanetsEnums.PLUTON]: "Pluto",
    },
};

export const PLANET_CODES = Object.freeze(
    Object.values(CodePlanetsEnums)
) as Readonly<CodePlanetsEnums[]>;

const norm = (s: string) =>
    s
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

const ALIASES: Record<Locale, Record<string, CodePlanetsEnums>> = {
    es: {
        mercurio: CodePlanetsEnums.MERCURIO,
        venus: CodePlanetsEnums.VENUS,
        tierra: CodePlanetsEnums.TIERRA,
        marte: CodePlanetsEnums.MARTE,
        jupiter: CodePlanetsEnums.JUPITER, // acepta con/sin tilde
        júpiter: CodePlanetsEnums.JUPITER,
        saturno: CodePlanetsEnums.SATURNO,
        urano: CodePlanetsEnums.URANO,
        neptuno: CodePlanetsEnums.NEPTUNO,
        pluton: CodePlanetsEnums.PLUTON, // acepta con/sin tilde
        plutón: CodePlanetsEnums.PLUTON,
    },
    en: {
        mercury: CodePlanetsEnums.MERCURIO,
        venus: CodePlanetsEnums.VENUS,
        earth: CodePlanetsEnums.TIERRA,
        mars: CodePlanetsEnums.MARTE,
        jupiter: CodePlanetsEnums.JUPITER,
        saturn: CodePlanetsEnums.SATURNO,
        uranus: CodePlanetsEnums.URANO,
        neptune: CodePlanetsEnums.NEPTUNO,
        pluto: CodePlanetsEnums.PLUTON,
    },
};

export function getNameByCode(
    code: string,
    locale: Locale = "es"
): string | undefined {
    if (!isValidCode(code)) return undefined;
    return CODE_TO_NAME[locale][code as CodePlanetsEnums];
}

export function getCodeByName(
    name: string,
    locale: Locale = "es"
): CodePlanetsEnums | undefined {
    const key = norm(name);
    return ALIASES[locale][key] ?? ALIASES.es[key] ?? ALIASES.en[key];
}

export function isValidCode(code: unknown): code is CodePlanetsEnums {
    return (
        typeof code === "string" && (PLANET_CODES as string[]).includes(code)
    );
}

export function assertValidCode(
    code: unknown
): asserts code is CodePlanetsEnums {
    if (!isValidCode(code)) {
        throw new Error(
            `Código de planeta inválido: ${code}. Debe ser uno de: ${PLANET_CODES.join(
                ", "
            )}`
        );
    }
}

export function listPlanets(
    locale: Locale = "es"
): ReadonlyArray<{ code: CodePlanetsEnums; name: string }> {
    return PLANET_CODES.map((c) => ({
        code: c as CodePlanetsEnums,
        name: CODE_TO_NAME[locale][c as CodePlanetsEnums],
    }));
}

//TODO: ===== Ejemplos ===== //
// getNameByCode("499")
// getNameByCode("499", "en")

// getCodeByName("Júpiter")
// getCodeByName("jupiter")
// getCodeByName("pluton")

// isValidCode("399")
// isValidCode("123")

// listPlanets()
// assertValidCode(payload.code)
