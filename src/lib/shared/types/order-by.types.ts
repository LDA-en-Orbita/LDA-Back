export type OrderDir = "asc" | "desc";
export type ValueType = "string" | "number" | "date" | "boolean";

export type OrderBy = {
  key: string;
  type?: ValueType;
  dir?: OrderDir;
  nulls?: "first" | "last";
};
