import prisma from "./../../../../db/prisma";
import { injectable } from "tsyringe";
import { createUserInputType, userOutputType } from "../../user.schema";
import { UserRepository } from "../user.repository";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async create(user: createUserInputType): Promise<userOutputType> {
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findById(id: number): Promise<userOutputType | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<userOutputType | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
