import "reflect-metadata";
import { UserRepository } from "@user/repositories/user.repository";
import { CreateUserInputType } from "@user/user.schema";
import { UserService } from "@user/user.service";
import { UserRepositoryInMemory } from "../repositories/user.repository.memory";
import { faker } from "@faker-js/faker";
import { AppError } from "@/utils/errors/AppError";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const user: CreateUserInputType = {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    password: faker.internet.password(),
  };

  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    userService = new UserService(userRepository);
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  it("should be able to create a new user", async () => {
    const newUser = await userService.createUser(user);

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toBe(user.email);
    expect(newUser.name).toBe(user.name);
  });

  it("should not be able to create a new user with an email already registered", async () => {
    await userService.createUser(user);

    await expect(userService.createUser(user)).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to login with a valid email and password", async () => {
    const newUser = await userService.createUser(user);

    const loggedUser = await userService.login({
      email: newUser.email,
      password: user.password,
    });

    expect(loggedUser).toHaveProperty("id");
    expect(loggedUser.email).toBe(newUser.email);
    expect(loggedUser.name).toBe(newUser.name);
  });

  it("should not be able to login with a invalid email", async () => {
    await expect(
      userService.login({
        email: faker.internet.email(),
        password: user.password,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to login with a invalid password", async () => {
    await userService.createUser(user);

    await expect(
      userService.login({
        email: user.email,
        password: faker.internet.password(),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
