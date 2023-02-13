import { inject, injectable } from "tsyringe";
import { BlogLinkService } from "./blogLink.service";
import { devGoScraper } from "./blogScrapers/devGo.scraper";
import { tkDodoScraper } from "./blogScrapers/tkDodo.scraper";
import { Request, Response } from "express";

@injectable()
export class BlogLinkController {
  constructor(
    @inject("BlogLinkService")
    private blogLinkService: BlogLinkService
  ) {}

  async handleUpdateLinks() {
    console.log("Updating links");
    await this.blogLinkService.getLatestBlogLinks("DEVGO", devGoScraper);
    await this.blogLinkService.getLatestBlogLinks("TKDODO", tkDodoScraper);
  }

  async handleGetBlogLinksByUser(request: Request, response: Response) {
    const { id } = request.session.user;

    const blogLinks = await this.blogLinkService.getBlogLinksByUserId(
      Number(id)
    );

    return response.status(200).json(blogLinks);
  }

  async handleGetBlogLinksByBlog(request: Request, response: Response) {
    const { blog } = request.params;

    const blogLinks = await this.blogLinkService.getBlogLinksByProvider(blog);

    return response.status(200).json(blogLinks);
  }

  async handleRedirectBlogLink(request: Request, response: Response) {
    const { slug } = request.params;

    const link = await this.blogLinkService.getBlogLinkBySlug(slug);

    return response.redirect(link.url);
  }
}
