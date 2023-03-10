import { BlogProviders } from "@blogLink/blogLink.schema";
import { z } from "zod";

const UserBaseSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

export const UserSchema = UserBaseSchema.extend({
  id: z.number(),
  password: z.string(),
  subscriptions: z.array(BlogProviders),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserInputSchema = UserBaseSchema.extend({
  password: z.string().min(8),
});

export const UserOutputSchema = UserBaseSchema.extend({
  id: z.number(),
  subscriptions: z.array(BlogProviders),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserLoginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const UpdateSubscriptionsBaseSchema = z.object({
  blogName: BlogProviders,
  action: z.enum(["add", "remove"]),
});

export const UpdateSubscriptionsSchema = UpdateSubscriptionsBaseSchema.extend({
  userId: z.number(),
});

export type UserType = z.infer<typeof UserSchema>;
export type CreateUserInputType = z.infer<typeof CreateUserInputSchema>;
export type UserOutputType = z.infer<typeof UserOutputSchema>;
export type UpdateSubscriptionsType = z.infer<typeof UpdateSubscriptionsSchema>;
export type UserLoginInputType = z.infer<typeof UserLoginInputSchema>;
