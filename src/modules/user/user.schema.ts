import { z } from "zod";

const UserBaseSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

export const UserSchema = UserBaseSchema.extend({
  id: z.number(),
  password: z.string(),
});

export const CreateUserInputSchema = UserBaseSchema.extend({
  password: z.string().min(8),
});

export const UserOutputSchema = UserBaseSchema.extend({
  id: z.number(),
});

export const UserLoginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
export type CreateUserInputType = Omit<UserType, "id">;
export type UserOutputType = Omit<UserType, "password">;

export type UserLoginInputType = z.infer<typeof UserLoginInputSchema>;
