import { inject, injectable } from "tsyringe";
import { BlogLinkService } from "./blogLink.service";
import { devGoScraper } from "./blogScrapers/devGo.scrapper";

@injectable()
export class BlogLinkController {
  constructor(
    @inject("BlogLinkService")
    private blogLinkService: BlogLinkService
  ) {}

  async handleUpdateLinks() {
    console.log("Updating links");
    await this.blogLinkService.getLatestBlogLinks("DEVGO", devGoScraper);
  }
}
