import {
  BlogLinkInputType,
  BlogLinkType,
  BlogProvidersType,
} from "../blogLink.schema";

export interface BlogLinkRepository {
  createBlogLink(data: BlogLinkInputType): Promise<BlogLinkType>;
  getBlogLinkBySlug(slug: string): Promise<BlogLinkType | null>;
  getBlogLinkByURL(url: string): Promise<BlogLinkType | null>;
  getBlogLinksByProvider(provider: BlogProvidersType): Promise<BlogLinkType[]>;
}
