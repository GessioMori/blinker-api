import prisma from "@/infra/db/prisma";
import { CreateUserInputType, UserType } from "@user/user.schema";
import { UserRepository } from "@user/repositories/user.repository";

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
}
