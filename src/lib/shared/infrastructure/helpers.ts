import { CodePlanetsEnums, getCodeByName, isValidCode } from "@shared/enums/code-planets.enum";
import { OrderBy, OrderDir, ValueType } from "@shared/types/order-by.types";
import z from "zod";


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


//TODO: Helpers FILES
const getByPath = (obj: any, path: string) =>
  path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);

const coerce = (val: any, type?: ValueType) => {
  if (val == null) return null;
  switch (type) {
    case "number": return typeof val === "number" ? val : Number(val);
    case "boolean": return Boolean(val);
    case "date": {
      const t = typeof val === "number" ? val : Date.parse(String(val));
      return Number.isNaN(t) ? NaN : t;
    }
    case "string":
    default: return String(val).toLocaleLowerCase();
  }
};

const compareValues = (a: any, b: any, dir: OrderDir, nulls: "first" | "last") => {
  const isNullish = (x: any) => x == null || (typeof x === "number" && Number.isNaN(x));
  const an = isNullish(a), bn = isNullish(b);
  if (an && bn) return 0;
  if (an) return nulls === "first" ? -1 : 1;
  if (bn) return nulls === "first" ? 1 : -1;
  if (a < b) return dir === "asc" ? -1 : 1;
  if (a > b) return dir === "asc" ? 1 : -1;
  return 0;
};

export const buildComparator = <T>(order: OrderBy | OrderBy[]) => {
  const rules = Array.isArray(order) ? order : [order];
  if (!rules.length) return () => 0;
  return (x: T, y: T) => {
    for (const r of rules) {
      const dir = r.dir ?? "asc";
      const nulls = r.nulls ?? "last";
      const av = coerce(getByPath(x, r.key), r.type);
      const bv = coerce(getByPath(y, r.key), r.type);
      const c = compareValues(av, bv, dir, nulls);
      if (c !== 0) return c;
    }
    return 0;
  };
};
