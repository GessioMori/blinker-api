import "reflect-metadata";
import { BlogLinkService } from "@blogLink/blogLink.service";
import { devGoScraper } from "@blogLink/blogScrapers/devGo.scraper";
import { BlogLinkRepository } from "@blogLink/repositories/blogLink.repository";
import { UserRepository } from "@user/repositories/user.repository";
import { BlogLinkRepositoryInMemory } from "../repositories/blogLink.repository.memory";
import { UserRepositoryInMemory } from "../repositories/user.repository.memory";

describe("BlogLinkService", () => {
  let blogLinkService: BlogLinkService;
  let blogLinkRepository: BlogLinkRepository;
  let userRepository: UserRepository;

  const newBlogLink = {
    url: "https://google.com",
    title: "Google",
    blogName: "DEVGO",
  } as const;

  beforeEach(async () => {
    blogLinkRepository = new BlogLinkRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    blogLinkService = new BlogLinkService(blogLinkRepository, userRepository);
  });

  it("should be defined", () => {
    expect(blogLinkService).toBeDefined();
  });

  it("should be able to create a new blog link", async () => {
    const blogLink = await blogLinkService.createBlogLink(newBlogLink);

    expect(blogLink).toHaveProperty("id");
    expect(blogLink.url).toBe(newBlogLink.url);
    expect(blogLink.title).toBe(newBlogLink.title);
    expect(blogLink.slug).toHaveLength(10);
  });

  it("should be able to find a blog link by slug", async () => {
    const blogLink = await blogLinkService.createBlogLink(newBlogLink);

    const blogLinkFound = await blogLinkService.getBlogLinkBySlug(
      blogLink.slug
    );

    expect(blogLinkFound).toHaveProperty("id");
    expect(blogLinkFound?.url).toBe(newBlogLink.url);
    expect(blogLinkFound?.title).toBe(newBlogLink.title);
    expect(blogLinkFound?.slug).toHaveLength(10);
  });

  it("should be able to find a blog link by provider", async () => {
    await blogLinkService.createBlogLink(newBlogLink);

    await blogLinkService.createBlogLink({
      url: "https://twitter.com",
      title: "Twitter",
      blogName: "TKDODO",
    });

    const blogLinksFound = await blogLinkService.getBlogLinksByProvider(
      "DEVGO"
    );

    expect(blogLinksFound).toHaveLength(1);
    expect(blogLinksFound[0].url).toBe(newBlogLink.url);
    expect(blogLinksFound[0].title).toBe(newBlogLink.title);
    expect(blogLinksFound[0].slug).toHaveLength(10);
  });

  it("should be able to find a blog link by userId", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "123456789",
    });

    await userRepository.updateSubscriptions({
      userId: user.id,
      subscriptions: ["DEVGO"],
    });

    await blogLinkService.createBlogLink(newBlogLink);

    const blogLinksFound = await blogLinkService.getBlogLinksByUserId(user.id);

    expect(blogLinksFound).toHaveLength(1);
    expect(blogLinksFound[0].url).toBe(newBlogLink.url);
    expect(blogLinksFound[0].title).toBe(newBlogLink.title);
    expect(blogLinksFound[0].slug).toHaveLength(10);
  });

  it("should be able to find the latest blog links", async () => {
    await blogLinkService.getLatestBlogLinks("DEVGO", devGoScraper);

    const blogLinksFound = await blogLinkService.getBlogLinksByProvider(
      "DEVGO"
    );

    expect(blogLinksFound).toBeDefined();
    expect(blogLinksFound[0]).toHaveProperty("id");
    expect(blogLinksFound[0]).toHaveProperty("url");
  });
});
