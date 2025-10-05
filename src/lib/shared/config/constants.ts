import path from "path";
import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";
import { PlanetConfigType } from "src/lib/planets/domain/type/planet-config.type";

export const APP_CATALOG: Record<CodePlanetsEnums, PlanetConfigType> = {
    [CodePlanetsEnums.MERCURIO]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/mercury.json"),
    },
    [CodePlanetsEnums.VENUS]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/venus.json"),
    },
    [CodePlanetsEnums.TIERRA]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/tierra.json"),
    },
    [CodePlanetsEnums.MARTE]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/marte.json"),
    },
    [CodePlanetsEnums.JUPITER]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/jupiter.json"),
    },
    [CodePlanetsEnums.SATURNO]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/saturno.json"),
    },
    [CodePlanetsEnums.URANO]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/uranus.json"),
    },
    [CodePlanetsEnums.NEPTUNO]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/neptuno.json"),
    },
    [CodePlanetsEnums.PLUTON]: {
        path: path.join(__dirname, "../../planets/infraestructure/database/json/pluton.json"),
    },
};
