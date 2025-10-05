import { DatasetKey } from "@shared/config/constants";

export type CtorOpts = {
  apiKey?: string;
  dataset?: DatasetKey;
  subdir?: string | string[];
};
