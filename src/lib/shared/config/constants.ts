import {
    CodePlanetsEnums,
    PLANET_CODES,
} from "@shared/enums/code-planets.enum";
import { PlanetCodeKey, PlanetFile } from "@shared/types/constants.type";

export const APP_CATALOG = {
    global_path: "infraestructure/database/json",
    datasets: {
        planets: "planets",
        space_missions: "space_missions",
        synchronize: "synchronize",
        observation_tips: "observation_tips",
        education_content: "education_content",
        files: "files",
    },
    files_planets: {
        [PLANET_CODES[CodePlanetsEnums.MERCURIO]]: { code: "PIA15164" },
        [PLANET_CODES[CodePlanetsEnums.VENUS]]: { code: "PIA00271" },
        [PLANET_CODES[CodePlanetsEnums.TIERRA]]: { code: "202795" },
        [PLANET_CODES[CodePlanetsEnums.MARTE]]: { code: "PIA04591" },
        [PLANET_CODES[CodePlanetsEnums.JUPITER]]: { code: "PIA22946" },
        [PLANET_CODES[CodePlanetsEnums.SATURNO]]: { code: "PIA11141" },
        [PLANET_CODES[CodePlanetsEnums.NEPTUNO]]: { code: "PIA00046" },
        [PLANET_CODES[CodePlanetsEnums.PLUTON]]: { code: "PIA19952" },
    } as Record<PlanetCodeKey, PlanetFile>,
} as const;

export type DatasetKey = keyof typeof APP_CATALOG.datasets;
