import { UserRepository } from "@user/repositories/user.repository";
import { UserService } from "@user/user.service";
import { container } from "tsyringe";
import { PrismaUserRepository } from "@user/repositories/implementations/user.repository.prisma";
import { PrivateLinkRepository } from "@privateLink/repositories/privateLink.repository";
import { PrismaPrivateLinkRepository } from "@privateLink/repositories/implementations/privateLink.repository.prisma";
import { PrivateLinkService } from "@privateLink/privateLink.service";

// Repositories
container.registerSingleton<UserRepository>(
  "UserRepository",
  PrismaUserRepository
);

container.registerSingleton<PrivateLinkRepository>(
  "PrivateLinkRepository",
  PrismaPrivateLinkRepository
);

// Services
container.registerSingleton<UserService>("UserService", UserService);
container.registerSingleton<PrivateLinkService>(
  "PrivateLinkService",
  PrivateLinkService
);
