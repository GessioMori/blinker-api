import { UserRepository } from "./../modules/user/repositories/user.repository";
import { UserService } from "./../modules/user/user.service";
import { container } from "tsyringe";
import { PrismaUserRepository } from "../modules/user/repositories/implementations/user.repository.prisma";
import { AuthService } from "./../modules/auth/auth.service";

// Repositories
container.registerSingleton<UserRepository>(
  "UserRepository",
  PrismaUserRepository
);

// Services
container.registerSingleton<UserService>("UserService", UserService);
container.registerSingleton<AuthService>("AuthService", AuthService);
