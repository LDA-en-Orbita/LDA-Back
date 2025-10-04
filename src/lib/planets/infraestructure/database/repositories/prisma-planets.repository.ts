import { APP_CATALOG } from "@shared/config/constants";
import path from "path";
import { CodePlanetsEnums } from "src/lib/planets/domain/enums/code-planets.enum";
import { PlanetsRepository } from "src/lib/planets/domain/repositories/planets.repository";
import { promises as fs } from "fs";

const PROJECT_ROOT = path.resolve(process.cwd());

function safeJoin(baseDir: string, relPath: string) {
    const abs = path.resolve(baseDir, relPath);
    const base = baseDir.endsWith(path.sep) ? baseDir : baseDir + path.sep;
    if (!abs.startsWith(base)) {
        throw new Error(`Ruta fuera del proyecto: ${relPath}`);
    }
    return abs;
}

export class PrismaPlanetRepository implements PlanetsRepository {
    constructor(private rootDir = PROJECT_ROOT) {}

    async getByCode(code: CodePlanetsEnums): Promise<any> {
        const item = APP_CATALOG[code];
        if (!item)
            throw new Error(`Catálogo: no existe entrada para code=${code}`);

        const absPath = path.isAbsolute(item.path)
            ? item.path
            : safeJoin(this.rootDir, item.path);

        const raw = await fs.readFile(absPath, "utf8");
        return JSON.parse(raw);
    }

    async getAll(): Promise<Record<CodePlanetsEnums, any>> {
        const entries = Object.entries(APP_CATALOG) as Array<
            [CodePlanetsEnums, { path: string; link?: string }]
        >;

        const pairs = await Promise.all(
            entries.map(async ([code, item]) => {
                const absPath = path.isAbsolute(item.path)
                    ? item.path
                    : safeJoin(this.rootDir, item.path);
                const raw = await fs.readFile(absPath, "utf8");
                const json = JSON.parse(raw);
                return [code, json] as const;
            })
        );

        return Object.fromEntries(pairs) as Record<CodePlanetsEnums, any>;
    }
}
