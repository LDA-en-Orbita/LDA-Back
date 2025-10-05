import path from "path";
import { promises as fs } from "fs";
import { APP_CATALOG, DatasetKey } from "@shared/config/constants";
import { isProd } from "@config/Environment.config";
import { JsonWriteOptions } from "../types/json-write.type";

function resolveLibRoot() {
  const segments = [process.cwd()];
  if (isProd) segments.push("dist");
  segments.push("src", "lib");
  return path.resolve(...segments);
}
const LIB_ROOT = resolveLibRoot();

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

function toArray<T>(v?: T | T[]): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function sanitizeSubpath(subdir?: string | string[]): string[] {
  const segs = toArray(subdir).map((s) => String(s).trim()).filter(Boolean);
  for (const s of segs) {
    if (s === "." || s === ".." || s.includes("..")) {
      throw new Error(`Subruta no permitida: "${s}"`);
    }
  }
  return segs;
}

export class JsonDatasetWriter<ID extends string = string> {
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

  pathFor(id: ID, subpath?: string | string[]) {
    const segs = sanitizeSubpath(subpath);
    const rel = path.join(...segs, `${id}.json`);
    const abs = path.resolve(this.dir(), rel);
    const base = this.dir().endsWith(path.sep) ? this.dir() : this.dir() + path.sep;
    if (!abs.startsWith(base))
      throw new Error(`Ruta fuera del dataset: ${abs}`);
    return abs;
  }

  async writeById<T = unknown>(
    id: ID,
    data: T,
    opts: JsonWriteOptions = {}
  ): Promise<string> {
    const { subdir, pretty = true, atomic = true } = opts;
    const finalPath = this.pathFor(id, subdir);
    const dir = path.dirname(finalPath);

    await fs.mkdir(dir, { recursive: true });

    const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

    if (!atomic) {
      await fs.writeFile(finalPath, json, "utf-8");
      return finalPath;
    }

    const tmpPath = finalPath + ".tmp";
    await fs.writeFile(tmpPath, json, "utf-8");
    await fs.rename(tmpPath, finalPath);
    return finalPath;
  }
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

  pathForIn(id: ID, subpath?: string | string[]) {
    const segs = sanitizeSubpath(subpath);
    const rel = path.join(...segs, `${id}.json`);
    const abs = path.resolve(this.dir(), rel);
    const base = this.dir().endsWith(path.sep) ? this.dir() : this.dir() + path.sep;
    if (!abs.startsWith(base)) throw new Error(`Ruta fuera del dataset: ${abs}`);
    return abs;
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

  async readByIdFrom<T = any>(id: ID, subdir?: string | string[]): Promise<T> {
    const abs = this.pathForIn(id, subdir);
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

  private toArray<X>(v: X | X[]): X[] {
    return Array.isArray(v) ? v : [v];
  }

  async readMany<T = any>(ids: readonly ID[], strict = false): Promise<Awaited<T>[]> {
    if (strict) {
      await Promise.all(ids.map((id) => fs.access(this.pathFor(id))));
      const chunks = await Promise.all(ids.map((id) => this.readById<T | T[]>(id)));
      return chunks.flatMap((c) => this.toArray<Awaited<T>>(c as any));
    }

    const results = await Promise.allSettled(ids.map((id) => this.readById<T | T[]>(id)));
    return results
      .filter((r): r is PromiseFulfilledResult<Awaited<T> | Awaited<T>[]> => r.status === "fulfilled")
      .flatMap((r) => this.toArray<Awaited<T>>(r.value as any));
  }

  async listIdsFromFs(): Promise<ID[]> {
    const files = await fs.readdir(this.dir(), { withFileTypes: true });
    return files
      .filter((f) => f.isFile() && f.name.endsWith(".json"))
      .map((f) => path.basename(f.name, ".json") as ID);
  }
}
