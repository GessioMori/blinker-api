import prisma from "@/infra/db/prisma";
import { app } from "@/infra/http/app";
import { redisClient } from "@/infra/redis/redisClient";
import { CreateUserInputType } from "@user/user.schema";
import { faker } from "@faker-js/faker";
import request from "supertest";

describe("UserController", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prisma.$disconnect();
    await redisClient.disconnect();
  });

  afterEach(async () => {
    const deleteUsers = prisma.user.deleteMany();
    await prisma.$transaction([deleteUsers]);
  });

  const newUser: CreateUserInputType = {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(8),
  };

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/user/create").send(newUser);
    expect(response.status).toBe(201);
  });

  it("Should be able to login", async () => {
    await request(app).post("/user/create").send(newUser);
    const response = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("Should be able to logout", async () => {
    await request(app).post("/user/create").send(newUser);
    const response = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = response.headers["set-cookie"][0].split(";")[0];

    const responseLogout = await request(app)
      .delete("/user/logout")
      .set("Cookie", cookie);

    expect(responseLogout.status).toBe(200);
  });

  it("Should be able to get user data", async () => {
    await request(app).post("/user/create").send(newUser);
    const response = await request(app).post("/user/login").send({
      email: newUser.email,
      password: newUser.password,
    });

    const cookie = response.headers["set-cookie"][0].split(";")[0];

    const responseGetUser = await request(app)
      .get("/user/me")
      .set("Cookie", cookie);

    expect(responseGetUser.status).toBe(200);
    expect(responseGetUser.body.email).toBe(newUser.email);
    expect(responseGetUser.body.name).toBe(newUser.name);
  });
});
