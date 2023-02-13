import prisma from "@/infra/db/prisma";
import { CreateUserInputType, UserType } from "@user/user.schema";
import { UserRepository } from "@user/repositories/user.repository";
import { BlogProvidersType } from "@blogLink/blogLink.schema";
import { AppError } from "@/utils/errors/AppError";

export class PrismaUserRepository implements UserRepository {
  async create(user: CreateUserInputType): Promise<UserType> {
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        subscriptions: [],
      },
    });
  }

  async findById(id: number): Promise<UserType | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateSubscriptions({
    userId,
    subscriptions,
  }: {
    userId: number;
    subscriptions: BlogProvidersType[];
  }): Promise<UserType> {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        subscriptions,
      },
    });
  }
}
