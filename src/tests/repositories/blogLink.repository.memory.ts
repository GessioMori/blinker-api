import {
  BlogLinkInputType,
  BlogLinkType,
  BlogProvidersType,
} from "@blogLink/blogLink.schema";
import { BlogLinkRepository } from "@blogLink/repositories/blogLink.repository";

export class BlogLinkRepositoryInMemory implements BlogLinkRepository {
  links: BlogLinkType[] = [];

  async createBlogLink(data: BlogLinkInputType): Promise<BlogLinkType> {
    const blogLink = {
      ...data,
      id: this.links.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.links.push(blogLink);
    return blogLink;
  }

  async getBlogLinkBySlug(slug: string): Promise<BlogLinkType | null> {
    const blogLink = this.links.find((link) => link.slug === slug) || null;
    return blogLink;
  }

  async getBlogLinksByProvider(
    provider: BlogProvidersType
  ): Promise<BlogLinkType[]> {
    const blogLinks = this.links.filter((link) => link.blogName === provider);
    return blogLinks;
  }

  async getBlogLinkByURL(url: string): Promise<BlogLinkType | null> {
    const blogLink = this.links.find((link) => link.url === url) || null;
    return blogLink;
  }
}
