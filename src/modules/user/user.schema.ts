import { z } from "zod";

export const createUserInputSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
});

export const userOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type createUserInputType = z.infer<typeof createUserInputSchema>;
export type userOutputType = z.infer<typeof userOutputSchema>;
