import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";
import { PlanetConfigType } from "src/lib/planets/domain/type/planet-config.type";

export const APP_CATALOG: Record<CodePlanetsEnums, PlanetConfigType> = {
  [CodePlanetsEnums.MERCURIO]: {
    path: "src/lib/planets/infraestructure/database/json/mercury.json",
  },
  [CodePlanetsEnums.VENUS]: {
    path: "src/lib/planets/infraestructure/database/json/venus.json",
  },
  [CodePlanetsEnums.TIERRA]: {
    path: "src/lib/planets/infraestructure/database/json/tierra.json",
  },
  [CodePlanetsEnums.MARTE]: {
    path: "src/lib/planets/infraestructure/database/json/marte.json",
  },
  [CodePlanetsEnums.JUPITER]: {
    path: "src/lib/planets/infraestructure/database/json/jupiter.json",
  },
  [CodePlanetsEnums.SATURNO]: {
    path: "src/lib/planets/infraestructure/database/json/saturno.json",
  },
  [CodePlanetsEnums.URANO]: {
    path: "src/lib/planets/infraestructure/database/json/uranus.json",
  },
  [CodePlanetsEnums.NEPTUNO]: {
    path: "src/lib/planets/infraestructure/database/json/neptuno.json",
  },
  [CodePlanetsEnums.PLUTON]: {
    path: "src/lib/planets/infraestructure/database/json/pluton.json",
  },
};
