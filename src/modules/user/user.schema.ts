import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const CreateUserInputSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
});

export const UserOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
export type CreateUserInputType = Omit<UserType, "id">;
export type UserOutputType = Omit<UserType, "password">;
