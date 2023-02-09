import { z } from "zod";

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInputType = z.infer<typeof LoginInputSchema>;
