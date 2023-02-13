import { UserRepository } from "@user/repositories/user.repository";
import { UserService } from "@user/user.service";
import { container } from "tsyringe";
import { PrismaUserRepository } from "@user/repositories/implementations/user.repository.prisma";
import { PrivateLinkRepository } from "@privateLink/repositories/privateLink.repository";
import { PrismaPrivateLinkRepository } from "@privateLink/repositories/implementations/privateLink.repository.prisma";
import { PrivateLinkService } from "@privateLink/privateLink.service";
import { PrismaBlogLinkRepository } from "@blogLink/repositories/implementations/blogLink.repository.prisma";
import { BlogLinkRepository } from "@blogLink/repositories/blogLink.repository";
import { BlogLinkService } from "@blogLink/blogLink.service";

// Repositories
container.registerSingleton<UserRepository>(
  "UserRepository",
  PrismaUserRepository
);

container.registerSingleton<PrivateLinkRepository>(
  "PrivateLinkRepository",
  PrismaPrivateLinkRepository
);

container.registerSingleton<BlogLinkRepository>(
  "BlogLinkRepository",
  PrismaBlogLinkRepository
);

// Services
container.registerSingleton<UserService>("UserService", UserService);

container.registerSingleton<PrivateLinkService>(
  "PrivateLinkService",
  PrivateLinkService
);

container.registerSingleton<BlogLinkService>(
  "BlogLinkService",
  BlogLinkService
);
