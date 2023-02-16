import { AppError } from "@/utils/errors/AppError";
import { UserRepository } from "@user/repositories/user.repository";
import ShortUniqueId from "short-unique-id";
import { inject, injectable } from "tsyringe";
import {
  BlogLinkBaseType,
  BlogLinkType,
  BlogProviders,
  BlogProvidersType,
} from "./blogLink.schema";
import { BlogLinkRepository } from "./repositories/blogLink.repository";

@injectable()
export class BlogLinkService {
  constructor(
    @inject("BlogLinkRepository")
    private blogLinkRepository: BlogLinkRepository,
    @inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async createBlogLink(data: BlogLinkBaseType): Promise<BlogLinkType> {
    const uid = new ShortUniqueId({ length: 10 });

    const slug = uid();

    return await this.blogLinkRepository.createBlogLink({
      ...data,
      slug,
    });
  }

  async getBlogLinkBySlug(slug: string): Promise<BlogLinkType> {
    const blogLink = await this.blogLinkRepository.getBlogLinkBySlug(slug);
    if (!blogLink) {
      throw new AppError("Blog link not found", 404);
    }
    return blogLink;
  }

  async getBlogLinksByProvider(provider: string): Promise<BlogLinkType[]> {
    const parsedProvider = BlogProviders.parse(provider);
    return await this.blogLinkRepository.getBlogLinksByProvider(parsedProvider);
  }

  async getBlogLinksByUserId(userId: number): Promise<BlogLinkType[]> {
    const user = await this.userRepository.findById(userId);
    let blogLinks = [];
    if (!user) {
      throw new AppError("User not found", 404);
    }

    for (const blog of user.subscriptions) {
      blogLinks.push(...(await this.getBlogLinksByProvider(blog)));
    }
    return blogLinks.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getLatestBlogLinks(
    provider: BlogProvidersType,
    scraperFn: () => Promise<BlogLinkBaseType[]>
  ): Promise<void> {
    const latestBlogLinks = await scraperFn();

    for (const link of latestBlogLinks) {
      const blogLink = await this.blogLinkRepository.getBlogLinkByURL(link.url);
      if (blogLink) {
        break;
      }
      console.log("Creating blog link: ", link);
      await this.createBlogLink({ ...link, blogName: provider });
    }
  }
}
