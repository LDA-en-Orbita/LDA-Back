export type JsonWriteOptions = {
    subdir?: string | string[];
    pretty?: boolean;
    atomic?: boolean;
};

export type OutItem = {
    title: string;
    nasaId: string;
    url: string;
    source: string;
    keywords?: string[];
};
