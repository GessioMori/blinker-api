import prisma from "@/infra/db/prisma";
import {
  BlogLinkInputType,
  BlogLinkType,
  BlogProvidersType,
} from "@blogLink/blogLink.schema";
import { BlogLinkRepository } from "@blogLink/repositories/blogLink.repository";

export class PrismaBlogLinkRepository implements BlogLinkRepository {
  async createBlogLink(data: BlogLinkInputType): Promise<BlogLinkType> {
    const blogLink = await prisma.blogLink.create({
      data,
    });
    return blogLink;
  }

  async getBlogLinkBySlug(slug: string): Promise<BlogLinkType | null> {
    const blogLink = await prisma.blogLink.findUnique({
      where: { slug },
    });
    return blogLink;
  }

  async getBlogLinksByProvider(
    provider: BlogProvidersType
  ): Promise<BlogLinkType[]> {
    const blogLinks = await prisma.blogLink.findMany({
      where: { blogName: provider },
    });
    return blogLinks;
  }

  async getBlogLinkByURL(url: string): Promise<BlogLinkType | null> {
    const blogLink = await prisma.blogLink.findUnique({
      where: { url },
    });
    return blogLink;
  }
}
