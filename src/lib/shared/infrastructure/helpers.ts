import { CodePlanetsEnums, getCodeByName, isValidCode } from "@shared/enums/code-planets.enum";


export function isCodeEnumKey(s: string): s is keyof typeof CodePlanetsEnums {
  return Object.prototype.hasOwnProperty.call(CodePlanetsEnums, s);
}

const toEnumKey = (s: string) =>
    s
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

export function resolveToPlanetCode(input: string): CodePlanetsEnums | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  if (/^\d{3}$/.test(raw) && isValidCode(raw)) {
    return raw as CodePlanetsEnums;
  }

  const key = toEnumKey(raw);
  if (isCodeEnumKey(key)) {
    return CodePlanetsEnums[key];
  }

  const alias = getCodeByName(raw, "es") ?? getCodeByName(raw, "en");
  return alias ?? null;
}
