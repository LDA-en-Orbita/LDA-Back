import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const toLower = z.preprocess(
    (v) => String(v ?? "dev").toLowerCase(),
    z.enum(["production", "dev"])
);

const environmentSchema = z.object({
    PORT: z
        .string()
        .transform((val) => Number.parseInt(val, 10))
        .default("3000"),
    ENV: toLower.default("dev"),
    OPENAI_API_KEY: z.string(),
    HOST_NASA_IMAGE: z.string(),
});

export const config = environmentSchema.parse(process.env);

export const isProd = config.ENV === "production";
