import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const environmentSchema = z.object({
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .default('8080'),
  DB_URL: z.string(),
  API_JWT_SECRET: z.string(),
});

export const config = environmentSchema.parse(process.env);
