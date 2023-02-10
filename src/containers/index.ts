import { UserRepository } from "@user/repositories/user.repository";
import { UserService } from "@user/user.service";
import { container } from "tsyringe";
import { PrismaUserRepository } from "@user/repositories/implementations/user.repository.prisma";

// Repositories
container.registerSingleton<UserRepository>(
  "UserRepository",
  PrismaUserRepository
);

// Services
container.registerSingleton<UserService>("UserService", UserService);
