export const APP_CATALOG = {
    global_path: "infraestructure/database/json",
    datasets: {
        planets: "planets",
        space_missions: "space_missions",
        synchronize: "synchronize",
        observation_tips: "observation_tips",
        education_content: "education_content",
    },
} as const;

export type DatasetKey = keyof typeof APP_CATALOG.datasets;
