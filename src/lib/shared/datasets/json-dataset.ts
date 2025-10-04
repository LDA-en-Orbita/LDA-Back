import path from "path";
import { promises as fs } from "fs";
import { APP_CATALOG, DatasetKey } from "@shared/config/constants";

const LIB_ROOT = path.resolve(process.cwd(), "src", "lib");

export function safeJoinFromLib(...segments: string[]) {
    const abs = path.resolve(LIB_ROOT, path.join(...segments));
    const base = LIB_ROOT.endsWith(path.sep) ? LIB_ROOT : LIB_ROOT + path.sep;
    if (!abs.startsWith(base))
        throw new Error(`Ruta fuera del proyecto: ${abs}`);
    return abs;
}

export function ensureDataset(dataset: DatasetKey) {
    if (!(dataset in APP_CATALOG.datasets)) {
        throw new Error(`Dataset inválido: ${dataset as string}`);
    }
    return dataset;
}

export function datasetDir(dataset: DatasetKey) {
    const ds = APP_CATALOG.datasets[dataset];
    const gp = APP_CATALOG.global_path;
    return safeJoinFromLib(ds, gp);
}

export class JsonDatasetReader<ID extends string = string> {
    private current: DatasetKey;

    constructor(dataset: DatasetKey) {
        this.current = ensureDataset(dataset);
    }

    setDataset(dataset: DatasetKey) {
        this.current = ensureDataset(dataset);
    }

    dir() {
        return datasetDir(this.current);
    }

    pathFor(id: ID) {
        return path.join(this.dir(), `${id}.json`);
    }

    async readById<T = any>(id: ID): Promise<T> {
        const abs = this.pathFor(id);
        try {
            await fs.access(abs);
        } catch {
            throw new Error(`Archivo no encontrado: ${abs}`);
        }
        const raw = await fs.readFile(abs, "utf8");
        try {
            return JSON.parse(raw) as T;
        } catch (e: any) {
            throw new Error(`JSON inválido en ${abs}: ${e.message}`);
        }
    }

    async readMany<T = any>(
        ids: readonly ID[],
        strict = false
    ): Promise<Record<ID, Awaited<T>>> {
        if (strict) {
            await Promise.all(
                ids.map(async (id) => {
                    await fs.access(this.pathFor(id));
                })
            );
            const entries = await Promise.all(
                ids.map(async (id) => {
                    const val = await this.readById<T>(id);
                    return [id, val] as const;
                })
            );
            return Object.fromEntries(entries) as Record<ID, Awaited<T>>;
        }

        const results = await Promise.allSettled(
            ids.map(async (id) => {
                const val = await this.readById<T>(id);
                return [id, val] as const;
            })
        );

        const ok = results
            .filter(
                (r): r is PromiseFulfilledResult<readonly [ID, Awaited<T>]> =>
                    r.status === "fulfilled"
            )
            .map((r) => r.value);

        return Object.fromEntries(ok) as Record<ID, Awaited<T>>;
    }

    async listIdsFromFs(): Promise<ID[]> {
        const files = await fs.readdir(this.dir(), { withFileTypes: true });
        const ids = files
            .filter((f) => f.isFile() && f.name.endsWith(".json"))
            .map((f) => path.basename(f.name, ".json") as ID);
        return ids;
    }
}
