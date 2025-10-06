import { CodePlanetsEnums, PLANET_CODES } from "@shared/enums/code-planets.enum";

export type PlanetFile = { code: string };
export type PlanetCodeKey = (typeof PLANET_CODES)[CodePlanetsEnums];
