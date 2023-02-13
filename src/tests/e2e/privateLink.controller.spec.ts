import prisma from "@/infra/db/prisma";
import { app } from "@/infra/http/app";
import { redisClient } from "@/infra/redis/redisClient";
import { faker } from "@faker-js/faker";
import { CreateUserInputType } from "@user/user.schema";
import { PrivateLinkBaseType } from "@privateLink/privateLink.schema";
import request from "supertest";

describe("PrivateLinkController", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.disconnect();
  });

  afterEach(async () => {
    const deleteLinks = prisma.privateLink.deleteMany();
    const deleteUsers = prisma.user.deleteMany();
    await prisma.$transaction([deleteLinks, deleteUsers]);
  });

  const newUser: CreateUserInputType = {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(8),
  };

  it("Should be able to create a new private link", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    expect(responseLink.status).toBe(201);
    expect(responseLink.body).toHaveProperty("id");
    expect(responseLink.body).toHaveProperty("slug");
    expect(responseLink.body.url).toBe(newLink.url);
    expect(responseLink.body.title).toBe(newLink.title);
    expect(responseLink.body.userId).toEqual(loginResponse.body.id);
  });

  it("Should be able to get a private link", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseGetLink = await request(app)
      .get(`/pl/link/${responseLink.body.id}`)
      .set("Cookie", cookie);

    expect(responseGetLink.status).toBe(200);
    expect(responseGetLink.body).toHaveProperty("id");
    expect(responseGetLink.body).toHaveProperty("slug");
    expect(responseGetLink.body.url).toBe(newLink.url);
    expect(responseGetLink.body.title).toBe(newLink.title);
    expect(responseGetLink.body.userId).toEqual(loginResponse.body.id);
  });

  it("Should be able to get all private links", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const newLink2: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    await request(app).post("/pl").set("Cookie", cookie).send(newLink);
    await request(app).post("/pl").set("Cookie", cookie).send(newLink2);

    const responseGetLinks = await request(app)
      .get(`/pl/user/${loginResponse.body.id}`)
      .set("Cookie", cookie);

    expect(responseGetLinks.status).toBe(200);
    expect(responseGetLinks.body).toHaveLength(2);
  });

  it("Should be able to update a private link", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const updateLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseUpdateLink = await request(app)
      .put(`/pl/${responseLink.body.id}`)
      .set("Cookie", cookie)
      .send(updateLink);

    expect(responseUpdateLink.status).toBe(200);
    expect(responseUpdateLink.body).toHaveProperty("id");
    expect(responseUpdateLink.body).toHaveProperty("slug");
    expect(responseUpdateLink.body.url).toBe(updateLink.url);
    expect(responseUpdateLink.body.title).toBe(updateLink.title);
    expect(responseUpdateLink.body.userId).toEqual(loginResponse.body.id);
  });

  it("Should be able to delete a private link", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseDeleteLink = await request(app)
      .delete(`/pl/${responseLink.body.id}`)
      .set("Cookie", cookie);

    expect(responseDeleteLink.status).toBe(204);
  });

  it("Should not be able to create a private link without a valid cookie", async () => {
    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app).post("/pl").send(newLink);

    expect(responseLink.status).toBe(401);
  });

  it("Should not be able to get a private link without a valid cookie", async () => {
    const responseGetLink = await request(app).get("/pl/link/1");

    expect(responseGetLink.status).toBe(401);
  });

  it("Should not be able to get all private links without a valid cookie", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseGetLinks = await request(app).get(
      `/pl/user/${responseLink.body.id}`
    );

    expect(responseGetLinks.status).toBe(401);
  });

  it("Should not be able to update a private link without a valid cookie", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const updateLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseUpdateLink = await request(app)
      .put(`/pl/${responseLink.body.id}`)
      .send(updateLink);

    expect(responseUpdateLink.status).toBe(401);
  });

  it("Should not be able to delete a private link without a valid cookie", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseDeleteLink = await request(app).delete(
      `/pl/${responseLink.body.id}`
    );

    expect(responseDeleteLink.status).toBe(401);
  });

  it("Should not be able to create a private link with an invalid url", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: "invalid url",
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    expect(responseLink.status).toBe(400);
  });

  it("Should not be able to create a private link with an invalid title", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: "",
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    expect(responseLink.status).toBe(400);
  });

  it("Should not be able to update a private link with an invalid url", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const updateLink: PrivateLinkBaseType = {
      url: "invalid url",
      title: faker.lorem.sentence(5),
    };

    const responseUpdateLink = await request(app)
      .put(`/pl/${responseLink.body.id}`)
      .set("Cookie", cookie)
      .send(updateLink);

    expect(responseUpdateLink.status).toBe(400);
  });

  it("Should not be able to update a private link with an invalid title", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const updateLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: "",
    };

    const responseUpdateLink = await request(app)
      .put(`/pl/${responseLink.body.id}`)
      .set("Cookie", cookie)
      .send(updateLink);

    expect(responseUpdateLink.status).toBe(400);
  });

  it("Should not be able to update a private link with an invalid id", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const updateLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseUpdateLink = await request(app)
      .put(`/pl/invalid id`)
      .set("Cookie", cookie)
      .send(updateLink);

    expect(responseUpdateLink.status).toBe(400);
  });

  it("Should not be able to delete a private link with an invalid id", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseDeleteLink = await request(app)
      .delete(`/pl/invalid id`)
      .set("Cookie", cookie);

    expect(responseDeleteLink.status).toBe(400);
  });

  it("Should redirect with correct slug", async () => {
    await request(app).post("/user/create").send(newUser);

    const loginResponse = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = loginResponse.headers["set-cookie"][0].split(";")[0];

    const newLink: PrivateLinkBaseType = {
      url: faker.internet.url(),
      title: faker.lorem.sentence(5),
    };

    const responseLink = await request(app)
      .post("/pl")
      .set("Cookie", cookie)
      .send(newLink);

    const responseRedirect = await request(app).get(
      `/pl/${responseLink.body.slug}`
    );

    expect(responseRedirect.status).toBe(302);
  });
});
