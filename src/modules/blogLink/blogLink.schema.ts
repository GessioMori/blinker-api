import { z } from "zod";

export const BlogProviders = z.enum(["DEVGO", "TKDODO"]);

const BlogLinkBaseSchema = z.object({
  title: z.string(),
  url: z.string(),
  blogName: BlogProviders,
});

const BlogLinkInputSchema = BlogLinkBaseSchema.extend({
  slug: z.string(),
});

const BlogLinkSchema = BlogLinkBaseSchema.extend({
  id: z.number(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogLinkType = z.infer<typeof BlogLinkSchema>;
export type BlogLinkBaseType = z.infer<typeof BlogLinkBaseSchema>;
export type BlogLinkInputType = z.infer<typeof BlogLinkInputSchema>;
export type BlogProvidersType = z.infer<typeof BlogProviders>;
