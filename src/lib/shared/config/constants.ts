import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";
import { PlanetConfigType } from "src/lib/planets/domain/type/planet-config.type";

export const APP_CATALOG: Record<CodePlanetsEnums, PlanetConfigType> = {
  [CodePlanetsEnums.MERCURIO]: {
    path: "src/lib/planets/infraestructure/database/json/planets/mercury.json",
  },
  [CodePlanetsEnums.VENUS]: {
    path: "src/lib/planets/infraestructure/database/json/planets/venus.json",
  },
  [CodePlanetsEnums.TIERRA]: {
    path: "src/lib/planets/infraestructure/database/json/planets/tierra.json",
  },
  [CodePlanetsEnums.MARTE]: {
    path: "src/lib/planets/infraestructure/database/json/planets/marte.json",
  },
  [CodePlanetsEnums.JUPITER]: {
    path: "src/lib/planets/infraestructure/database/json/planets/jupiter.json",
  },
  [CodePlanetsEnums.SATURNO]: {
    path: "src/lib/planets/infraestructure/database/json/planets/saturno.json",
  },
  [CodePlanetsEnums.URANO]: {
    path: "src/lib/planets/infraestructure/database/json/planets/uranus.json",
  },
  [CodePlanetsEnums.NEPTUNO]: {
    path: "src/lib/planets/infraestructure/database/json/planets/neptuno.json",
  },
  [CodePlanetsEnums.PLUTON]: {
    path: "src/lib/planets/infraestructure/database/json/planets/pluton.json",
  },
};
