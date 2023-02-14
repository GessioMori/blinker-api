import prisma from "@/infra/db/prisma";
import { app } from "@/infra/http/app";
import { redisClient } from "@/infra/redis/redisClient";
import { faker } from "@faker-js/faker";
import { CreateUserInputType } from "@user/user.schema";
import request from "supertest";

describe("BlogLinkController (e2e)", () => {
  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.disconnect();
  });

  afterEach(async () => {
    const deleteLinks = prisma.blogLink.deleteMany();
    const deleteUsers = prisma.user.deleteMany();
    await prisma.$transaction([deleteLinks, deleteUsers]);
  });

  const newUser: CreateUserInputType = {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(8),
  };

  it("should be able to get all blog links by user", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    await request(app).put("/user/subscription").set("Cookie", cookie).send({
      blogName: "DEVGO",
      action: "add",
    });

    const newBlogLink = await prisma.blogLink.create({
      data: {
        blogName: "DEVGO",
        url: "https://dev.to",
        slug: "dev-to",
        title: "Dev.to",
      },
    });

    const blogLinksResponse = await request(app)
      .get("/bl/user")
      .set("Cookie", cookie);

    expect(blogLinksResponse.status).toBe(200);
    expect(blogLinksResponse.body).toHaveLength(1);
    expect(blogLinksResponse.body[0].blogName).toBe(newBlogLink.blogName);
  });

  it("should be able to get all blog links by blog", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    await request(app).put("/user/subscription").set("Cookie", cookie).send({
      blogName: "DEVGO",
      action: "add",
    });

    const newBlogLink = await prisma.blogLink.create({
      data: {
        blogName: "DEVGO",
        url: "https://dev.to",
        slug: "dev-to",
        title: "Dev.to",
      },
    });

    await prisma.blogLink.create({
      data: {
        blogName: "TKDODO",
        url: "https://blog.to",
        slug: "tkdodoblog",
        title: "TKDODO",
      },
    });

    const blogLinksResponse = await request(app)
      .get("/bl/blog/DEVGO")
      .set("Cookie", cookie);

    expect(blogLinksResponse.status).toBe(200);
    expect(blogLinksResponse.body).toHaveLength(1);
    expect(blogLinksResponse.body[0].blogName).toBe(newBlogLink.blogName);
  });

  it("should be able to redirect to blog link", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    await request(app).put("/user/subscription").set("Cookie", cookie).send({
      blogName: "DEVGO",
      action: "add",
    });

    const newBlogLink = await prisma.blogLink.create({
      data: {
        blogName: "DEVGO",
        url: "https://tkdodo.to",
        slug: "dev-to",
        title: "Dev.to",
      },
    });

    const blogLinksResponse = await request(app)
      .get(`/bl/${newBlogLink.slug}`)
      .set("Cookie", cookie);

    expect(blogLinksResponse.status).toBe(302);
    expect(blogLinksResponse.header.location).toBe(newBlogLink.url);
  });
});
