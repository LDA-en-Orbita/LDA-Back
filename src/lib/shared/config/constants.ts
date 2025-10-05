export const APP_CATALOG = {
  global_path: "infraestructure/database/json",
  datasets: {
    planets: "planets",
    space_missions: "space_missions",
    synchronize: "synchronize"
  },
} as const;

export type DatasetKey = keyof typeof APP_CATALOG.datasets;
