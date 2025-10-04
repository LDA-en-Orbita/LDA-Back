import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const environmentSchema = z.object({
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .default('3000'),
});

export const config = environmentSchema.parse(process.env);
