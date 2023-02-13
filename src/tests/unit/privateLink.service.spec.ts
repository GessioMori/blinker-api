import "reflect-metadata";
import { PrivateLinkService } from "@privateLink/privateLink.service";
import { PrivateLinkRepository } from "@privateLink/repositories/privateLink.repository";
import { PrivateLinkRepositoryInMemory } from "../repositories/privateLink.repository.memory";
import { AppError } from "@/utils/errors/AppError";

describe("PrivateLinkService", () => {
  let privateLinkService: PrivateLinkService;
  let privateLinkRepository: PrivateLinkRepository;

  beforeEach(async () => {
    privateLinkRepository = new PrivateLinkRepositoryInMemory();
    privateLinkService = new PrivateLinkService(privateLinkRepository);
  });

  it("should be defined", () => {
    expect(privateLinkService).toBeDefined();
  });

  it("should be able to create a new private link", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    expect(privateLink).toHaveProperty("id");
    expect(privateLink.url).toBe("https://google.com");
    expect(privateLink.title).toBe("Google");
    expect(privateLink.slug).toHaveLength(10);
  });

  it("should be able to find a private link by id", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    const privateLinkFound = await privateLinkService.findById(privateLink.id);

    expect(privateLinkFound).toHaveProperty("id");
    expect(privateLinkFound?.url).toBe("https://google.com");
    expect(privateLinkFound?.title).toBe("Google");
    expect(privateLinkFound?.slug).toHaveLength(10);
  });

  it("should be able to find a private link by slug", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    const privateLinkFound = await privateLinkService.findBySlug(
      privateLink.slug
    );

    expect(privateLinkFound).toHaveProperty("id");
    expect(privateLinkFound?.url).toBe("https://google.com");
    expect(privateLinkFound?.title).toBe("Google");
    expect(privateLinkFound?.slug).toHaveLength(10);
  });

  it("should be able to find a private link by user id", async () => {
    const privateLink1 = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    const privateLink2 = await privateLinkService.create({
      userId: 1,
      url: "https://github.com",
      title: "GitHub",
    });

    const privateLinksFound = await privateLinkService.findByUserId(
      privateLink1.userId
    );

    expect(privateLinksFound).toHaveLength(2);
  });

  it("should be able to update a private link", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    const privateLinkUpdated = await privateLinkService.update({
      id: privateLink.id,
      userId: privateLink.userId,
      url: "https://github.com",
      title: "GitHub",
    });

    expect(privateLinkUpdated).toHaveProperty("id");
    expect(privateLinkUpdated?.url).toBe("https://github.com");
    expect(privateLinkUpdated?.title).toBe("GitHub");
    expect(privateLinkUpdated?.slug).toHaveLength(10);
  });

  it("should be able to delete a private link", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    const privateLinkDeleted = await privateLinkService.delete(
      privateLink.id,
      privateLink.userId
    );

    expect(privateLinkDeleted).toHaveProperty("id");
    expect(privateLinkDeleted?.url).toBe("https://google.com");
    expect(privateLinkDeleted?.title).toBe("Google");
    expect(privateLinkDeleted?.slug).toHaveLength(10);
  });

  it("should not be able to update a private link with a different user id", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    await expect(
      privateLinkService.update({
        id: privateLink.id,
        userId: 2,
        url: "https://github.com",
        title: "GitHub",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to delete a private link with a different user id", async () => {
    const privateLink = await privateLinkService.create({
      userId: 1,
      url: "https://google.com",
      title: "Google",
    });

    await expect(
      privateLinkService.delete(privateLink.id, 2)
    ).rejects.toBeInstanceOf(AppError);
  });
});
