import prisma from "@/db/prisma";
import { injectable } from "tsyringe";
import { CreateUserInputType, UserType } from "@user/user.schema";
import { UserRepository } from "@user/repositories/user.repository";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async create(user: CreateUserInputType): Promise<UserType> {
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
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
