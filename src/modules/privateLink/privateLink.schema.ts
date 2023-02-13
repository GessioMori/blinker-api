import { z } from "zod";

export const PrivateLinkBaseSchema = z.object({
  title: z.string().min(3).max(50),
  url: z.string().url(),
});

export const PrivateLinkSchema = PrivateLinkBaseSchema.extend({
  id: z.number(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
});

export const PrivateLinkServiceInputSchema = PrivateLinkBaseSchema.extend({
  userId: z.number(),
});

export const PrivateLinkRepositoryInputSchema = PrivateLinkBaseSchema.extend({
  slug: z.string(),
  userId: z.number(),
});

export const PrivateLinkUpdateSchema = PrivateLinkBaseSchema.extend({
  id: z.number(),
  title: z.string().min(3).max(50).optional(),
  url: z.string().url().optional(),
  userId: z.number(),
});

export const PrivateLinkInputUpdateSchema = z.object({
  title: z.string().min(3).max(50).optional(),
  url: z.string().url().optional(),
});

export type PrivateLinkType = z.infer<typeof PrivateLinkSchema>;
export type PrivateLinkRepositoryInputType = z.infer<
  typeof PrivateLinkRepositoryInputSchema
>;
export type PrivateLinkUpdateType = z.infer<typeof PrivateLinkUpdateSchema>;
export type PrivateLinkBaseType = z.infer<typeof PrivateLinkBaseSchema>;
export type PrivateLinkServiceInputType = z.infer<
  typeof PrivateLinkServiceInputSchema
>;
